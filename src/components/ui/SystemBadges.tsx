"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Code2 } from "lucide-react";

export default function SystemBadges({ locale }: { locale: string }) {
  const badges = locale === "fr" 
    ? [
        { label: "Cybersécurité & Audit", icon: ShieldCheck },
        { label: "Développement Full-Stack", icon: Code2 },
        { label: "Intelligence Artificielle", icon: Cpu },
      ]
    : [
        { label: "Cybersecurity & Audit", icon: ShieldCheck },
        { label: "Full-Stack Development", icon: Code2 },
        { label: "Artificial Intelligence", icon: Cpu },
      ];

  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {badges.map((b, i) => {
        const Icon = b.icon;
        return (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-3.5 py-1.5 backdrop-blur-md text-xs font-semibold text-text-primary shadow-sm transition-all hover:border-accent/40 hover:bg-surface"
          >
            <Icon className="size-3.5 text-accent" />
            <span>{b.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
