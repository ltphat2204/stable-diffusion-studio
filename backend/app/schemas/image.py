from pydantic import BaseModel, Field

class GenerateRequest(BaseModel):
    model_id: str = Field(..., example="prompthero/openjourney-v4")
    prompt: str = Field(..., example="An epic fantasy landscape.")
    negative_prompt: str | None = Field(default="", example="blurry, low quality")
    height: int = Field(default=512, ge=128, le=1024)
    width: int = Field(default=512, ge=128, le=1024)
    num_steps: int = Field(default=25, ge=10, le=100)
    guidance_scale: float = Field(default=7.5, ge=1.0, le=20.0)

class GenerateResponse(BaseModel):
    image_base64: str
    metadata: GenerateRequest