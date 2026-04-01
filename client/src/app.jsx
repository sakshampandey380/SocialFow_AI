import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import Sidebar from "./components/layout/sidebar";
import { LoaderScreen } from "./components/ui/loader";
import { useAuth } from "./hooks/useauth";
import AnalyticsPage from "./pages/analyticspage";
import CalendarPage from "./pages/calendarpage";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/login";
import PostEditorPage from "./pages/posteditorpage";
import SettingsPage from "./pages/settings";
import SignupPage from "./pages/signup";

function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="animated-orb left-[-6rem] top-10 h-48 w-48 bg-sky-300/60 animate-float dark:bg-brand-500/20" />
      <div className="animated-orb right-10 top-20 h-72 w-72 bg-orange-200/70 animate-pulse-glow dark:bg-accent-500/10" />
      <div className="bg-grid absolute inset-0 opacity-30 dark:opacity-10" />
    </div>
  );
}

function ProtectedLayout() {
  const { isAuthenticated, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <LoaderScreen label="Preparing your command center..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundDecor />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Sidebar />
        <div className="flex min-h-full flex-1 flex-col gap-6">
          <Navbar />
          <main className="pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function AuthLayout() {
  const { isAuthenticated, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <LoaderScreen label="Loading SocialFlow AI..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <BackgroundDecor />
      <div className="relative mx-auto max-w-6xl">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<PostEditorPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
