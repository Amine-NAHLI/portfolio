"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hoverType, setHoverType] = useState<"none" | "link" | "card" | "three">("none");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const hoverTypeRef = useRef<string>("none");

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest("a, button, [role='button'], .project-card");
      const isCanvas = target.tagName.toLowerCase() === "canvas";

      let nextType: "none" | "link" | "card" | "three" = "none";
      if (isCanvas) nextType = "three";
      else if (hoverable) {
        nextType = (hoverable.classList.contains("project-card") || hoverable.closest("#projects")) 
          ? "card" 
          : "link";
      }

      if (nextType !== hoverTypeRef.current) {
        hoverTypeRef.current = nextType;
        setHoverType(nextType);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [visible, mouseX, mouseY]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <motion.div
        style={{ x, y }}
        className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        {/* Main Dot */}
        <motion.div
          animate={{
            width: hoverType === "card" ? 80 : hoverType === "link" ? 40 : 8,
            height: hoverType === "card" ? 80 : hoverType === "link" ? 40 : 8,
            backgroundColor: hoverType === "link" ? "rgba(255,255,255,1)" : "rgba(6,182,212,1)",
            mixBlendMode: hoverType === "link" ? "difference" : "normal",
          }}
          className="rounded-full flex items-center justify-center"
        >
          <AnimatePresence>
            {hoverType === "card" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[10px] font-black text-bg-0 uppercase tracking-widest"
              >
                View
              </motion.span>
            )}
            {hoverType === "three" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                 <div className="absolute w-4 h-px bg-cyan" />
                 <div className="absolute h-4 w-px bg-cyan" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Ring */}
        <motion.div
          animate={{
            scale: hoverType !== "none" ? 1.5 : 1,
            opacity: hoverType !== "none" ? 0 : 0.5,
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 border border-cyan rounded-full w-8 h-8 -ml-4 -mt-4"
        />
      </motion.div>
    </div>
  );
}
