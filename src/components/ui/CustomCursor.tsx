"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { stiffness: 500, damping: 40 });
  const y = useSpring(rawY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      rawX.set(e.clientX - 4);
      rawY.set(e.clientY - 4);
      if (!visible) setVisible(true);
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    const attachHover = () => {
      document.querySelectorAll("a, button, [role='button'], [role='tab']").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    window.addEventListener("mousemove", move);
    attachHover();

    const obs = new MutationObserver(attachHover);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      obs.disconnect();
    };
  }, [rawX, rawY, visible]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999 }}
      animate={{ scale: hovered ? 3 : 1, opacity: hovered ? 0.5 : 0.9 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-2 h-2 rounded-full bg-accent-cyan mix-blend-difference"
    />
  );
};

export default CustomCursor;
