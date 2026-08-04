"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  once?: boolean;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  yOffset = 30,
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, scale: 0.96, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: yOffset, scale: 0.96, filter: "blur(10px)" }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
