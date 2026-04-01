import { ImagePlus, Paperclip } from "lucide-react";
import { useState } from "react";

import Button from "../ui/button";

export default function MediaUploader({ media, setMedia, onUpload }) {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await onUpload(file);
      setMedia((current) => [...current, uploaded]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="glass-panel flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed p-6 text-center transition hover:scale-[1.01]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          <ImagePlus size={22} />
        </div>
        <div>
          <p className="font-semibold">Upload image or video</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drag visual assets into your post library.
          </p>
        </div>
        <input type="file" className="hidden" onChange={handleFiles} />
      </label>

      {uploading ? <Button className="w-full">Uploading...</Button> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {media.map((item) => (
          <div key={item.id} className="glass-panel flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Paperclip size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.file_type}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.file_url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
