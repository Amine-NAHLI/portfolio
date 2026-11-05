"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ParallaxImageProps {
  children: ReactNode;
  className?: string;
  speed?: number; // E.g., 0.1 to 0.3 for subtle cinematic depth
}

export default function ParallaxImage({
  children,
  className = "",
  speed = 0.15,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !targetRef.current) return;

      const yMovement = containerRef.current.offsetHeight * speed;

      gsap.fromTo(
        targetRef.current,
        {
          y: -yMovement,
        },
        {
          y: yMovement,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div ref={targetRef} className="size-full will-change-transform scale-110">
        {children}
      </div>
    </div>
  );
}

