"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useSpring(0, { damping: 20, stiffness: 250, mass: 0.5 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 250, mass: 0.5 });

  const ringX = useSpring(0, { damping: 30, stiffness: 150, mass: 0.8 });
  const ringY = useSpring(0, { damping: 30, stiffness: 150, mass: 0.8 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsHovering(
        !!target.closest('button') || 
        !!target.closest('a') || 
        target.style.cursor === 'pointer'
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Inner Dot */}
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        className="w-1.5 h-1.5 bg-accent-cyan rounded-full"
        animate={{ scale: isClicking ? 0.8 : 1 }}
      />

      {/* Outer Ring */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ 
          scale: isHovering ? 2.5 : 1,
          borderWidth: isHovering ? "1px" : "2px",
          opacity: isHovering ? 0.6 : 0.3
        }}
        className="w-8 h-8 rounded-full border-2 border-accent-cyan transition-all duration-300 ease-out"
      >
        {/* Tactical Crosshairs on Hover */}
        {isHovering && (
          <div className="absolute inset-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1.5 bg-accent-cyan" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-1.5 bg-accent-cyan" />
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-px bg-accent-cyan" />
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-px bg-accent-cyan" />
          </div>
        )}
      </motion.div>

      {/* Trailing Glow */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        className="w-20 h-20 bg-accent-cyan/5 rounded-full blur-2xl"
      />
    </div>
  );
}
