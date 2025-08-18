# query_api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
import json
import os
from dotenv import load_dotenv
import re
from typing import Optional, List, Dict, Any

load_dotenv()  # Load keys from .env file

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "policy-index-1536")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")

client = OpenAI(api_key=OPENAI_API_KEY)

# Basic runtime diagnostics (do not print the key itself)
if not OPENAI_API_KEY or len(OPENAI_API_KEY.strip()) == 0:
    print("⚠️ OPENAI_API_KEY is missing or empty. Ensure it is set in a .env file or environment.")
else:
    print("✅ Detected OPENAI_API_KEY in environment (hidden)")

# Resolve model preference with a safe fallback
PRIMARY_OPENAI_MODEL = (OPENAI_MODEL or "gpt-3.5-turbo").strip()
print(f"🔧 Configured OpenAI model: {PRIMARY_OPENAI_MODEL}")

# Initialize app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # In production, restrict this to your Vercel domain.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HEALTH CHECK ROUTE ---
@app.get("/ping")
async def ping():
    print("✅ Pinged FastAPI")
    return {"message": "pong"}

# --- Embeddings ---
# To fit within low-memory hosts (e.g., Render free tier), we use
# OpenAI's hosted embeddings instead of loading a local transformer.
EMBED_DIM = 1536  # text-embedding-3-small

def embed_text(text: str) -> list:
    resp = client.embeddings.create(model=OPENAI_EMBED_MODEL, input=text)
    return resp.data[0].embedding

# Connect to Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
if PINECONE_INDEX not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=EMBED_DIM,
        metric='cosine',
        spec=ServerlessSpec(cloud='aws', region='us-east-1')
    )
index = pc.Index(PINECONE_INDEX)


def extract_json_object_from_text(text: str) -> Optional[Dict[str, Any]]:
    """Attempt to extract a JSON object from arbitrary text.

    Tries strict JSON parse first, then looks for ```json code blocks,
    then falls back to the broadest {...} slice.
    """
    try:
        return json.loads(text)
    except Exception:
        pass

    # Look for fenced JSON block
    fenced = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", text, re.IGNORECASE)
    if fenced:
        candidate = fenced.group(1)
        try:
            return json.loads(candidate)
        except Exception:
            pass

    # Broadest {...} slice
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start : end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            return None
    return None


def get_candidate_models(primary_model: str) -> List[str]:
    """Return an ordered list of models to try, preferring a reliable small model first."""
    candidates: List[str] = []
    # Prefer 4o-mini first for broad availability and cost
    candidates.append("gpt-4o-mini")
    normalized = (primary_model or "").strip()
    if normalized and normalized not in candidates:
        candidates.append(normalized)
    # Include a legacy/chat model fallback
    if "gpt-3.5-turbo" not in candidates:
        candidates.append("gpt-3.5-turbo")
    return candidates


def call_openai_for_json(messages: List[Dict[str, str]], models_to_try: List[str]) -> Dict[str, Any]:
    """Call OpenAI ChatCompletion across a list of models until one succeeds.

    Returns the parsed JSON dict.
    Raises the last exception if all attempts fail.
    """
    last_error: Optional[Exception] = None
    for model_name in models_to_try:
        try:
            print(f"🧠 Calling OpenAI model: {model_name}")
            response = client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.2,
            )
            content = response.choices[0].message.content
            print("🔁 Raw model content:", content)
            parsed = extract_json_object_from_text(content)
            if parsed is None:
                raise ValueError("Model returned non-JSON content")
            return parsed
        except Exception as e:
            print(f"⚠️ OpenAI call failed for model '{model_name}':", e)
            last_error = e
            continue
    assert last_error is not None
    raise last_error

class Query(BaseModel):
    query: str

@app.post("/run")
async def run_query(data: Query):
    print("🚀 Endpoint hit")
    print(f"📩 Received query: {data.query[:100]}...")

    # Step 1: Generate query embedding
    try:
        query_vector = embed_text(data.query)
        print("✅ Query embedding created")
    except Exception as e:
        print("❌ Embedding failed:", e)
        return {"decision": None, "amount": None, "justification": "Embedding failed"}

    # Step 2: Query Pinecone
    try:
        pinecone_res = index.query(vector=query_vector, top_k=5, include_metadata=True)
        matches = pinecone_res.get('matches', [])
        print(f"🔍 Pinecone matches: {len(matches)}")
    except Exception as e:
        print("❌ Pinecone query failed:", e)
        return {"decision": None, "amount": None, "justification": "Pinecone query failed"}

    # Step 3: Show chunks
    chunks = [m['metadata']['text'] for m in matches if 'metadata' in m and 'text' in m['metadata']]
    print(f"🧩 Extracted chunks: {len(chunks)}")

    if not chunks:
        print("⚠️ No text chunks found in matches")
        return {
            "decision": None,
            "amount": None,
            "justification": "No relevant policy text found."
        }

    # Step 4: GPT prompt
    prompt = f"Query: {data.query}\n\nRelevant Clauses:\n" + "\n".join(chunks)
    system_msg = "You are an insurance policy assistant. Analyze the query based on the clauses."
    user_msg = "Respond ONLY in JSON with keys: decision, amount, justification. No explanation text."

    try:
        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt},
            {"role": "user", "content": user_msg},
        ]
        candidate_models = get_candidate_models(PRIMARY_OPENAI_MODEL)
        parsed = call_openai_for_json(messages, candidate_models)
        return {
            "decision": parsed.get("decision"),
            "amount": parsed.get("amount"),
            "justification": parsed.get("justification"),
        }
    except Exception as e:
        print("❌ GPT call or JSON parse failed:", e)
        return {
            "decision": None,
            "amount": None,
            "justification": "GPT processing failed"
        }
