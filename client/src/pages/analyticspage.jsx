import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../components/ui/card";
import { fetchAnalyticsDashboard } from "../services/analytics.services";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalyticsDashboard().then(setData).catch(() => setData(null));
  }, []);

  const overview = data?.overview || {};

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-slate-950 via-brand-700 to-brand-500 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-white/80">Performance intelligence</p>
        <h2 className="mt-3 font-display text-3xl font-bold">Measure reach, engagement, and platform lift</h2>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Published", overview.published_posts || 0],
          ["Scheduled", overview.scheduled_posts || 0],
          ["Failed", overview.failed_posts || 0],
          ["Unread Alerts", overview.unread_notifications || 0],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-4 font-display text-4xl font-bold">{value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Reach trend</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.reach_trend || []}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1e9bff" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Engagement trend</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.engagement_trend || []}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff7a2f" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Card>
        <p className="text-sm text-slate-500 dark:text-slate-400">Per-platform performance</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3">Platform</th>
                <th className="py-3">Likes</th>
                <th className="py-3">Comments</th>
                <th className="py-3">Shares</th>
                <th className="py-3">Reach</th>
                <th className="py-3">Impressions</th>
                <th className="py-3">Engagement Rate</th>
              </tr>
            </thead>
            <tbody>
              {(data?.platform_metrics || []).map((metric) => (
                <tr key={metric.platform} className="border-t border-white/30 dark:border-white/10">
                  <td className="py-4 font-semibold capitalize">{metric.platform}</td>
                  <td className="py-4">{metric.likes}</td>
                  <td className="py-4">{metric.comments}</td>
                  <td className="py-4">{metric.shares}</td>
                  <td className="py-4">{metric.reach}</td>
                  <td className="py-4">{metric.impressions}</td>
                  <td className="py-4">{metric.engagement_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
