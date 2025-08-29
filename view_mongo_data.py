#!/usr/bin/env python3
"""
Performance-optimized MongoDB data viewer
"""
import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

load_dotenv()

async def view_mongo_data():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("❌ MONGO_URI not found in .env file")
        return
    
    try:
        # Connect to MongoDB with optimized settings
        client = AsyncIOMotorClient(
            mongo_uri,
            maxPoolSize=1,  # Reduce connection pool for single use
            serverSelectionTimeoutMS=5000,  # Faster timeout
            connectTimeoutMS=5000
        )
        db = client.get_database("bajaj_app")
        
        print("🔗 Connected to MongoDB successfully!")
        print(f"📊 Database: {db.name}")
        
        # List collections efficiently
        collections = await db.list_collection_names()
        print(f"📁 Collections: {collections}")
        
        # View search_history data with optimized query
        if "search_history" in collections:
            print("\n📋 SEARCH HISTORY (Latest 10):")
            print("-" * 50)
            
            # Use projection to only fetch needed fields
            projection = {
                'user_id': 1, 
                'query': 1, 
                'decision': 1, 
                'amount': 1, 
                'created_at': 1
            }
            
            cursor = db.search_history.find(
                {}, 
                projection
            ).sort("created_at", -1).limit(10)
            
            async for doc in cursor:
                user_id = doc.get('user_id', 'N/A')
                query = doc.get('query', 'N/A')[:80] + "..." if len(doc.get('query', '')) > 80 else doc.get('query', 'N/A')
                decision = doc.get('decision', 'N/A')
                amount = doc.get('amount', 'N/A')
                date = doc.get('created_at', 'N/A')
                
                if isinstance(date, datetime):
                    date = date.strftime("%Y-%m-%d %H:%M")
                
                print(f"👤 User: {user_id}")
                print(f"❓ Query: {query}")
                print(f"✅ Decision: {decision}")
                print(f"💰 Amount: {amount}")
                print(f"📅 Date: {date}")
                print("-" * 30)
        
        # View users data efficiently
        if "users" in collections:
            print("\n👥 USERS (First 5):")
            print("-" * 50)
            
            projection = {'_id': 1, 'email': 1}
            cursor = db.users.find({}, projection).limit(5)
            
            async for doc in cursor:
                user_id = str(doc.get('_id', 'N/A'))
                email = doc.get('email', 'N/A')
                print(f"🆔 User ID: {user_id}")
                print(f"📧 Email: {email}")
                print("-" * 30)
        
        # Count documents efficiently
        print("\n📊 Database Statistics:")
        print("-" * 50)
        
        # Use count_documents with empty filter for better performance
        search_count = await db.search_history.count_documents({})
        users_count = await db.users.count_documents({})
        
        print(f"📋 Search History: {search_count:,} documents")
        print(f"👥 Users: {users_count:,} documents")
        print(f"📈 Total: {search_count + users_count:,} documents")
        
        # Performance tips
        if search_count > 100:
            print(f"\n💡 Performance Tip: Consider adding indexes on 'created_at' and 'user_id' fields")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"💡 Make sure MongoDB is running and accessible")
    finally:
        client.close()
        print(f"\n🔌 Connection closed")

if __name__ == "__main__":
    print("🚀 Starting MongoDB Data Viewer...")
    asyncio.run(view_mongo_data())
