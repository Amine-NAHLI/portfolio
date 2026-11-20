"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  animateOnHover?: boolean;
}

const CHARACTERS = "0101_#@$[]{}<>/%*&^~+=!?-:;abcdef0123456789";

export function HyperText({
  children,
  className,
  duration = 700,
  delay = 0,
  animateOnHover = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(() =>
    children.split("")
  );
  const [isTriggered, setIsTriggered] = useState(false);
  const iterationsRef = useRef(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTriggered(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isTriggered) return;

    let intervalId: NodeJS.Timeout;

    const startAnimation = () => {
      iterationsRef.current = 0;
      clearInterval(intervalId);

      intervalId = setInterval(() => {
        if (iterationsRef.current < children.length) {
          setDisplayText((currentText) =>
            currentText.map((letter, i) =>
              letter === " "
                ? " "
                : i <= iterationsRef.current
                  ? children[i]
                  : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
            )
          );
          iterationsRef.current += 0.2;
        } else {
          clearInterval(intervalId);
          setDisplayText(children.split(""));
        }
      }, duration / children.length);
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      startAnimation();
      return;
    }

    if (animateOnHover && !isFirstRender.current) {
      startAnimation();
    }

    return () => clearInterval(intervalId);
  }, [children, duration, isTriggered, animateOnHover]);

  return (
    <span
      className={cn("inline-flex font-mono select-none cursor-default", className)}
      onMouseEnter={() => {
        if (animateOnHover) {
          iterationsRef.current = 0;
          setIsTriggered(true);
        }
      }}
    >
      <AnimatePresence>
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={cn(letter === " " ? "w-2" : "")}
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
