from datetime import datetime

from pydantic import BaseModel, Field


class PostPlatformInput(BaseModel):
    platform: str


class MediaResponse(BaseModel):
    id: str
    file_url: str
    file_type: str
    is_profile_pic: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PostPlatformResponse(BaseModel):
    id: str
    platform: str
    status: str
    platform_post_id: str | None = None
    error_message: str | None = None

    model_config = {"from_attributes": True}


class PostCreateRequest(BaseModel):
    title: str | None = Field(default=None, max_length=160)
    content: str = Field(min_length=1)
    hook: str | None = Field(default=None, max_length=255)
    hashtags: list[str] = Field(default_factory=list)
    tone: str | None = Field(default=None, max_length=32)
    status: str = "draft"
    scheduled_time: datetime | None = None
    timezone: str = "Asia/Calcutta"
    platform_ids: list[str] = Field(default_factory=list)
    media_ids: list[str] = Field(default_factory=list)


class PostUpdateRequest(BaseModel):
    title: str | None = Field(default=None, max_length=160)
    content: str | None = None
    hook: str | None = Field(default=None, max_length=255)
    hashtags: list[str] | None = None
    tone: str | None = Field(default=None, max_length=32)
    status: str | None = None
    scheduled_time: datetime | None = None
    timezone: str | None = None
    platform_ids: list[str] | None = None
    media_ids: list[str] | None = None


class PostResponse(BaseModel):
    id: str
    user_id: str
    title: str | None = None
    content: str
    hook: str | None = None
    hashtags: str | None = None
    tone: str | None = None
    status: str
    scheduled_time: datetime | None = None
    published_at: datetime | None = None
    timezone: str
    created_at: datetime
    updated_at: datetime
    platforms: list[PostPlatformResponse] = Field(default_factory=list)
    media_items: list[MediaResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class CalendarItem(BaseModel):
    id: str
    title: str
    date: datetime | None
    status: str
    platforms: list[str]


class WorkflowRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    trigger_event: str = Field(min_length=2, max_length=64)
    action: str = Field(min_length=2)
    is_active: bool = True


class WorkflowResponse(BaseModel):
    id: str
    user_id: str
    name: str
    trigger_event: str
    action: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
