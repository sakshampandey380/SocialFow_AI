import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/button";
import Card from "../components/ui/card";
import { useAuth } from "../hooks/useauth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[90vh] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="inline-flex rounded-full border border-white/40 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 shadow-glass dark:border-white/10 dark:bg-white/5 dark:text-brand-300">
          AI-powered social operations
        </div>
        <h1 className="max-w-2xl font-display text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
          Launch polished campaigns with automation, analytics, and AI in one flow.
        </h1>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">
          SocialFlow AI gives your team a premium content studio, scheduler, workflow engine, and performance dashboard.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-xl">
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
          <h2 className="font-display text-3xl font-bold">Sign in to your workspace</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="field-input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="field-input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <Button type="submit" className="flex w-full items-center justify-center gap-2">
            {busy ? "Signing in..." : "Sign In"}
            <ArrowRight size={16} />
          </Button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Need an account?{" "}
            <Link className="font-semibold text-brand-600" to="/signup">
              Create one
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
