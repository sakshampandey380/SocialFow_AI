from collections import defaultdict

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.notification import Notification
from app.models.post import Post
from app.models.social_account import SocialAccount
from app.models.users import User
from app.schemas.analytics_schema import (
    AnalyticsDashboardResponse,
    DashboardOverview,
    PlatformMetric,
    TrendPoint,
)


def get_dashboard(db: Session, user: User) -> AnalyticsDashboardResponse:
    total_posts = db.scalar(select(func.count()).select_from(Post).where(Post.user_id == user.id)) or 0
    scheduled_posts = (
        db.scalar(select(func.count()).select_from(Post).where(Post.user_id == user.id, Post.status == "scheduled"))
        or 0
    )
    published_posts = (
        db.scalar(select(func.count()).select_from(Post).where(Post.user_id == user.id, Post.status == "published"))
        or 0
    )
    failed_posts = (
        db.scalar(
            select(func.count()).select_from(Post).where(Post.user_id == user.id, Post.status.in_(["failed", "partial_failure"]))
        )
        or 0
    )
    connected_accounts = (
        db.scalar(select(func.count()).select_from(SocialAccount).where(SocialAccount.user_id == user.id)) or 0
    )
    unread_notifications = (
        db.scalar(
            select(func.count()).select_from(Notification).where(
                Notification.user_id == user.id,
                Notification.is_read.is_(False),
            )
        )
        or 0
    )

    rows = db.execute(
        select(
            Analytics.platform,
            func.sum(Analytics.likes),
            func.sum(Analytics.comments),
            func.sum(Analytics.shares),
            func.sum(Analytics.reach),
            func.sum(Analytics.impressions),
            func.date(Analytics.recorded_at),
        )
        .join(Post, Post.id == Analytics.post_id)
        .where(Post.user_id == user.id)
        .group_by(Analytics.platform, func.date(Analytics.recorded_at))
        .order_by(func.date(Analytics.recorded_at))
    ).all()

    platform_rollup: dict[str, dict[str, int]] = defaultdict(
        lambda: {"likes": 0, "comments": 0, "shares": 0, "reach": 0, "impressions": 0}
    )
    reach_trend: list[TrendPoint] = []
    engagement_trend: list[TrendPoint] = []

    for platform, likes, comments, shares, reach, impressions, recorded_date in rows:
        metrics = platform_rollup[platform]
        metrics["likes"] += likes or 0
        metrics["comments"] += comments or 0
        metrics["shares"] += shares or 0
        metrics["reach"] += reach or 0
        metrics["impressions"] += impressions or 0
        reach_trend.append(TrendPoint(label=str(recorded_date), value=int(reach or 0)))
        engagement_trend.append(TrendPoint(label=str(recorded_date), value=int((likes or 0) + (comments or 0) + (shares or 0))))

    platform_metrics = []
    for platform, values in platform_rollup.items():
        engagement_total = values["likes"] + values["comments"] + values["shares"]
        impressions = max(values["impressions"], 1)
        platform_metrics.append(
            PlatformMetric(
                platform=platform,
                likes=values["likes"],
                comments=values["comments"],
                shares=values["shares"],
                reach=values["reach"],
                impressions=values["impressions"],
                engagement_rate=round((engagement_total / impressions) * 100, 2),
            )
        )

    return AnalyticsDashboardResponse(
        overview=DashboardOverview(
            total_posts=total_posts,
            scheduled_posts=scheduled_posts,
            published_posts=published_posts,
            failed_posts=failed_posts,
            connected_accounts=connected_accounts,
            unread_notifications=unread_notifications,
        ),
        platform_metrics=platform_metrics,
        reach_trend=reach_trend,
        engagement_trend=engagement_trend,
    )
