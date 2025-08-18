from pinecone import Pinecone
import os
from dotenv import load_dotenv

# Load keys from .env
load_dotenv()

# Connect to Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX", "policy-index"))

# Show stats
res = index.describe_index_stats()
print(res)
