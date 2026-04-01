import { Bell, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useauth";
import { useTheme } from "../../hooks/usetheme";
import { initials } from "../../utils/helpers";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-panel flex flex-wrap items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          {user?.name || "Creator"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/settings" className="secondary-button flex items-center gap-2 px-4 py-3 text-sm">
          <Bell size={16} />
          Alerts
        </Link>
        <button onClick={toggleTheme} className="secondary-button p-3">
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
          {initials(user?.name)}
        </div>
      </div>
    </header>
  );
}
