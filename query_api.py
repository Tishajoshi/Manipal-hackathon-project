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
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()  # Load keys from .env file

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "policy-index-1536")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()  # 'openai' or 'none'
USE_LOCAL_EMBEDDINGS = os.getenv("USE_LOCAL_EMBEDDINGS", "false").lower() == "true"
MONGO_URI = os.getenv("MONGO_URI")

client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL, timeout=10.0) if OPENAI_API_KEY else None

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

# --- Embeddings (OpenAI with local fallback) ---
EMBED_DIM = 1536  # text-embedding-3-small
_sentence_model = None

def _get_sentence_model():
    global _sentence_model
    if _sentence_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _sentence_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
            print("✅ Local embedding model loaded successfully")
        except ImportError as e:
            print("❌ sentence-transformers not installed. Installing now...")
            import subprocess
            import sys
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "sentence-transformers"])
                from sentence_transformers import SentenceTransformer
                _sentence_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
                print("✅ Local embedding model installed and loaded")
            except Exception as install_error:
                print(f"❌ Failed to install sentence-transformers: {install_error}")
                raise RuntimeError("sentence-transformers is required for local embeddings") from install_error
        except Exception as e:
            print(f"❌ Failed to load sentence-transformers model: {e}")
            raise RuntimeError(f"Failed to load local embedding model: {e}") from e
    return _sentence_model

def _expand_to_dim(vector, target_dim: int):
    if len(vector) == target_dim:
        return vector
    if len(vector) > target_dim:
        return vector[:target_dim]
    return vector + [0.0] * (target_dim - len(vector))

# Preload local embedding model only if enabled
if USE_LOCAL_EMBEDDINGS:
    print("🔄 Loading local embedding model (this may take 10-30 seconds on first run)...")
    try:
        _get_sentence_model()
        print("✅ Local embedding model preloaded successfully!")
    except Exception as e:
        print("⚠️ Failed to preload local embedding model:", e)
        print("💡 The model will load on first request (slower)")
else:
    print("✅ Local embeddings disabled - using OpenAI embeddings only")

def embed_text(text: str) -> list:
    use_local = USE_LOCAL_EMBEDDINGS or not OPENAI_API_KEY
    
    # Try OpenAI first if available and not forced to use local
    if not use_local and client is not None:
        try:
            resp = client.embeddings.create(model=OPENAI_EMBED_MODEL, input=text)
            return resp.data[0].embedding
        except Exception as e:
            print("⚠️ OpenAI embedding failed; falling back to local model:", e)
    
    # Fallback to local model
    try:
        model = _get_sentence_model()
        local_vec = model.encode(text).tolist()
        return _expand_to_dim(local_vec, EMBED_DIM)
    except Exception as e:
        print(f"❌ Local embedding also failed: {e}")
        # Return a simple fallback vector to prevent complete failure
        fallback_vector = [0.1] * EMBED_DIM
        return fallback_vector

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

"""-------------------- MongoDB (users + history) --------------------"""
mongo_client: Optional[AsyncIOMotorClient] = None
history_collection = None
users_collection = None

if MONGO_URI:
    try:
        mongo_client = AsyncIOMotorClient(MONGO_URI)
        db = mongo_client.get_database("bajaj_app")
        history_collection = db.get_collection("search_history")
        users_collection = db.get_collection("users")
        print("✅ Connected to MongoDB (collections: users, search_history)")
    except Exception as e:
        print("⚠️ Mongo connection failed:", e)


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
    """Return a single preferred model to keep latency predictable."""
    normalized = (primary_model or "").strip()
    return [normalized or "gpt-4o-mini"]


async def call_openai_for_json(messages: List[Dict[str, str]], models_to_try: List[str]) -> Dict[str, Any]:
    """Call LLM for structured JSON. Supports disabling LLM usage via LLM_PROVIDER=none."""
    if LLM_PROVIDER == "none":
        return {
            "decision": "unknown",
            "amount": None,
            "justification": "LLM disabled. Retrieved relevant clauses and prepared summary context, but cannot generate a decision without an LLM.",
        }

    if client is None:
        raise RuntimeError("OPENAI_API_KEY missing and LLM_PROVIDER is not 'none'. Set a key or set LLM_PROVIDER=none")

    last_error: Optional[Exception] = None
    for model_name in models_to_try:
        try:
            print(f"🧠 Calling OpenAI model: {model_name}")
            def _call():
                return client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.2,
                    timeout=10.0,
                )
            response = await asyncio.wait_for(asyncio.to_thread(_call), timeout=12.0)
            content = response.choices[0].message.content
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
    user_id: Optional[str] = None
    user_email: Optional[str] = None

@app.post("/run")
async def run_query(data: Query):
    import time
    start_time = time.time()
    print("🚀 Endpoint hit")
    print(f"📩 Received query: {data.query[:100]}...")

    # Step 1: Generate query embedding
    try:
        embedding_start = time.time()
        query_vector = await asyncio.wait_for(asyncio.to_thread(embed_text, data.query), timeout=8.0)
        embedding_time = time.time() - embedding_start
        print(f"✅ Query embedding created in {embedding_time:.2f}s")
    except Exception as e:
        print("❌ Embedding failed:", e)
        return {"decision": None, "amount": None, "justification": "Embedding failed"}

    # Step 2: Query Pinecone
    try:
        def _q():
            return index.query(vector=query_vector, top_k=3, include_metadata=True)
        pinecone_res = await asyncio.wait_for(asyncio.to_thread(_q), timeout=6.0)
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
        parsed = await call_openai_for_json(messages, candidate_models)

        # Save history if Mongo is available
        try:
            if history_collection is not None:
                doc = {
                    "user_id": data.user_id,
                    "user_email": data.user_email,
                    "query": data.query,
                    "decision": parsed.get("decision"),
                    "amount": parsed.get("amount"),
                    "justification": parsed.get("justification"),
                    "created_at": datetime.utcnow(),
                }
                await history_collection.insert_one(doc)
        except Exception as e:
            print("⚠️ Failed to write history:", e)

        total_time = time.time() - start_time
        print(f"🎯 Total response time: {total_time:.2f}s")
        return {
            "decision": parsed.get("decision"),
            "amount": parsed.get("amount"),
            "justification": parsed.get("justification"),
            "response_time": f"{total_time:.2f}s"
        }
    except Exception as e:
        total_time = time.time() - start_time
        print(f"❌ GPT call or JSON parse failed in {total_time:.2f}s:", e)
        return {
            "decision": None,
            "amount": None,
            "justification": "GPT processing failed",
            "response_time": f"{total_time:.2f}s"
        }


@app.get("/history/{user_id}")
async def get_history(user_id: str, limit: int = 20):
    if history_collection is None:
        raise HTTPException(status_code=503, detail="History store not configured")
    cursor = history_collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
    items: List[Dict[str, Any]] = []
    async for item in cursor:
        item.pop("_id", None)
        items.append(item)
    return {"items": items}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
