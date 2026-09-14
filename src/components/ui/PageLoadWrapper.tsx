"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GlobalLoader } from "./GlobalLoader";
import { AnimatePresence } from "framer-motion";

export function PageLoadWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);

    // Wait for the simulated progress to hit 100% in GlobalLoader (approx 1200ms)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <GlobalLoader key="global-loader" />}
      </AnimatePresence>
      {children}
    </>
  );
}
