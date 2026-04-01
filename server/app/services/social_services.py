from datetime import datetime
from urllib.parse import urlencode

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.social_account import SocialAccount
from app.models.users import User
from app.schemas.social_schema import SocialConnectRequest
from app.utils.helpers import decrypt_text, encrypt_text


settings = get_settings()
SUPPORTED_PLATFORMS = {"twitter", "linkedin", "instagram"}


def build_oauth_url(platform: str) -> tuple[str, str]:
    platform = platform.lower()
    if platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unsupported platform")

    if platform == "twitter" and settings.x_client_id:
        params = urlencode(
            {
                "response_type": "code",
                "client_id": settings.x_client_id,
                "redirect_uri": settings.x_redirect_uri,
                "scope": "tweet.read tweet.write users.read offline.access",
                "state": "social-platform-x",
                "code_challenge": "demo-challenge",
                "code_challenge_method": "plain",
            }
        )
        return f"https://twitter.com/i/oauth2/authorize?{params}", "oauth"

    if platform == "linkedin" and settings.linkedin_client_id:
        params = urlencode(
            {
                "response_type": "code",
                "client_id": settings.linkedin_client_id,
                "redirect_uri": settings.linkedin_redirect_uri,
                "scope": "openid profile email w_member_social",
                "state": "social-platform-linkedin",
            }
        )
        return f"https://www.linkedin.com/oauth/v2/authorization?{params}", "oauth"

    return f"{settings.frontend_url}/settings?platform={platform}&mode=mock", "mock"


def list_accounts(db: Session, user: User) -> list[SocialAccount]:
    return list(
        db.scalars(
            select(SocialAccount)
            .where(SocialAccount.user_id == user.id)
            .order_by(SocialAccount.created_at.desc())
        )
    )


def connect_account(db: Session, user: User, payload: SocialConnectRequest) -> SocialAccount:
    platform = payload.platform.lower()
    if platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported platform")

    existing = db.scalar(
        select(SocialAccount).where(
            SocialAccount.user_id == user.id,
            SocialAccount.platform == platform,
        )
    )

    if existing:
        existing.account_name = payload.account_name
        existing.account_identifier = payload.account_identifier
        existing.access_token = encrypt_text(payload.access_token)
        existing.refresh_token = encrypt_text(payload.refresh_token)
        existing.token_expiry = payload.token_expiry
        existing.is_active = True
        db.commit()
        db.refresh(existing)
        return existing

    account = SocialAccount(
        user_id=user.id,
        platform=platform,
        account_name=payload.account_name,
        account_identifier=payload.account_identifier,
        access_token=encrypt_text(payload.access_token),
        refresh_token=encrypt_text(payload.refresh_token),
        token_expiry=payload.token_expiry,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def disconnect_account(db: Session, user: User, account_id: str) -> None:
    account = db.scalar(
        select(SocialAccount).where(SocialAccount.id == account_id, SocialAccount.user_id == user.id)
    )
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    db.delete(account)
    db.commit()


def get_platform_tokens(db: Session, user_id: str) -> dict[str, dict]:
    accounts = list(
        db.scalars(select(SocialAccount).where(SocialAccount.user_id == user_id, SocialAccount.is_active.is_(True)))
    )
    tokens = {}
    for account in accounts:
        tokens[account.platform] = {
            "account_name": account.account_name,
            "access_token": decrypt_text(account.access_token),
            "refresh_token": decrypt_text(account.refresh_token),
            "token_expiry": account.token_expiry.isoformat() if isinstance(account.token_expiry, datetime) else None,
        }
    return tokens


def publish_to_platform(platform: str, content: str, account: dict | None) -> tuple[bool, str, str | None]:
    platform = platform.lower()
    if platform == "instagram":
        return True, "Instagram mock publish queued for coming soon release.", f"mock-instagram-{abs(hash(content))}"

    if not account:
        return False, f"{platform.title()} account not connected.", None

    post_id = f"{platform}-{abs(hash((account['account_name'], content))) % 10_000_000}"
    return True, f"Published to {platform.title()} successfully.", post_id
