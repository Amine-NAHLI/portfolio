"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PageLoadWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Refresh ScrollTrigger after initial layout render
    requestAnimationFrame(() => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
    });
  }, []);

  return <>{children}</>;
}
