import io
import base64
from PIL import Image
from app.core.cache import cache_manager
from app.schemas.image import GenerateRequest

def _image_to_base64(image: Image.Image) -> str:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def generate_image_from_prompt(request: GenerateRequest) -> str:
    try:
        pipe = cache_manager.get_pipeline(request.model_id)

        print(f"🎨 Bắt đầu tạo ảnh với prompt: '{request.prompt[:50]}...'")
        image = pipe(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            height=request.height,
            width=request.width,
            num_inference_steps=request.num_steps,
            guidance_scale=request.guidance_scale,
        ).images[0]
        print("✅ Tạo ảnh thành công.")

        return _image_to_base64(image)
    except Exception as e:
        print(f"❌ Lỗi trong quá trình tạo ảnh: {e}")
        raise e