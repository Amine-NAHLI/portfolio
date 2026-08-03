"use client";

import { useState, useRef, useEffect } from "react";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

export default function TextScramble({ children, className = "" }: { children: string, className?: string }) {
  const [text, setText] = useState(children);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update if children changes
  useEffect(() => {
    setText(children);
  }, [children]);

  const handleMouseEnter = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setText(
        children
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return children[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= children.length) {
        clearInterval(intervalRef.current!);
      }

      iteration += 1 / 3;
    }, 30);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setText(children);
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      className={`inline-block whitespace-nowrap ${className}`}
    >
      {text}
    </span>
  );
}
