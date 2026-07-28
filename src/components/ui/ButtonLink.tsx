import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "secondary" | "quiet";
};

export default function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[.06em] transition-[background-color,border-color,color,transform] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page",
        "active:translate-y-px",
        variant === "primary" &&
          "border border-accent bg-accent text-text-on-accent hover:bg-accent-hover hover:border-accent-hover",
        variant === "secondary" &&
          "border border-border-strong bg-surface text-text-primary hover:border-accent hover:text-accent",
        variant === "quiet" &&
          "border border-transparent bg-transparent text-text-secondary hover:bg-surface-raised hover:text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
