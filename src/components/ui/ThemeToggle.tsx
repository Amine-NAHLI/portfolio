"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";
const THEME_EVENT = "portfolio-theme-change";

function readActiveTheme(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(next: ThemeMode) {
  document.documentElement.dataset.theme = next;
  document.documentElement.style.colorScheme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage quota or private browsing errors
  }
  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: next }));
}

export function ThemeToggle({
  locale = "en",
  showLabel = false,
  className = "",
}: {
  locale?: "fr" | "en";
  showLabel?: boolean;
  className?: string;
}) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readActiveTheme());
    setMounted(true);

    const onThemeEvent = (event: Event) => {
      const custom = event as CustomEvent<ThemeMode>;
      if (custom.detail === "light" || custom.detail === "dark") {
        setTheme(custom.detail);
      } else {
        setTheme(readActiveTheme());
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next: ThemeMode = event.newValue === "light" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        document.documentElement.style.colorScheme = next;
        setTheme(next);
      }
    };

    window.addEventListener(THEME_EVENT, onThemeEvent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(THEME_EVENT, onThemeEvent);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const isLight = mounted && theme === "light";
  const nextTheme: ThemeMode = isLight ? "dark" : "light";

  const ariaLabel =
    locale === "fr"
      ? isLight
        ? "Passer au thème sombre"
        : "Passer au thème clair"
      : isLight
        ? "Switch to dark theme"
        : "Switch to light theme";

  const label =
    locale === "fr"
      ? isLight
        ? "Sombre"
        : "Clair"
      : isLight
        ? "Dark"
        : "Light";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      aria-label={ariaLabel}
      aria-pressed={isLight}
      title={ariaLabel}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-border-strong bg-text-primary/[0.04] px-2.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-text-primary/[0.08] cursor-pointer ${className}`}
    >
      {isLight ? (
        <Moon className="size-3.5 text-accent" />
      ) : (
        <Sun className="size-3.5 text-accent" />
      )}
      {showLabel ? <span>{mounted ? label : locale === "fr" ? "Clair" : "Light"}</span> : null}
    </button>
  );
}

