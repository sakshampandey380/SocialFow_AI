import { Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { generateContent } from "../../services/ai.services";
import Button from "../ui/button";
import Card from "../ui/card";
import MediaUploader from "./mediauploader";
import ToneSelector from "./toneselector";

const defaultForm = {
  title: "",
  content: "",
  hook: "",
  hashtags: "",
  tone: "professional",
  status: "draft",
  scheduled_time: "",
  timezone: "Asia/Calcutta",
  platform_ids: ["twitter", "linkedin"],
};

export default function PostEditor({ onSave, onUploadMedia, initialValues = null, aiHistory = [] }) {
  const [form, setForm] = useState(
    initialValues
      ? {
          ...initialValues,
          hashtags: Array.isArray(initialValues.hashtags)
            ? initialValues.hashtags.join(", ")
            : initialValues.hashtags || "",
          platform_ids: initialValues.platform_ids || ["twitter", "linkedin"],
        }
      : defaultForm
  );
  const [media, setMedia] = useState(initialValues?.media_items || []);
  const [busy, setBusy] = useState(false);

  function togglePlatform(platform) {
    setForm((current) => ({
      ...current,
      platform_ids: current.platform_ids.includes(platform)
        ? current.platform_ids.filter((item) => item !== platform)
        : [...current.platform_ids, platform],
    }));
  }

  async function handleGenerate() {
    if (!form.content.trim()) return;
    setBusy(true);
    try {
      const generated = await generateContent({
        prompt: form.content,
        tone: form.tone,
        platform: form.platform_ids[0] || "all",
      });
      setForm((current) => ({
        ...current,
        content: generated.caption,
        hook: generated.hook,
        hashtags: generated.hashtags.join(", "),
      }));
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave({
        ...form,
        hashtags: form.hashtags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        media_ids: media.map((item) => item.id),
        scheduled_time: form.scheduled_time || null,
      });
      setForm(defaultForm);
      setMedia([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
      <Card className="overflow-hidden">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">AI-assisted post builder</p>
              <h2 className="font-display text-2xl font-bold">Compose for every platform</h2>
            </div>
            <Button type="button" variant="secondary" className="flex items-center gap-2" onClick={handleGenerate}>
              <Wand2 size={16} />
              {busy ? "Generating..." : "Generate With AI"}
            </Button>
          </div>

          <input
            className="field-input"
            placeholder="Campaign title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />

          <textarea
            className="field-input min-h-[180px]"
            placeholder="Write your idea, paste a brief, or let AI refine it..."
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <input
              className="field-input"
              placeholder="Hook"
              value={form.hook}
              onChange={(event) => setForm((current) => ({ ...current, hook: event.target.value }))}
            />
            <input
              className="field-input"
              placeholder="Hashtags separated by commas"
              value={form.hashtags}
              onChange={(event) => setForm((current) => ({ ...current, hashtags: event.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Tone</p>
            <ToneSelector value={form.tone} onChange={(tone) => setForm((current) => ({ ...current, tone }))} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Platforms</p>
            <div className="flex flex-wrap gap-3">
              {["twitter", "linkedin", "instagram"].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition hover:scale-105 ${
                    form.platform_ids.includes(platform)
                      ? "bg-slate-900 text-white shadow-glow dark:bg-white dark:text-slate-900"
                      : "glass-panel"
                  }`}
                >
                  {platform === "instagram" ? "Instagram (Soon)" : platform}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <input
              type="datetime-local"
              className="field-input"
              value={form.scheduled_time}
              onChange={(event) => setForm((current) => ({ ...current, scheduled_time: event.target.value }))}
            />
            <select
              className="field-input"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="draft">Save as Draft</option>
              <option value="scheduled">Schedule</option>
              <option value="published">Publish Now</option>
            </select>
          </div>

          <MediaUploader media={media} setMedia={setMedia} onUpload={onUploadMedia} />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="flex items-center gap-2">
              <Sparkles size={16} />
              {busy ? "Saving..." : "Save Post"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setForm(defaultForm);
                setMedia([]);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI History</p>
          <div className="mt-4 space-y-3">
            {aiHistory.length ? (
              aiHistory.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-semibold">{item.tone} tone</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.generated_caption}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Generated ideas will appear here.</p>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          <p className="text-sm text-white/80">Publishing engine</p>
          <h3 className="mt-2 font-display text-2xl font-bold">Smart queue + retries ready</h3>
          <p className="mt-3 text-sm text-white/80">
            Scheduled posts are queued for Celery workers, retried automatically, and mirrored in notifications.
          </p>
        </Card>
      </div>
    </div>
  );
}
