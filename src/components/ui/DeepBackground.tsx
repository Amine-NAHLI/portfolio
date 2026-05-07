"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function DeepBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const moveX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const moveY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-bg-0"
    >
      {/* Primary Grid (Moves with mouse) */}
      <motion.div 
        style={{ x: moveX, y: moveY }}
        className="absolute inset-[-10%] opacity-[0.03] dark:opacity-[0.05]"
      >
        <div className="absolute inset-0 grid-bg" style={{ backgroundSize: '40px 40px' }} />
      </motion.div>

      {/* Secondary Distant Grid (Moves slower - Parallax) */}
      <motion.div 
        style={{ x: useTransform(moveX, (v) => v * 0.5), y: useTransform(moveY, (v) => v * 0.5) }}
        className="absolute inset-[-20%] opacity-[0.01] dark:opacity-[0.02]"
      >
        <div className="absolute inset-0 grid-bg" style={{ backgroundSize: '80px 80px' }} />
      </motion.div>

      {/* Ambient Radial Glows (Optimized with gradients instead of filters) */}
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] rounded-full opacity-10 animate-pulse delay-1000" />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
}
