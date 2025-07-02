from pydantic import BaseModel

class ModelSearchResponse(BaseModel):
    models: list[str]