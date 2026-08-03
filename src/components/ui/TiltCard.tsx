"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 });
  const mouseY = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 });

  function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const xPos = clientX - left;
    const yPos = clientY - top;

    mouseX.set(xPos);
    mouseY.set(yPos);

    // Calculate rotation (-10 to 10 degrees)
    const xPct = (xPos / width) - 0.5;
    const yPct = (yPos / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
    mouseX.set(-1000);
    mouseY.set(-1000);
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
      {/* Inner hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100 z-10 mix-blend-overlay"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.15),
              transparent 40%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  );
}
