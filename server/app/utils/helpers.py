import base64
import hashlib
import uuid
from datetime import datetime, timezone

from cryptography.fernet import Fernet

from app.core.config import get_settings


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def new_uuid() -> str:
    return str(uuid.uuid4())


def _build_cipher() -> Fernet:
    secret = get_settings().secret_key.encode("utf-8")
    key = base64.urlsafe_b64encode(hashlib.sha256(secret).digest())
    return Fernet(key)


def encrypt_text(value: str | None) -> str | None:
    if not value:
        return value
    return _build_cipher().encrypt(value.encode("utf-8")).decode("utf-8")


def decrypt_text(value: str | None) -> str | None:
    if not value:
        return value
    return _build_cipher().decrypt(value.encode("utf-8")).decode("utf-8")
