"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [percent, setPercent] = useState(0);
  const [activeSection, setActiveSection] = useState("HOME");

  useEffect(() => {
    const handleScroll = () => {
      const p = Math.round(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100);
      setPercent(Math.max(0, Math.min(100, p)));

      // Section detection
      const sections = ["hero", "about", "projects", "stack", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActiveSection(id.toUpperCase());
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-[100] hidden lg:flex">
      {/* Current Section Name */}
      <div className="flex flex-col items-center gap-2 [writing-mode:vertical-lr] rotate-180">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent-cyan font-black">
          {activeSection}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-1 h-48 rounded-full overflow-hidden border border-[var(--border)]" style={{ background: "var(--border)" }}>
        <motion.div
          className="absolute top-0 left-0 w-full bg-accent-cyan origin-top"
          style={{ scaleY }}
        />

        {/* Scanning Bit */}
        <motion.div
          animate={{ y: [0, 192, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-2 bg-text-1/40 blur-sm z-10"
        />
      </div>

      {/* Percentage */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[9px] uppercase tracking-tighter text-text-4">POS_Y</span>
        <span className="font-mono text-[11px] font-black text-text-1">{percent}%</span>
      </div>

      {/* Connection Indicator */}
      <div className="mt-4 flex flex-col gap-1 items-center">
         <div className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
         <div className="w-px h-8 bg-gradient-to-b from-accent-cyan/40 to-transparent" />
      </div>
    </div>
  );
}
