"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export default function CountUp({
  to,
  duration = 2,
  delay = 0,
}: {
  to: number;
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.32, 0.72, 0, 1],
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });

    return () => controls.stop();
  }, [to, duration, delay]);

  return <>{count}</>;
}
