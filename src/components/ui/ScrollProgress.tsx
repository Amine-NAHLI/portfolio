"use client";

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const percentage = useTransform(scrollYProgress, (v) => Math.round(v * 100));

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-none flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#scroll-gradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="251.2"
          style={{ pathLength: scrollYProgress }}
        />
        <defs>
          <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <motion.span 
        className="absolute font-mono text-[10px] text-text-1 font-bold"
      >
        {percentage}
      </motion.span>
    </div>
  );
}
