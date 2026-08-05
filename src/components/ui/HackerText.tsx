"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function HackerText({
  text,
  className,
  as: Component = "span",
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
}) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  const triggerAnimation = () => {
    let iteration = -2; // Start negative for a pure random scramble at the beginning
    let interval: NodeJS.Timeout | undefined;

    const animate = () => {
      if (interval) clearInterval(interval);
      
      interval = setInterval(() => {
        setDisplayText((prev) =>
          prev
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return char === " " ? " " : LETTERS[Math.floor(Math.random() * 26)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 4; // Slower reveal (was 1/3)
      }, 35);
    };

    animate();
    return interval;
  };

  useEffect(() => {
    if (!inView) return;
    const interval = triggerAnimation();
    return () => clearInterval(interval);
  }, [text, inView]);

  return (
    <Component 
      ref={ref} 
      className={className}
      onMouseEnter={triggerAnimation}
    >
      {displayText}
    </Component>
  );
}
