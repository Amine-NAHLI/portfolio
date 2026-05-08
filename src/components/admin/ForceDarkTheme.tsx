"use client";

import { useEffect } from "react";

export function ForceDarkTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");

    return () => {
      const saved = localStorage.getItem("theme");
      if (saved === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };
  }, []);

  return null;
}
