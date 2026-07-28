"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a loading progress that slows down as it gets closer to 100%
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 99) return p;
        const remaining = 100 - p;
        const jump = Math.max(1, Math.random() * (remaining / 5));
        return Math.min(99, p + jump);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-page bg-[image:var(--bg-gradient)] bg-cover bg-fixed backdrop-blur-md">
      {/* Brand / Logo */}
      <div className="mb-16 flex items-center gap-1">
        <span className="font-display text-4xl sm:text-5xl font-bold text-text-primary tracking-tighter">
          amine<span className="text-accent">nahli</span>
          <span className="text-accent align-top text-2xl font-black">↗</span>
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-64 sm:w-80 h-1 bg-surface-raised rounded-full overflow-hidden mb-6">
        {/* Animated Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-300 ease-out shadow-[0_0_15px_var(--color-accent)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <span className="font-mono text-sm text-text-primary font-bold">
          {Math.floor(progress)}%
        </span>
        <span className="font-body text-xs text-text-secondary">
          Processing data...
        </span>
      </div>

      {/* Spinner */}
      <div className="relative flex items-center justify-center w-12 h-12">
        <div className="absolute inset-0 rounded-full border border-accent/20"></div>
        <Loader2 className="size-6 text-accent animate-spin stroke-[1.5px]" />
      </div>
    </div>
  );
}
