import { motion } from "framer-motion";

import { clampText } from "../../utils/helpers";

export default function EventCard({ event }) {
  return (
    <motion.div
      draggable
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-glow dark:bg-white dark:text-slate-900"
    >
      <p>{clampText(event.title, 40)}</p>
      <p className="mt-1 text-[11px] opacity-75">{event.platforms.join(", ")}</p>
    </motion.div>
  );
}
