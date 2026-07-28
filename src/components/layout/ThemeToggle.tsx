"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const storageKey = "portfolio-theme";

function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme);
  const isLight = theme === "light";

  useEffect(() => {
    const root = document.documentElement;
    const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (!pointerMedia.matches || reducedMotion.matches || connection.connection?.saveData) return;

    let frame = 0;
    let point: { x: number; y: number } | null = null;
    const update = () => {
      frame = 0;
      if (!point) return;
      root.style.setProperty("--pointer-x", `${point.x}px`);
      root.style.setProperty("--pointer-y", `${point.y}px`);
    };
    const handlePointerMove = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
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
