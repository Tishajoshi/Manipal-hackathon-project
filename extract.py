# extract.py
import os
import fitz  # PyMuPDF
import re
import numpy as np
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dotenv import load_dotenv

# --- Load environment variables ---
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "policy-index-1536")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
USE_LOCAL_EMBEDDINGS = os.getenv("USE_LOCAL_EMBEDDINGS", "false").lower() == "true"

# Embedding dimensionality for text-embedding-3-small
EMBED_DIM = 1536

# --- Initialize Pinecone ---
pc = Pinecone(api_key=PINECONE_API_KEY)

if PINECONE_INDEX not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=EMBED_DIM,
        metric='cosine',
        spec=ServerlessSpec(cloud='aws', region='us-east-1')
    )

index = pc.Index(PINECONE_INDEX)

# --- Embeddings (OpenAI with local fallback) ---
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL) if OPENAI_API_KEY else None
_sentence_model = None

def _get_sentence_model():
    global _sentence_model
    if _sentence_model is None:
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as e:
            raise RuntimeError("sentence-transformers is required for local embeddings; run 'pip install -r requirements.txt'") from e
        _sentence_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _sentence_model

def _expand_to_dim(vector, target_dim: int):
    # Pad with zeros or truncate to fit target_dim
    if len(vector) == target_dim:
        return vector
    if len(vector) > target_dim:
        return vector[:target_dim]
    return vector + [0.0] * (target_dim - len(vector))

def embed_text(text: str) -> list:
    use_local = USE_LOCAL_EMBEDDINGS or not OPENAI_API_KEY
    if not use_local and client is not None:
        try:
            resp = client.embeddings.create(model=OPENAI_EMBED_MODEL, input=text)
            return resp.data[0].embedding
        except Exception as e:
            # Fallback to local model on quota/any error
            print("⚠️ OpenAI embedding failed; falling back to local model:", e)
    # Local fallback
    model = _get_sentence_model()
    local_vec = model.encode(text).tolist()
    return _expand_to_dim(local_vec, EMBED_DIM)

# --- Utility functions ---
def extract_text_from_pdf(pdf_path):
    text = ""
    doc = fitz.open(pdf_path)
    for page in doc:
        text += page.get_text()
    return text

def chunk_text(text, chunk_size=500):
    words = text.split()
    chunks = []
    chunk = ""
    for word in words:
        if len(chunk) + len(word) + 1 < chunk_size:
            chunk += word + " "
        else:
            chunks.append(chunk.strip())
            chunk = word + " "
    if chunk:
        chunks.append(chunk.strip())
    return chunks

# --- Process your PDFs ---
pdf_files = ["d1.pdf", "d2.pdf", "d3.pdf", "d4.pdf", "d5.pdf"]

for file in pdf_files:
    if not os.path.exists(file):
        print(f"⚠️ Missing file: {file}")
        continue

    print(f"📄 Processing: {file}")
    text = extract_text_from_pdf(file)
    chunks = chunk_text(text)

    vectors = []
    for i, chunk in enumerate(chunks):
        vec = embed_text(chunk)
        vectors.append({
            "id": f"{file}_chunk{i}",
            "values": vec,
            "metadata": {"source": file, "text": chunk}
        })

    # Upsert in small batches to avoid 4MB request limit
    batch_size = 50
    total = len(vectors)
    for start in range(0, total, batch_size):
        end = min(start + batch_size, total)
        index.upsert(vectors=vectors[start:end])
    print(f"✅ Uploaded {len(vectors)} chunks from {file}")
