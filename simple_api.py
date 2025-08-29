# simple_api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# --- HEALTH CHECK ROUTES ---
@app.get("/")
async def root():
    return {"message": "API is running!", "status": "ok"}

@app.get("/ping")
async def ping():
    return {"message": "pong"}

# --- MOCK DATA ROUTES ---
@app.get("/api/data")
async def get_data():
    return {
        "items": [
            {"id": 1, "name": "Item 1", "description": "This is item 1"},
            {"id": 2, "name": "Item 2", "description": "This is item 2"},
            {"id": 3, "name": "Item 3", "description": "This is item 3"}
        ]
    }

# Add a route without the /api prefix for testing
@app.get("/data")
async def get_data_alt():
    return {
        "items": [
            {"id": 1, "name": "Item 1", "description": "This is item 1"},
            {"id": 2, "name": "Item 2", "description": "This is item 2"},
            {"id": 3, "name": "Item 3", "description": "This is item 3"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)