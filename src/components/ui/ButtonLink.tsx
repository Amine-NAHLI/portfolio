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
  return (
    <Link
      className={cn(
        "group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.06em] transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page",
        "active:scale-95",
        variant === "primary" && "bg-accent text-text-on-accent hover:bg-accent-hover shadow-md hover:shadow-accent/25",
        variant === "secondary" && "bg-surface/80 border border-white/10 text-text-primary hover:border-accent/40 hover:bg-surface hover:text-accent backdrop-blur-md",
        variant === "quiet" && "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Link>
  );
}
