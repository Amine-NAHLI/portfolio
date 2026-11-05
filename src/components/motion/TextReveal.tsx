"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export default function TextReveal({
  children,
  className = "",
  delay = 0.1,
  duration = 0.9,
  stagger = 0.03,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const words = containerRef.current.querySelectorAll(".char-item");
      if (words.length === 0) return;

      gsap.fromTo(
        words,
        {
          yPercent: 120,
          opacity: 0,
          rotateZ: 4,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`overflow-hidden inline-block ${className}`}>
      {typeof children === "string" ? (
        <span className="inline-block overflow-hidden">
          {children.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em]">
              {word.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="char-item inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </span>
      ) : (
        children
      )}
    </div>
  );
}
