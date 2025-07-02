from fastapi import FastAPI
from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title="Stable Diffusion Studio API",
    description="Backend được thiết kế theo kiến trúc MVC để tìm kiếm và tạo ảnh.",
    version="1.0.0",
)

print(f"✅ Backend đang chạy trên thiết bị: {settings.DEVICE.upper()}")

@app.get("/", tags=["Status"])
def root():
    return {"message": "Chào mừng đến với Stable Diffusion Studio API!"}

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)