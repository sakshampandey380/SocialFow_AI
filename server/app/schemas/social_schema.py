from datetime import datetime

from pydantic import BaseModel, Field


class SocialConnectRequest(BaseModel):
    platform: str = Field(min_length=2, max_length=32)
    account_name: str = Field(min_length=2, max_length=120)
    access_token: str = Field(min_length=3)
    refresh_token: str | None = None
    account_identifier: str | None = None
    token_expiry: datetime | None = None


class SocialAccountResponse(BaseModel):
    id: str
    platform: str
    account_name: str
    account_identifier: str | None = None
    token_expiry: datetime | None = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SocialOAuthResponse(BaseModel):
    platform: str
    auth_url: str
    mode: str
