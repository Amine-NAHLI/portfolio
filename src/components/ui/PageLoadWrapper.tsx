"use client";

import { useEffect, useState } from "react";
import { GlobalLoader } from "./GlobalLoader";

export function PageLoadWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("portfolio_has_loaded");
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasLoaded = sessionStorage.getItem("portfolio_has_loaded");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // First visit in session: show loader for 1.2s then record in sessionStorage
    const timeoutId = setTimeout(() => {
      sessionStorage.setItem("portfolio_has_loaded", "true");
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {isLoading && <GlobalLoader />}
      {children}
    </>
  );
}
