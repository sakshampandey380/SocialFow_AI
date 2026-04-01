from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import app.models  # noqa: F401
from app.api.routes import ai, analytics, auth, posts, social, users, workflow
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine
from app.utils.logger import setup_logging


settings = get_settings()
settings.uploads_path.mkdir(parents=True, exist_ok=True)
setup_logging()
app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


app.mount("/uploads", StaticFiles(directory=Path(settings.uploads_path)), name="uploads")

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(users.router, prefix=settings.api_prefix)
app.include_router(posts.router, prefix=settings.api_prefix)
app.include_router(social.router, prefix=settings.api_prefix)
app.include_router(ai.router, prefix=settings.api_prefix)
app.include_router(analytics.router, prefix=settings.api_prefix)
app.include_router(workflow.router, prefix=settings.api_prefix)


@app.get("/")
def healthcheck():
    return {"status": "ok", "app": settings.app_name}
