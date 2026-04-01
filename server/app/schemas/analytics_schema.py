from pydantic import BaseModel


class PlatformMetric(BaseModel):
    platform: str
    likes: int
    comments: int
    shares: int
    reach: int
    impressions: int
    engagement_rate: float


class TrendPoint(BaseModel):
    label: str
    value: int


class DashboardOverview(BaseModel):
    total_posts: int
    scheduled_posts: int
    published_posts: int
    failed_posts: int
    connected_accounts: int
    unread_notifications: int


class AnalyticsDashboardResponse(BaseModel):
    overview: DashboardOverview
    platform_metrics: list[PlatformMetric]
    reach_trend: list[TrendPoint]
    engagement_trend: list[TrendPoint]
