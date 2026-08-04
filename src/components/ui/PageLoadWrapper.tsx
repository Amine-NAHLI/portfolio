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

    let isCancelled = false;
    let timeoutId: NodeJS.Timeout;

    const checkReady = () => {
      if (isCancelled) return;
      
      const images = Array.from(document.images);
      const allLoaded = images.every(img => img.complete);
      
      if (allLoaded && document.readyState === "complete") {
        // Wait for the simulated progress to hit 100% in GlobalLoader (approx 800ms)
        timeoutId = setTimeout(() => {
          if (!isCancelled) setIsLoading(false);
        }, 1200);
      } else {
        timeoutId = setTimeout(checkReady, 100);
      }
    };

    checkReady();

    return () => {
      isCancelled = true;
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
