import { PlayCircle, Trash2, Wand2 } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "../components/ui/card";
import { Skeleton } from "../components/ui/loader";
import { fetchAnalyticsDashboard } from "../services/analytics.services";
import api from "../services/api";
import { deletePost, fetchPosts, publishPost } from "../services/post.services";
import { fetchSocialAccounts } from "../services/social.services";
import { fetchWorkflows, runWorkflow } from "../services/workflow.services";
import { formatDateTime } from "../utils/formatdate";

const statsConfig = [
  { key: "total_posts", label: "Total Posts" },
  { key: "scheduled_posts", label: "Scheduled" },
  { key: "published_posts", label: "Published" },
  { key: "connected_accounts", label: "Connected" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [notifications, setNotifications] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const [analyticsData, postsData, accountsData, notificationsData, workflowData] = await Promise.all([
        fetchAnalyticsDashboard(),
        fetchPosts(),
        fetchSocialAccounts(),
        api.get("/users/notifications").then((response) => response.data),
        fetchWorkflows(),
      ]);
      startTransition(() => {
        setAnalytics(analyticsData);
        setPosts(postsData);
        setAccounts(accountsData);
        setNotifications(notificationsData);
        setWorkflows(workflowData);
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePublish(postId) {
    await publishPost(postId);
    await load();
  }

  async function handleDelete(postId) {
    await deletePost(postId);
    await load();
  }

  async function handleRunWorkflow(workflowId) {
    await runWorkflow(workflowId);
    await load();
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-gradient-to-br from-slate-950 via-brand-800 to-accent-500 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Command center</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-extrabold leading-tight">
            Orchestrate AI-generated campaigns with premium automation.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-white/80">
            Create polished content, schedule across channels, monitor performance, and keep your team aligned in one dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="gradient-button" to="/editor">
              Launch Editor
            </Link>
            <Link className="secondary-button bg-white/15 text-white dark:bg-white/10" to="/calendar">
              Open Calendar
            </Link>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Connected channels</p>
          <div className="mt-5 space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </>
            ) : accounts.length ? (
              accounts.map((account) => (
                <div key={account.id} className="glass-panel flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold capitalize">{account.platform}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{account.account_name}</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                    Connected
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No accounts connected yet. Head to settings to connect X, LinkedIn, or Instagram mock mode.
              </p>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map((stat) => (
          <Card key={stat.key}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-4 font-display text-4xl font-bold">
              {loading ? "--" : analytics?.overview?.[stat.key] ?? 0}
            </p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Publishing queue</p>
              <h3 className="font-display text-2xl font-bold">Recent posts</h3>
            </div>
            <Link className="secondary-button" to="/editor">
              <Wand2 size={16} className="inline-block" /> New Post
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : posts.length ? (
              posts.slice(0, 6).map((post) => (
                <div key={post.id} className="glass-panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(post.scheduled_time)}</span>
                    </div>
                    <p className="font-semibold">{post.title || "Untitled campaign"}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{post.content}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePublish(post.id)}
                      className="secondary-button flex items-center gap-2 px-4 py-3"
                    >
                      <PlayCircle size={16} />
                      Publish
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="secondary-button flex items-center gap-2 px-4 py-3 text-rose-500"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Your post queue is empty.</p>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400">Workflows</p>
            <div className="mt-4 space-y-3">
              {workflows.length ? (
                workflows.map((workflow) => (
                  <div key={workflow.id} className="glass-panel p-4">
                    <p className="font-semibold">{workflow.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Trigger: {workflow.trigger_event} | Action: {workflow.action}
                    </p>
                    <button
                      onClick={() => handleRunWorkflow(workflow.id)}
                      className="secondary-button mt-3 px-4 py-2 text-sm"
                    >
                      Run now
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Create a recurring workflow in settings.</p>
              )}
            </div>
          </Card>

          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400">Notifications</p>
            <div className="mt-4 space-y-3">
              {notifications.length ? (
                notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm font-semibold">{notification.type}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
