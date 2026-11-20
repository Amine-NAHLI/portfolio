"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const xPos = clientX - left;
    const yPos = clientY - top;

    // Calculate rotation (-10 to 10 degrees)
    const xPct = (xPos / width) - 0.5;
    const yPct = (yPos / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(useSpring(y, { stiffness: 300, damping: 30 }), (val) => val * -15);
  const rotateY = useTransform(useSpring(x, { stiffness: 300, damping: 30 }), (val) => val * 15);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative group transition-all duration-200 ease-linear", className)}
    >
      {children}
    </motion.div>
  );
}
