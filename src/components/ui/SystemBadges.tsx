"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Code2 } from "lucide-react";

export default function SystemBadges({ locale }: { locale: string }) {
  const badges = locale === "fr" 
    ? [
        { label: "Cybersécurité & Audit", icon: ShieldCheck, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
        { label: "Développement Full-Stack", icon: Code2, color: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
        { label: "Intelligence Artificielle", icon: Cpu, color: "text-purple-400 border-purple-500/20 bg-purple-500/10" },
      ]
    : [
        { label: "Cybersecurity & Audit", icon: ShieldCheck, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
        { label: "Full-Stack Development", icon: Code2, color: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
        { label: "Artificial Intelligence", icon: Cpu, color: "text-purple-400 border-purple-500/20 bg-purple-500/10" },
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
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-md text-xs font-semibold shadow-sm transition-all hover:scale-105 ${b.color}`}
          >
            <Icon className="size-3.5" />
            <span>{b.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
