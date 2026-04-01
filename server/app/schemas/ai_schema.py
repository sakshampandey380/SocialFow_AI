from datetime import datetime

from pydantic import BaseModel, Field


class AIContentGenerateRequest(BaseModel):
    prompt: str = Field(min_length=5)
    tone: str = Field(default="professional", max_length=32)
    platform: str | None = Field(default="all", max_length=32)


class AIContentResponse(BaseModel):
    id: str
    prompt: str
    generated_caption: str
    hashtags: str
    hook: str | None = None
    tone: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AIContentPreview(BaseModel):
    caption: str
    hashtags: list[str]
    hook: str
    tone: str
