import torch

class Settings:
    DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"

settings = Settings()