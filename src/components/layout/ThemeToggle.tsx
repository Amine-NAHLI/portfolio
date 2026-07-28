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
      <button type="button" className="theme-toggle" aria-hidden="true" disabled>
        <Moon className="size-4 opacity-0" />
        <span className="hidden sm:inline opacity-0">Dark</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isLight ? "Activer le thème sombre" : "Activer le thème clair"}
      aria-pressed={isLight}
      title={isLight ? "Dark theme" : "Light theme"}
    >
      {isLight ? <Moon aria-hidden="true" className="size-4" /> : <Sun aria-hidden="true" className="size-4" />}
      <span className="hidden sm:inline">{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
