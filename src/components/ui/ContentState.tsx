import { AlertCircle, Inbox, LoaderCircle, WifiOff } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

type ContentStateProps = {
  kind: "loading" | "empty" | "error" | "unavailable";
  dictionary: Dictionary["states"];
  onRetry?: () => void;
  className?: string;
};

const icons = {
  loading: LoaderCircle,
  empty: Inbox,
  error: AlertCircle,
  unavailable: WifiOff,
};

export default function ContentState({ kind, dictionary, onRetry, className }: ContentStateProps) {
  const Icon = icons[kind];
  const copy = {
    empty: [dictionary.emptyTitle, dictionary.emptyDescription],
    error: [dictionary.errorTitle, dictionary.errorDescription],
    unavailable: [dictionary.unavailableTitle, dictionary.unavailableDescription],
  } as const;

  if (kind === "loading") {
    return (
      <div
        className={cn("flex min-h-40 items-center justify-center gap-3 text-text-secondary", className)}
        role="status"
      >
        <Icon aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" />
        <span>{dictionary.loading}</span>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-8 text-center", className)} role={kind === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" className="mx-auto size-6 text-text-muted" />
      <h2 className="mt-4 text-lg font-semibold text-text-primary">{copy[kind][0]}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">{copy[kind][1]}</p>
      {kind === "error" && onRetry ? (
        <button className="button-secondary mt-5" type="button" onClick={onRetry}>
          {dictionary.retry}
        </button>
      ) : null}
    </div>
  );
}

