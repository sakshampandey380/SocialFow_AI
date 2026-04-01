from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.users import User
from app.schemas.ai_schema import AIContentGenerateRequest, AIContentPreview, AIContentResponse
from app.services.ai_services import generate_ai_content, list_ai_history


router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/generate", response_model=AIContentPreview)
def generate(
    payload: AIContentGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = generate_ai_content(db, current_user, payload)
    return AIContentPreview(
        caption=record.generated_caption,
        hashtags=[item.strip() for item in record.hashtags.split(",") if item.strip()],
        hook=record.hook or "",
        tone=record.tone,
    )


@router.get("/history", response_model=list[AIContentResponse])
def history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_ai_history(db, current_user)
