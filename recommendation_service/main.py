import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import redis
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware  # ✅ Import CORS

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# ✅ Allow CORS for local frontend
origins = [
    "http://localhost:3000",
    "https://localhost:3000",  # If frontend runs with HTTPS
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
mongo_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongo_client[os.getenv("MONGODB_DB")]

# Connect to Redis
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)


# Custom JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# Models
class Interaction(BaseModel):
    email: str  # Using email instead of user_id
    product_id: str
    interaction_type: str  # "view", "click", "purchase", etc.
    timestamp: Optional[datetime] = None


class RecommendationRequest(BaseModel):
    email: str  # Using email instead of user_id
    count: int = 10


# API Endpoints
@app.post("/api/track")
async def track_interaction(interaction: Interaction):
    """Track user interactions (views, clicks, purchases)"""
    interaction_dict = interaction.dict()
    interaction_dict["timestamp"] = datetime.now()

    # Store in MongoDB
    db.user_interactions.insert_one(interaction_dict)

    # Invalidate cached recommendations using email
    cache_key = f"recommendations:{interaction.email}"
    redis_client.delete(cache_key)

    return {"status": "success"}


@app.get("/api/recommendations/{email}")
async def get_recommendations(email: str, count: int = 10):
    """Get personalized recommendations"""
    cache_key = f"recommendations:{email}"

    # Check Redis cache first
    if cached := redis_client.get(cache_key):
        return {"products": json.loads(cached), "cache_hit": True}

    # Generate recommendations (simplified example)
    recommendations = list(db.products.find().limit(count))

    # Convert recommendations to JSON-serializable format
    serialized_recommendations = jsonable_encoder(recommendations, custom_encoder={ObjectId: str})

    # Cache for 1 hour
    redis_client.setex(cache_key, 3600, json.dumps(serialized_recommendations))

    return {"products": serialized_recommendations, "cache_hit": False}
