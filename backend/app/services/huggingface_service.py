from huggingface_hub import list_models

def search_models_on_hub(query: str, limit: int = 10) -> list[str]:
    models = list_models(
        search=query,
        task="text-to-image",
        library="diffusers",
        sort="downloads",
        direction=-1,
        limit=limit,
        fetch_config=False
    )
    return [m.modelId for m in models]