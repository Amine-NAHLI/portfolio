"use client";

import { HTMLAttributes, ReactNode, useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

type TechnicalFrameProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div" | "aside";
  children: ReactNode;
  index?: string;
  label?: string;
  tone?: "default" | "quiet" | "raised";
};

export default function TechnicalFrame({
  as: Component = "article",
  children,
  className,
  index,
  label,
  tone = "default",
  ...props
}: TechnicalFrameProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Component 
      className={cn(
        "technical-frame relative overflow-hidden rounded-2xl", 
        "backdrop-blur-md bg-surface-subtle/40 dark:bg-surface-subtle/20 border border-white/10",
        `technical-frame--${tone}`, 
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      {...props}
    >
      <div 
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(200,241,34, 0.12), transparent 40%)`
        }}
      />
      {(index || label) ? (
        <div className="technical-frame__meta relative z-10 flex items-center justify-between text-xs text-[#A1A1AA] mb-4 pb-2 border-b border-white/[0.06]" aria-hidden="true">
          <span className="font-semibold text-[#C8F122]">{index}</span>
          <span>{label}</span>
        </div>
      ) : null}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
