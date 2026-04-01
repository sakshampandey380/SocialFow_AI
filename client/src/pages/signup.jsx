import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/button";
import Card from "../components/ui/card";
import { useAuth } from "../hooks/useauth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    timezone: "Asia/Calcutta",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[90vh] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="bg-gradient-to-br from-brand-500 to-accent-500 text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-white/80">Premium workflow stack</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold">Create your AI automation studio</h1>
        <div className="mt-8 space-y-4 text-sm text-white/85">
          <p>Plan once, publish everywhere.</p>
          <p>Generate captions, hooks, and hashtags with your preferred tone.</p>
          <p>Track performance with live-ready analytics cards and charts.</p>
        </div>
      </Card>

      <Card className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Get started</p>
          <h2 className="font-display text-3xl font-bold">Create your workspace</h2>
        </div>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="field-input sm:col-span-2"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
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
          <input
            className="field-input sm:col-span-2"
            placeholder="Timezone"
            value={form.timezone}
            onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))}
          />
          {error ? <p className="sm:col-span-2 text-sm text-rose-500">{error}</p> : null}
          <Button type="submit" className="sm:col-span-2 flex items-center justify-center gap-2">
            <Sparkles size={16} />
            {busy ? "Creating..." : "Create Account"}
          </Button>
          <p className="sm:col-span-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link className="font-semibold text-brand-600" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
