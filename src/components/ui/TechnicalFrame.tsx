"use client";

import { HTMLAttributes, ReactNode } from "react";
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
  return (
    <Component 
      className={cn(
        "technical-frame relative overflow-hidden rounded-2xl", 
        "backdrop-blur-md bg-surface/75 dark:bg-surface-subtle/20 border border-border-strong",
        `technical-frame--${tone}`, 
        className
      )}
      {...props}
    >
      {(index || label) ? (
        <div className="technical-frame__meta relative z-10 flex items-center justify-between text-xs text-text-muted mb-4 pb-2 border-b border-border" aria-hidden="true">
          <span className="font-mono text-xs font-medium text-text-muted">{index}</span>
          {label && <span className="text-[11px] font-mono text-text-muted">{label}</span>}
        </div>
      ) : null}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
