import { motion } from "framer-motion";

import { cn } from "../../utils/helpers";

export default function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) {
  const styles =
    variant === "secondary"
      ? "secondary-button"
      : variant === "ghost"
        ? "rounded-2xl px-4 py-3 font-semibold text-slate-600 transition hover:scale-105 hover:bg-white/40 dark:text-slate-100 dark:hover:bg-white/5"
        : "gradient-button";

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled}
      className={cn(styles, disabled && "cursor-not-allowed opacity-60", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
