import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "secondary" | "quiet";
};

export default function ButtonLink({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonLinkProps) {
  // Polygon for chamfered corners (Top-Right and Bottom-Left cut)
  const clipPath = "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";
  const innerClipPath = "polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))";

  return (
    <Link
      className={cn(
        "group relative inline-flex min-h-11 items-center justify-center gap-2 font-mono text-xs font-semibold uppercase tracking-[.06em] transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page",
        "active:scale-95",
        className
      )}
      style={{ clipPath }}
      {...props}
    >
      {/* Outer Border Background (Creates the 1px border effect) */}
      <div 
        className={cn(
          "absolute inset-0 transition-colors duration-300",
          variant === "primary" ? "bg-accent" : 
          variant === "secondary" ? "bg-border-strong group-hover:bg-accent" : 
          "bg-transparent group-hover:bg-accent/50"
        )} 
      />
      
      {/* Inner Background (Slightly smaller to reveal the border) */}
      <div 
        className={cn(
          "absolute inset-px transition-colors duration-300",
          variant === "primary" ? "bg-accent group-hover:bg-accent-hover" : 
          variant === "secondary" ? "bg-surface group-hover:bg-surface" : 
          "bg-transparent group-hover:bg-surface-raised"
        )}
        style={{ clipPath: innerClipPath }}
      />
      
      {/* Corner Tech Accents (HUD brackets) */}
      {variant !== "quiet" && (
        <>
          <div className="absolute left-0 top-0 size-2 border-l-2 border-t-2 border-white/40 opacity-50 transition-opacity duration-300 group-hover:opacity-100 group-hover:border-white" />
          <div className="absolute right-0 bottom-0 size-2 border-b-2 border-r-2 border-white/40 opacity-50 transition-opacity duration-300 group-hover:opacity-100 group-hover:border-white" />
        </>
      )}

      {/* Content */}
      <div 
        className={cn(
          "relative z-10 flex w-full h-full items-center justify-center gap-2 px-5 py-2.5 transition-colors duration-300",
          variant === "primary" ? "text-text-on-accent" : 
          variant === "secondary" ? "text-text-primary group-hover:text-accent" : 
          "text-text-secondary group-hover:text-text-primary"
        )}
      >
        {children}
      </div>
    </Link>
  );
}
