import gc
import torch
from cachetools import LRUCache
from diffusers import StableDiffusionPipeline
from app.core.config import settings

class ModelCacheManager:
    def __init__(self, cache_size: int = 1):
        self.cache = LRUCache(maxsize=cache_size)
        print(f"✅ Khởi tạo ModelCacheManager với kích thước cache = {cache_size}")

    def _clear_gpu_cache(self):
        gc.collect()
        if settings.DEVICE == "cuda":
            torch.cuda.empty_cache()
        print("🗑️ Đã dọn dẹp bộ nhớ GPU cache.")

    def _load_pipeline(self, model_id: str) -> StableDiffusionPipeline:
        print(f"⏳ Bắt đầu tải model '{model_id}'...")
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16,
            use_safetensors=True
        )
        pipe.to(settings.DEVICE)
        print(f"✅ Tải thành công model '{model_id}'.")
        return pipe

    def get_pipeline(self, model_id: str) -> StableDiffusionPipeline:
        if model_id in self.cache:
            print(f"👍 Sử dụng model đã cache: '{model_id}'")
            return self.cache[model_id]

        print(f"🔄 Cache miss. Cần tải model mới: '{model_id}'")
        self._clear_gpu_cache()
        pipe = self._load_pipeline(model_id)
        self.cache[model_id] = pipe
        return pipe

cache_manager = ModelCacheManager()