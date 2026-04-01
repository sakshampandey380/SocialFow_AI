import { motion } from "framer-motion";

import { cn } from "../../utils/helpers";

export default function Card({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("soft-card p-5 sm:p-6", className)}
    >
      {children}
    </motion.div>
  );
}
