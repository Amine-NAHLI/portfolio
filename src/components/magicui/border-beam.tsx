"use client";

import { cn } from "@/lib/utils";
import { motion, type Transition } from "framer-motion";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  reverse?: boolean;
  initialOffset?: number;
  transition?: Transition;
}

export function BorderBeam({
  className,
  size = 180,
  duration = 8,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = "#C8F122",
  colorTo = "#38BDF8",
  delay = 0,
  reverse = false,
  transition,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        // Mask styles
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        className
      )}
    >
      <motion.div
        className={cn(
          "absolute aspect-square bg-gradient-to-l from-[var(--color-from)] to-[var(--color-to)] [offset-anchor:calc(var(--size)*1px)_50%]",
          reverse
            ? "[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] scale-x-[-1]"
            : "[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]"
        )}
        style={{
          width: "var(--size)",
          offsetPath: `rect(0 auto auto 0 round calc(var(--size) * 1px))`,
        }}
        animate={{
          offsetDistance: reverse ? ["100%", "0%"] : ["0%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay,
          ...transition,
        }}
      />
    </div>
  );
}
