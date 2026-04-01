from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.users import User
from app.models.workflow import Workflow
from app.schemas.post_schema import WorkflowRequest, WorkflowResponse
from app.services.schedular_service import run_workflow


router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("", response_model=list[WorkflowResponse])
def list_workflows(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list(
        db.scalars(
            select(Workflow)
            .where(Workflow.user_id == current_user.id)
            .order_by(Workflow.created_at.desc())
        )
    )


@router.post("", response_model=WorkflowResponse)
def create_workflow(
    payload: WorkflowRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workflow = Workflow(user_id=current_user.id, **payload.model_dump())
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


@router.post("/{workflow_id}/run")
def trigger_workflow(
    workflow_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workflow = db.scalar(
        select(Workflow).where(Workflow.id == workflow_id, Workflow.user_id == current_user.id)
    )
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    processed = run_workflow(db, workflow)
    return {"message": "Workflow executed", "processed": processed}
