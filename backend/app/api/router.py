from fastapi import APIRouter
from app.api.endpoints import generation, models

api_router = APIRouter()

api_router.include_router(models.router, prefix="/models", tags=["Models"])
api_router.include_router(generation.router, prefix="/image", tags=["Image Generation"])