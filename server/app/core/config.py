from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[3]
UPLOADS_DIR = ROOT_DIR / "server" / "uploads"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Social Media Automation Platform"
    api_prefix: str = "/api/v1"
    debug: bool = True
    environment: str = "development"

    secret_key: str = "super-secret-dev-key-change-me"
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = "HS256"

    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_db: str = "social_media_automation_agent"

    redis_url: str = "redis://127.0.0.1:6379/0"
    broker_url: str = "redis://127.0.0.1:6379/1"
    result_backend: str = "redis://127.0.0.1:6379/2"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"

    x_client_id: str | None = None
    x_client_secret: str | None = None
    x_redirect_uri: str = "http://localhost:5173/settings?provider=x"

    linkedin_client_id: str | None = None
    linkedin_client_secret: str | None = None
    linkedin_redirect_uri: str = "http://localhost:5173/settings?provider=linkedin"

    frontend_url: str = "http://localhost:5173"
    allowed_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
    )

    uploads_path: Path = UPLOADS_DIR

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug", "development"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "production"}:
                return False
        return bool(value)

    @property
    def sqlalchemy_database_uri(self) -> str:
        password = f":{self.mysql_password}" if self.mysql_password else ""
        return (
            f"mysql+pymysql://{self.mysql_user}{password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
