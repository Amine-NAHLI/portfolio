"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GlobalLoader } from "./GlobalLoader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PageLoadWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasLoaded = sessionStorage.getItem("portfolio_has_loaded");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // First visit in session: show loader for 1.2s then record in sessionStorage
    setIsLoading(true);

    if (!window.location.hash) {
      window.scrollTo(0, 0);
      if (window.__lenis) {
        window.__lenis.stop();
        window.__lenis.scrollTo(0, { immediate: true });
      }
    }

    const timeoutId = setTimeout(() => {
      sessionStorage.setItem("portfolio_has_loaded", "true");
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLoaderExit = () => {
    if (typeof window === "undefined") return;

    // Ensure scroll is strictly pinned to top when loader finishes
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      if (window.__lenis) {
        window.__lenis.start();
        window.__lenis.scrollTo(0, { immediate: true });
      }
    } else if (window.__lenis) {
      window.__lenis.start();
    }

    // Refresh ScrollTrigger so pinning & trigger offsets are calculated on settled viewport
    requestAnimationFrame(() => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
    });
  };

  return (
    <>
      <AnimatePresence onExitComplete={handleLoaderExit}>
        {isLoading && <GlobalLoader key="global-loader" />}
      </AnimatePresence>
      {children}
    </>
  );
}
