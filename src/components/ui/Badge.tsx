import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-[.68rem] font-medium uppercase tracking-[.06em] text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}
