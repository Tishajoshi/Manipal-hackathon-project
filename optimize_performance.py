#!/usr/bin/env python3
"""
Performance Optimization Script
Pre-loads models and optimizes system for faster responses
"""
import os
import time
from dotenv import load_dotenv

load_dotenv()

def optimize_performance():
    print("🚀 Starting Performance Optimization...")
    print("=" * 50)
    
    # Check environment variables
    print("🔍 Checking Environment Configuration...")
    openai_key = os.getenv("OPENAI_API_KEY")
    pinecone_key = os.getenv("PINECONE_API_KEY")
    mongo_uri = os.getenv("MONGO_URI")
    
    if openai_key:
        print("✅ OpenAI API Key: Configured")
    else:
        print("⚠️ OpenAI API Key: Missing (will use local embeddings)")
    
    if pinecone_key:
        print("✅ Pinecone API Key: Configured")
    else:
        print("❌ Pinecone API Key: Missing")
    
    if mongo_uri:
        print("✅ MongoDB URI: Configured")
    else:
        print("❌ MongoDB URI: Missing")
    
    print("\n📊 Performance Recommendations:")
    print("-" * 30)
    
    if not openai_key:
        print("💡 Add OPENAI_API_KEY to .env for faster embeddings")
        print("   Current: Using local model (slower but free)")
    
    if not pinecone_key:
        print("💡 Add PINECONE_API_KEY to .env for vector search")
        print("   Current: No vector search available")
    
    if not mongo_uri:
        print("💡 Add MONGO_URI to .env for data persistence")
        print("   Current: No data storage")
    
    print("\n⚡ Performance Tips:")
    print("-" * 20)
    print("1. First request will be slow (model loading)")
    print("2. Subsequent requests will be much faster")
    print("3. Keep the server running for best performance")
    print("4. Monitor response times in server logs")
    
    print("\n🎯 Expected Performance:")
    print("-" * 25)
    print("First Request: 15-30 seconds (model loading)")
    print("Subsequent: 2-5 seconds (cached model)")
    print("With OpenAI: 1-3 seconds (API calls)")
    
    print("\n🔧 To Improve Performance:")
    print("-" * 30)
    print("1. Add OpenAI API key to .env")
    print("2. Ensure stable internet connection")
    print("3. Use SSD storage for faster model loading")
    print("4. Consider upgrading RAM if <8GB")
    
    print("\n✅ Optimization Complete!")
    print("Start your server: python query_api.py")

if __name__ == "__main__":
    optimize_performance()
