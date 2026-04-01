import { BarChart3, CalendarDays, LogOut, Settings, Sparkles, SquarePen } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useauth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Sparkles },
  { to: "/editor", label: "Post Editor", icon: SquarePen },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between p-5 lg:flex">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-lg font-bold text-white shadow-glow">
            SF
          </div>
          <div>
            <p className="font-display text-lg font-bold">SocialFlow AI</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Automation command center</p>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-glow dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:scale-[1.02] hover:bg-white/50 dark:text-slate-300 dark:hover:bg-white/5"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button onClick={logout} className="secondary-button flex items-center justify-center gap-2">
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
