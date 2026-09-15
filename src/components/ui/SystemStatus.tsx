"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap } from "lucide-react";

export default function SystemStatus({ locale }: { locale: string }) {
  const statusText = locale === "fr" ? "Disponible pour opportunités" : "Available for opportunities";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 sm:px-4 backdrop-blur-md shadow-lg shadow-emerald-500/5"
    >
      <div className="flex items-center gap-2 text-[0.72rem] sm:text-xs font-semibold text-emerald-400">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400"></span>
        </span>
        <span className="truncate">{statusText}</span>
      </div>

      <span className="hidden sm:inline text-white/20">•</span>

      <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-text-secondary">
        <span className="flex items-center gap-1">
          <MapPin className="size-3 text-accent" />
          Fès, Maroc
        </span>
        <span className="flex items-center gap-1">
          <GraduationCap className="size-3 text-accent" />
          UPF (4ᵉ Année)
        </span>
      </div>
    </motion.div>
  );
}
