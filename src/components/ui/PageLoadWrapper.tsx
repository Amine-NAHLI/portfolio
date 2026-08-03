"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GlobalLoader } from "./GlobalLoader";

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
        // Add a small delay for smooth transition
        timeoutId = setTimeout(() => {
          if (!isCancelled) setIsLoading(false);
        }, 400);
      } else {
        timeoutId = setTimeout(checkReady, 100);
      }
    };

    // Start checking
    checkReady();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[99999] transition-opacity duration-700 pointer-events-none ${
          isLoading ? "opacity-100 bg-bg-page" : "opacity-0"
        }`}
      >
        {isLoading && <div className="pointer-events-auto h-full w-full"><GlobalLoader /></div>}
      </div>
      {children}
    </>
  );
}
