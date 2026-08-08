"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function TechCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(56,189,248,0.15), transparent 80%)`;
  
  // Chamfered clip-path string
  const clipPath = "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] ${className}`}
      style={{ clipPath }}
    >
      {/* Outer Border Background */}
      <div className="absolute inset-0 bg-border/40 transition-colors group-hover:bg-accent/40" />
      
      {/* Inner Surface with Chamfered cut slightly smaller to create the border */}
      <div 
        className="absolute inset-px bg-surface-subtle/80 backdrop-blur-xl" 
        style={{ clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)" }}
      >
        {/* Inner Spotlight Glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      </div>
      
      {/* HUD Corner Tech Accents */}
      <div className="pointer-events-none absolute left-0 top-3.75 h-3 w-px bg-accent/60" />
      <div className="pointer-events-none absolute left-3.75 top-0 h-px w-3 bg-accent/60" />
      
      <div className="pointer-events-none absolute right-0 bottom-3.75 h-3 w-px bg-accent/60" />
      <div className="pointer-events-none absolute right-3.75 bottom-0 h-px w-3 bg-accent/60" />

      {/* Content */}
      <div className="relative h-full w-full p-6">
        {children}
      </div>
    </div>
  );
}
