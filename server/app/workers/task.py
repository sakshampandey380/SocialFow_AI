from app.db.session import SessionLocal
from app.services.schedular_service import publish_job_now, retry_failed_job
from app.utils.logger import get_logger
from app.workers.celery_app import celery_app


logger = get_logger(__name__)


@celery_app.task(name="publish_scheduled_post", bind=True, max_retries=3)
def publish_scheduled_post(self, job_id: str):
    db = SessionLocal()
    try:
        publish_job_now(db, job_id)
        return {"job_id": job_id, "status": "completed"}
    except Exception as exc:
        logger.exception("Publish job failed for %s", job_id)
        retry_failed_job(db, job_id)
        raise self.retry(exc=exc, countdown=60 * max(self.request.retries + 1, 1))
    finally:
        db.close()
