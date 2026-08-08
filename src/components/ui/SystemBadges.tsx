"use client";

import { motion } from "framer-motion";

export default function SystemBadges({ locale }: { locale: string }) {
  const badges = locale === "fr" 
    ? ["Cybersécurité", "Intelligence Artificielle", "Développement Logiciel"]
    : ["Cybersecurity", "Artificial Intelligence", "Software Development"];

  return (
    <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
      {badges.map((badge, i) => (
        <motion.div
          key={badge}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
          className="group relative flex items-center gap-2 overflow-hidden rounded border border-accent/20 bg-accent/5 px-2.5 py-1.5 sm:px-3 font-mono text-[0.65rem] sm:text-xs font-semibold tracking-widest text-accent uppercase transition-all hover:border-accent/50 hover:bg-accent/10 hover:shadow-[0_0_10px_var(--color-accent-soft)]"
        >
          <span className="text-accent/50 group-hover:text-accent transition-colors">[{`0${i + 1}`}]</span>
          {badge}
        </motion.div>
      ))}
    </div>
  );
}
