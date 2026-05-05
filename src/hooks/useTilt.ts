import React from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const rectRef = React.useRef<DOMRect | null>(null);

  function onMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (!rectRef.current) {
      rectRef.current = event.currentTarget.getBoundingClientRect();
    }
    const { width, height, left, top } = rectRef.current;
    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  }

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}
