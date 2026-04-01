from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.job import Job
from app.models.media import Media
from app.models.post import Post
from app.models.post_platform import PostPlatform
from app.models.users import User
from app.schemas.post_schema import PostCreateRequest, PostUpdateRequest
from app.services.schedular_service import publish_job_now, queue_post


def _post_query():
    return (
        select(Post)
        .options(joinedload(Post.platforms), joinedload(Post.media_items))
        .order_by(Post.created_at.desc())
    )


def list_posts(db: Session, user: User) -> list[Post]:
    return list(db.scalars(_post_query().where(Post.user_id == user.id)).unique())


def get_post_or_404(db: Session, user_id: str, post_id: str) -> Post:
    post = db.execute(_post_query().where(Post.id == post_id, Post.user_id == user_id)).scalars().unique().one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


def create_post(db: Session, user: User, payload: PostCreateRequest) -> Post:
    if payload.status in {"scheduled", "published"} and not payload.platform_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Select at least one platform to schedule or publish a post.",
        )

    post = Post(
        user_id=user.id,
        title=payload.title,
        content=payload.content,
        hook=payload.hook,
        hashtags=", ".join(payload.hashtags),
        tone=payload.tone,
        status=payload.status,
        scheduled_time=payload.scheduled_time,
        timezone=payload.timezone,
    )
    db.add(post)
    db.flush()

    for platform in payload.platform_ids:
        db.add(PostPlatform(post_id=post.id, platform=platform.lower(), status="queued"))

    if payload.media_ids:
        media_items = list(
            db.scalars(select(Media).where(Media.id.in_(payload.media_ids), Media.user_id == user.id))
        )
        for media in media_items:
            media.post_id = post.id

    db.commit()
    db.refresh(post)

    if post.status == "scheduled" and post.scheduled_time:
        queue_post(db, post)
    elif post.status == "published":
        job = queue_post(db, post)
        publish_job_now(db, job.id)

    return get_post_or_404(db, user.id, post.id)


def update_post(db: Session, user: User, post_id: str, payload: PostUpdateRequest) -> Post:
    post = get_post_or_404(db, user.id, post_id)

    future_status = payload.status if payload.status is not None else post.status
    future_platforms = payload.platform_ids if payload.platform_ids is not None else [item.platform for item in post.platforms]
    if future_status in {"scheduled", "published"} and not future_platforms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Select at least one platform to schedule or publish a post.",
        )

    for field in ["title", "content", "hook", "tone", "status", "scheduled_time", "timezone"]:
        value = getattr(payload, field)
        if value is not None:
            setattr(post, field, value)

    if payload.hashtags is not None:
        post.hashtags = ", ".join(payload.hashtags)

    if payload.platform_ids is not None:
        post.platforms.clear()
        for platform in payload.platform_ids:
            post.platforms.append(PostPlatform(platform=platform.lower(), status="queued"))

    if payload.media_ids is not None:
        media_items = list(
            db.scalars(select(Media).where(Media.id.in_(payload.media_ids), Media.user_id == user.id))
        )
        for media in media_items:
            media.post_id = post.id

    db.commit()
    db.refresh(post)

    existing_job = db.scalar(select(Job).where(Job.post_id == post.id).order_by(Job.created_at.desc()))
    if post.status == "scheduled" and post.scheduled_time and not existing_job:
        queue_post(db, post)
    elif post.status == "published" and not existing_job:
        job = queue_post(db, post)
        publish_job_now(db, job.id)

    return get_post_or_404(db, user.id, post.id)


def delete_post(db: Session, user: User, post_id: str) -> None:
    post = get_post_or_404(db, user.id, post_id)
    db.delete(post)
    db.commit()
