from openai import OpenAI
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.ai_content import AIContent
from app.models.users import User
from app.schemas.ai_schema import AIContentGenerateRequest


settings = get_settings()


def _mock_generate(prompt: str, tone: str, platform: str | None) -> dict:
    platform_hint = "all your connected platforms" if platform in (None, "all") else platform
    caption = (
        f"{tone.title()} campaign concept for {platform_hint}: {prompt.strip()}. "
        "Share a clear takeaway, a human insight, and a crisp call to action."
    )
    hashtags = ["#GrowthStrategy", "#SocialMedia", "#Automation", f"#{tone.title()}Content"]
    hook = f"Stop scrolling: this {tone} post is built to convert attention into action."
    return {"caption": caption, "hashtags": hashtags, "hook": hook}


def _openai_generate(prompt: str, tone: str, platform: str | None) -> dict:
    client = OpenAI(api_key=settings.openai_api_key)
    completion = client.responses.create(
        model=settings.openai_model,
        input=[
            {
                "role": "system",
                "content": (
                    "You generate social media captions, hooks, and hashtags in JSON. "
                    "Return keys caption, hashtags, and hook."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Prompt: {prompt}\nTone: {tone}\nPlatform: {platform or 'all'}\n"
                    "Create a concise caption, 4-6 hashtags, and a hook."
                ),
            },
        ],
    )
    text = completion.output_text
    try:
        import json

        parsed = json.loads(text)
        return {
            "caption": parsed["caption"],
            "hashtags": parsed["hashtags"],
            "hook": parsed["hook"],
        }
    except Exception:
        return _mock_generate(prompt, tone, platform)


def generate_ai_content(db: Session, user: User, payload: AIContentGenerateRequest) -> AIContent:
    generated = (
        _openai_generate(payload.prompt, payload.tone, payload.platform)
        if settings.openai_api_key
        else _mock_generate(payload.prompt, payload.tone, payload.platform)
    )
    record = AIContent(
        user_id=user.id,
        prompt=payload.prompt,
        generated_caption=generated["caption"],
        hashtags=", ".join(generated["hashtags"]),
        hook=generated["hook"],
        tone=payload.tone,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_ai_history(db: Session, user: User) -> list[AIContent]:
    return list(
        db.scalars(
            select(AIContent).where(AIContent.user_id == user.id).order_by(AIContent.created_at.desc())
        )
    )
