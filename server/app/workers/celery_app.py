from celery import Celery

from app.core.config import get_settings


settings = get_settings()

celery_app = Celery(
    "social_automation",
    broker=settings.broker_url,
    backend=settings.result_backend,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)
