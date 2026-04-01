from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.users import User
from app.schemas.social_schema import SocialAccountResponse, SocialConnectRequest, SocialOAuthResponse
from app.services.social_services import build_oauth_url, connect_account, disconnect_account, list_accounts


router = APIRouter(prefix="/social", tags=["social"])


@router.get("/accounts", response_model=list[SocialAccountResponse])
def get_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_accounts(db, current_user)


@router.get("/oauth/{platform}", response_model=SocialOAuthResponse)
def get_oauth_url(platform: str):
    auth_url, mode = build_oauth_url(platform)
    return SocialOAuthResponse(platform=platform, auth_url=auth_url, mode=mode)


@router.post("/connect", response_model=SocialAccountResponse)
def connect(
    payload: SocialConnectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return connect_account(db, current_user, payload)


@router.delete("/accounts/{account_id}")
def disconnect(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    disconnect_account(db, current_user, account_id)
    return {"message": "Account disconnected"}
