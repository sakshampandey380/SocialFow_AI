from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.job import Job
from app.models.media import Media
from app.models.users import User
from app.schemas.post_schema import CalendarItem, MediaResponse, PostCreateRequest, PostResponse, PostUpdateRequest
from app.services.post_services import create_post, delete_post, get_post_or_404, list_posts, update_post
from app.services.schedular_service import publish_job_now, queue_post
from app.utils.helpers import new_uuid


router = APIRouter(prefix="/posts", tags=["posts"])
settings = get_settings()


@router.get("", response_model=list[PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_posts(db, current_user)


@router.post("", response_model=PostResponse)
def create_new_post(
    payload: PostCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_post(db, current_user, payload)


@router.get("/calendar", response_model=list[CalendarItem])
def get_calendar(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = list_posts(db, current_user)
    return [
        CalendarItem(
            id=post.id,
            title=post.title or post.content[:40],
            date=post.scheduled_time,
            status=post.status,
            platforms=[platform.platform for platform in post.platforms],
        )
        for post in items
    ]


@router.post("/media", response_model=MediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    extension = Path(file.filename).suffix or ".png"
    filename = f"{new_uuid()}{extension}"
    target_path = settings.uploads_path / filename
    target_path.write_bytes(await file.read())
    media = Media(
        user_id=current_user.id,
        file_url=f"/uploads/{filename}",
        file_type=file.content_type or "application/octet-stream",
        is_profile_pic=False,
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_post_or_404(db, current_user.id, post_id)


@router.patch("/{post_id}", response_model=PostResponse)
def edit_post(
    post_id: str,
    payload: PostUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_post(db, current_user, post_id, payload)


@router.post("/{post_id}/publish")
def publish_now(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = get_post_or_404(db, current_user.id, post_id)
    latest_job = db.scalar(select(Job).where(Job.post_id == post.id).order_by(Job.created_at.desc()))
    if not latest_job:
        latest_job = queue_post(db, post)
    publish_job_now(db, latest_job.id)
    return {"message": "Post publish triggered"}


@router.delete("/{post_id}")
def remove_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_post(db, current_user, post_id)
    return {"message": "Post deleted"}
