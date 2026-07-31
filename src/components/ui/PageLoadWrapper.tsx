"use client";

import { useEffect, useState } from "react";
import { GlobalLoader } from "./GlobalLoader";

export function PageLoadWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the document is already fully loaded
    if (document.readyState === "complete") {
      setIsLoading(false);
      return;
    }

    // Otherwise, wait for the window load event
    const handleLoad = () => {
      // Add a tiny delay to ensure animations and initial renders are smooth
      setTimeout(() => setIsLoading(false), 300);
    };

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[99999] transition-opacity duration-700 pointer-events-none ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        {isLoading && <div className="pointer-events-auto h-full w-full"><GlobalLoader /></div>}
      </div>
      {children}
    </>
  );
}
