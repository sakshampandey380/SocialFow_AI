from datetime import timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.analytics import Analytics
from app.models.job import Job
from app.models.notification import Notification
from app.models.post import Post
from app.models.workflow import Workflow
from app.services.social_services import get_platform_tokens, publish_to_platform
from app.utils.helpers import utc_now


def enqueue_post_job(job_id: str, eta=None) -> None:
    try:
        from app.workers.task import publish_scheduled_post

        publish_scheduled_post.apply_async(args=[job_id], eta=eta)
    except Exception:
        return


def create_notification(db: Session, user_id: str, message: str, type_: str = "info") -> Notification:
    notification = Notification(user_id=user_id, message=message, type=type_)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def queue_post(db: Session, post: Post) -> Job:
    job = Job(post_id=post.id, status="queued", scheduled_at=post.scheduled_time)
    db.add(job)
    db.commit()
    db.refresh(job)
    enqueue_post_job(job.id, eta=post.scheduled_time)
    return job


def publish_job_now(db: Session, job_id: str) -> Job:
    job = db.execute(
        select(Job)
        .where(Job.id == job_id)
        .options(
            joinedload(Job.post).joinedload(Post.platforms),
            joinedload(Job.post).joinedload(Post.media_items),
            joinedload(Job.post).joinedload(Post.user),
        )
    ).scalars().unique().one_or_none()
    if not job or not job.post:
        raise ValueError("Job not found")

    job.status = "processing"
    db.commit()

    post = job.post
    if not post.platforms:
        job.status = "failed"
        job.last_error = "No platforms selected for this post."
        job.processed_at = utc_now()
        db.commit()
        create_notification(db, post.user_id, "A post failed because no platforms were selected.", "error")
        return job

    tokens = get_platform_tokens(db, post.user_id)
    all_successful = True

    for post_platform in post.platforms:
        successful, message, platform_post_id = publish_to_platform(
            post_platform.platform, post.content, tokens.get(post_platform.platform)
        )
        post_platform.status = "published" if successful else "failed"
        post_platform.platform_post_id = platform_post_id
        post_platform.error_message = None if successful else message
        if successful:
            db.add(
                Analytics(
                    post_id=post.id,
                    platform=post_platform.platform,
                    likes=24,
                    comments=7,
                    shares=5,
                    reach=520,
                    impressions=880,
                )
            )
        else:
            all_successful = False

    post.status = "published" if all_successful else "partial_failure"
    post.published_at = utc_now()
    job.status = "completed" if all_successful else "failed"
    job.processed_at = utc_now()
    job.last_error = None if all_successful else "One or more platforms failed."
    if not all_successful:
        job.retries += 1

    db.commit()
    create_notification(
        db,
        post.user_id,
        f"Post '{post.title or post.content[:24]}' finished with status {post.status}.",
        "success" if all_successful else "warning",
    )
    return job


def retry_failed_job(db: Session, job_id: str) -> Job:
    job = db.get(Job, job_id)
    if not job:
        raise ValueError("Job not found")
    job.status = "queued"
    db.commit()
    enqueue_post_job(job.id, eta=utc_now())
    return job


def run_workflow(db: Session, workflow: Workflow) -> int:
    posts = list(
        db.scalars(
            select(Post).where(
                Post.user_id == workflow.user_id,
                Post.status.in_(["draft", "scheduled"]),
            )
        )
    )
    processed = 0
    for post in posts:
        if workflow.trigger_event == "weekly" and post.scheduled_time:
            continue
        if workflow.action == "auto-post-all" and post.platforms:
            post.status = "scheduled"
            if not post.scheduled_time:
                post.scheduled_time = utc_now().astimezone(timezone.utc)
            queue_post(db, post)
            processed += 1

    if processed:
        create_notification(db, workflow.user_id, f"Workflow '{workflow.name}' processed {processed} posts.")
    return processed
