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

function applyTheme(next: ThemeMode, event?: React.MouseEvent | MouseEvent) {
  if (typeof document === "undefined") return;

  const updateDom = () => {
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage quota or private browsing errors
    }
    window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: next }));
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasViewTransition =
    "startViewTransition" in document &&
    typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === "function" &&
    !prefersReduced;

  if (hasViewTransition) {
    try {
      let x = window.innerWidth / 2;
      let y = 40;

      if (event && (event.clientX !== 0 || event.clientY !== 0)) {
        x = event.clientX;
        y = event.clientY;
      } else if (event?.currentTarget instanceof HTMLElement) {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      type ViewTransition = {
        ready: Promise<void>;
        finished: Promise<void>;
      };

      const vt = (document as unknown as { startViewTransition: (cb: () => void) => ViewTransition }).startViewTransition(updateDom);

      vt.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {});

      vt.finished.catch(() => {});
    } catch {
      updateDom();
    }
  } else {
    document.documentElement.classList.add("theme-transitioning");
    updateDom();
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 280);
  }
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
      onClick={(e) => {
        applyTheme(nextTheme, e);
        setTheme(nextTheme);
      }}
      aria-label={ariaLabel}
      aria-pressed={isLight}
      title={ariaLabel}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-border-strong bg-text-primary/[0.04] px-2.5 py-1.5 text-xs font-medium text-text-primary transition-all duration-200 hover:bg-text-primary/[0.08] active:scale-95 cursor-pointer ${className}`}
    >
      <div className="relative size-3.5 flex items-center justify-center" aria-hidden="true">
        <Sun
          className={`size-3.5 text-accent absolute transition-all duration-500 ease-out ${
            isLight
              ? "opacity-0 rotate-90 scale-50 pointer-events-none"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`size-3.5 text-accent absolute transition-all duration-500 ease-out ${
            isLight
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50 pointer-events-none"
          }`}
        />
      </div>
      {showLabel ? <span className="transition-opacity duration-300">{mounted ? label : locale === "fr" ? "Clair" : "Light"}</span> : null}
    </button>
  );
}

