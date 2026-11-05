"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const storageKey = "portfolio-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(currentTheme);
  }, []);

  const isLight = theme === "light";

  function toggleTheme() {
    const nextTheme: Theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  }

  // Prevent hydration mismatch by not rendering the icon until mounted
  if (!mounted) {
    return (
      <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 font-mono text-[0.7rem] font-semibold uppercase text-text-secondary opacity-0" aria-hidden="true" disabled>
        <Moon className="size-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 font-mono text-[0.7rem] font-semibold uppercase text-text-secondary transition-all hover:border-accent/40 hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={isLight ? "Activer le thème sombre" : "Activer le thème clair"}
      aria-pressed={isLight}
      title={isLight ? "Dark theme" : "Light theme"}
    >
      {isLight ? <Moon aria-hidden="true" className="size-3.5 text-accent" /> : <Sun aria-hidden="true" className="size-3.5 text-amber-400" />}
      <span className="hidden sm:inline">{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
