from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.utils.helpers import new_uuid, utc_now


class Media(Base):
    __tablename__ = "media"
    __table_args__ = (
        Index("ix_media_user_created", "user_id", "created_at"),
        Index("ix_media_post_id", "post_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    post_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("posts.id", ondelete="SET NULL"), nullable=True)
    file_url: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(24), nullable=False)
    is_profile_pic: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="media_items")
    post = relationship("Post", back_populates="media_items")
