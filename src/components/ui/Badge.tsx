import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

