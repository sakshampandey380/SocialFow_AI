const tones = [
  { value: "professional", label: "Professional" },
  { value: "viral", label: "Viral" },
  { value: "casual", label: "Casual" },
];

export default function ToneSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tones.map((tone) => (
        <button
          key={tone.value}
          type="button"
          onClick={() => onChange(tone.value)}
          className={`rounded-2xl border px-4 py-3 text-left transition hover:scale-[1.02] ${
            value === tone.value
              ? "border-brand-400 bg-brand-500 text-white shadow-glow"
              : "border-white/50 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          }`}
        >
          <div className="font-semibold">{tone.label}</div>
          <div className="text-xs opacity-80">
            {tone.value === "professional"
              ? "Sharp and polished"
              : tone.value === "viral"
                ? "High energy and scroll-stopping"
                : "Human and relaxed"}
          </div>
        </button>
      ))}
    </div>
  );
}
