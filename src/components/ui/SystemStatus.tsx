"use client";

import { motion } from "framer-motion";

export default function SystemStatus({ locale }: { locale: string }) {
  const text = locale === "fr" ? "À l'écoute d'opportunités" : "Available for work";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center gap-2.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-[0.65rem] sm:text-xs font-semibold tracking-[0.15em] uppercase text-success backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.15)]"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex size-2 rounded-full bg-success"></span>
      </span>
      {text}
    </motion.div>
  );
}
