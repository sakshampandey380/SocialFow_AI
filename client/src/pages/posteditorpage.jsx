import { useEffect, useState } from "react";

import PostEditor from "../components/post/posteditor";
import Card from "../components/ui/card";
import { fetchAiHistory } from "../services/ai.services";
import { createPost, uploadMedia } from "../services/post.services";

export default function PostEditorPage() {
  const [aiHistory, setAiHistory] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAiHistory().then(setAiHistory).catch(() => setAiHistory([]));
  }, []);

  async function handleSave(payload) {
    await createPost(payload);
    setMessage("Post saved successfully. Your schedule and workflow engine are updated.");
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-500/90 to-accent-500/90 text-white">
        <p className="text-sm uppercase tracking-[0.22em] text-white/80">Creative Studio</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Build, refine, and schedule your next campaign</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/80">
          Use the AI assistant to draft captions, attach media, and schedule multi-platform publishing with timezone support.
        </p>
      </Card>

      {message ? (
        <Card className="border border-emerald-300/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          {message}
        </Card>
      ) : null}

      <PostEditor onSave={handleSave} onUploadMedia={uploadMedia} aiHistory={aiHistory} />
    </div>
  );
}
