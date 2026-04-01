import { Link2, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../components/ui/button";
import Card from "../components/ui/card";
import { useAuth } from "../hooks/useauth";
import { updateProfile, uploadAvatar } from "../services/auth.services";
import { connectAccount, disconnectAccount, fetchOAuthUrl, fetchSocialAccounts } from "../services/social.services";
import { createWorkflow, fetchWorkflows } from "../services/workflow.services";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    timezone: user?.timezone || "Asia/Calcutta",
  });
  const [accounts, setAccounts] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [connectForm, setConnectForm] = useState({
    platform: "twitter",
    account_name: "",
    access_token: "",
    refresh_token: "",
  });
  const [workflowForm, setWorkflowForm] = useState({
    name: "",
    trigger_event: "weekly",
    action: "auto-post-all",
    is_active: true,
  });
  const [message, setMessage] = useState("");

  async function load() {
    const [accountsData, workflowsData] = await Promise.all([fetchSocialAccounts(), fetchWorkflows()]);
    setAccounts(accountsData);
    setWorkflows(workflowsData);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    const updated = await updateProfile(profile);
    setUser(updated);
    setMessage("Profile updated.");
  }

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const updated = await uploadAvatar(file);
    setUser(updated);
    setMessage("Avatar uploaded.");
  }

  async function handleConnect(event) {
    event.preventDefault();
    await connectAccount(connectForm);
    setConnectForm({ platform: "twitter", account_name: "", access_token: "", refresh_token: "" });
    setMessage("Social account connected.");
    await load();
  }

  async function handleOAuth(platform) {
    const data = await fetchOAuthUrl(platform);
    window.open(data.auth_url, "_blank", "noopener,noreferrer");
  }

  async function handleWorkflow(event) {
    event.preventDefault();
    await createWorkflow(workflowForm);
    setWorkflowForm({ name: "", trigger_event: "weekly", action: "auto-post-all", is_active: true });
    setMessage("Workflow created.");
    await load();
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-500/90 to-accent-500/90 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-white/80">Settings & integrations</p>
        <h2 className="mt-3 font-display text-3xl font-bold">Manage identity, channels, and automation rules</h2>
      </Card>

      {message ? <Card>{message}</Card> : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Profile</p>
          <form className="mt-4 space-y-4" onSubmit={handleProfileSubmit}>
            <input
              className="field-input"
              placeholder="Full name"
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
            />
            <textarea
              className="field-input min-h-28"
              placeholder="Short bio"
              value={profile.bio}
              onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
            />
            <input
              className="field-input"
              placeholder="Timezone"
              value={profile.timezone}
              onChange={(event) => setProfile((current) => ({ ...current, timezone: event.target.value }))}
            />
            <label className="secondary-button flex cursor-pointer items-center justify-center gap-2">
              <Sparkles size={16} />
              Upload avatar
              <input type="file" className="hidden" onChange={handleAvatarUpload} />
            </label>
            <Button type="submit" className="w-full">
              Save profile
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform connections</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["twitter", "linkedin", "instagram"].map((platform) => (
              <button
                key={platform}
                onClick={() => handleOAuth(platform)}
                className={`rounded-2xl px-4 py-4 text-left transition hover:scale-105 ${
                  platform === "instagram"
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-300"
                    : "glass-panel"
                }`}
              >
                <p className="font-semibold capitalize">{platform}</p>
                <p className="mt-1 text-xs">
                  {platform === "instagram" ? "Coming Soon" : "Open OAuth / mock connect flow"}
                </p>
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleConnect}>
            <select
              className="field-input"
              value={connectForm.platform}
              onChange={(event) => setConnectForm((current) => ({ ...current, platform: event.target.value }))}
            >
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram Mock</option>
            </select>
            <input
              className="field-input"
              placeholder="Account name"
              value={connectForm.account_name}
              onChange={(event) => setConnectForm((current) => ({ ...current, account_name: event.target.value }))}
            />
            <input
              className="field-input"
              placeholder="Access token"
              value={connectForm.access_token}
              onChange={(event) => setConnectForm((current) => ({ ...current, access_token: event.target.value }))}
            />
            <input
              className="field-input"
              placeholder="Refresh token"
              value={connectForm.refresh_token}
              onChange={(event) => setConnectForm((current) => ({ ...current, refresh_token: event.target.value }))}
            />
            <Button type="submit" className="flex w-full items-center justify-center gap-2">
              <Link2 size={16} />
              Connect account
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="glass-panel flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold capitalize">{account.platform}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{account.account_name}</p>
                </div>
                <button onClick={() => disconnectAccount(account.id).then(load)} className="secondary-button px-4 py-2 text-sm">
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create workflow</p>
          <form className="mt-4 space-y-4" onSubmit={handleWorkflow}>
            <input
              className="field-input"
              placeholder="Workflow name"
              value={workflowForm.name}
              onChange={(event) => setWorkflowForm((current) => ({ ...current, name: event.target.value }))}
            />
            <select
              className="field-input"
              value={workflowForm.trigger_event}
              onChange={(event) => setWorkflowForm((current) => ({ ...current, trigger_event: event.target.value }))}
            >
              <option value="weekly">Weekly recurring</option>
              <option value="new_post">On new post</option>
            </select>
            <select
              className="field-input"
              value={workflowForm.action}
              onChange={(event) => setWorkflowForm((current) => ({ ...current, action: event.target.value }))}
            >
              <option value="auto-post-all">Auto-post to all platforms</option>
            </select>
            <Button type="submit" className="flex w-full items-center justify-center gap-2">
              <Plus size={16} />
              Add workflow
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Existing workflows</p>
          <div className="mt-4 grid gap-3">
            {workflows.length ? (
              workflows.map((workflow) => (
                <div key={workflow.id} className="glass-panel p-4">
                  <p className="font-semibold">{workflow.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Trigger: {workflow.trigger_event} | Action: {workflow.action}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No workflows yet. Create one to auto-post weekly or when new content is ready.
              </p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
