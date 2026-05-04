"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-full glass hover:border-accent-cyan/40 transition-all group overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Moon size={18} className="text-accent-cyan" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sun size={18} className="text-warning" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle hover ring */}
      <div className="absolute inset-0 rounded-full border border-accent-cyan/0 group-hover:border-accent-cyan/20 transition-all scale-110 group-hover:scale-100" />
    </button>
  );
}
