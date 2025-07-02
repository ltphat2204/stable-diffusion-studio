from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from app.services import diffusion_service
from app.schemas.image import GenerateRequest, GenerateResponse

router = APIRouter()

@router.post("/generate", response_model=GenerateResponse)
async def generate_image(request: GenerateRequest):
    try:
        image_base64 = await run_in_threadpool(
            diffusion_service.generate_image_from_prompt, request
        )
        return GenerateResponse(image_base64=image_base64, metadata=request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))