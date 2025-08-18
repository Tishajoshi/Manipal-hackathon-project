# extract.py
import os
import fitz  # PyMuPDF
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# --- Load environment variables ---
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "policy-index")

# --- Initialize Pinecone ---
pc = Pinecone(api_key=PINECONE_API_KEY)

if PINECONE_INDEX not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=384,
        metric='cosine',
        spec=ServerlessSpec(cloud='aws', region='us-east-1')
    )

index = pc.Index(PINECONE_INDEX)

# --- Load Sentence Transformer ---
model = SentenceTransformer("all-MiniLM-L6-v2")

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
        vec = model.encode(chunk).tolist()
        vectors.append({
            "id": f"{file}_chunk{i}",
            "values": vec,
            "metadata": {"source": file, "text": chunk}
        })

    index.upsert(vectors=vectors)
    print(f"✅ Uploaded {len(vectors)} chunks from {file}")
