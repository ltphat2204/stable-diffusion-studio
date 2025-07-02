from fastapi import APIRouter, HTTPException
from app.services import huggingface_service
from app.schemas.model import ModelSearchResponse

router = APIRouter()

@router.get("/search", response_model=ModelSearchResponse)
async def search_models(query: str, limit: int = 10):
    try:
        model_ids = huggingface_service.search_models_on_hub(query, limit)
        return ModelSearchResponse(models=model_ids)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Lỗi khi giao tiếp với Hugging Face Hub: {e}")