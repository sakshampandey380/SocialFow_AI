export function LoaderScreen({ label = "Loading..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-panel flex flex-col items-center gap-4 px-8 py-10">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </div>
  );
}

export function Skeleton({ className = "h-6 w-full" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/50 dark:bg-white/5 ${className}`} />;
}
