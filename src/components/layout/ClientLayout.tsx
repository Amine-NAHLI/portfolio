"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import DeepBackground from "@/components/ui/DeepBackground";
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // Starts false — both SSR and initial client render agree on opacity: 0 (no hydration mismatch)
  const [contentReady, setContentReady] = useState(false);
  const didReveal = useRef(false);

  useEffect(() => {
    setMounted(true);

    function reveal() {
      if (didReveal.current) return;
      didReveal.current = true;

      const splash = document.getElementById("splash-screen");
      if (splash) {
        // CSS handles the 0.8s fade-out via the transition rule in globals.css
        splash.style.opacity = "0";
        splash.style.pointerEvents = "none";
        // Start fading content in while the splash is still partially visible
        setTimeout(() => setContentReady(true), 400);
        // Remove from layout after the transition completes
        setTimeout(() => { splash.style.display = "none"; }, 900);
      } else {
        setContentReady(true);
      }
    }

    // 1. Fonts ready
    const fontsReady = document.fonts.ready;

    // 2. All resources loaded (images etc.) — 4 s cap so a slow CDN never blocks forever
    const domReady = new Promise<void>(resolve => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        const cap = setTimeout(resolve, 4000);
        window.addEventListener("load", () => { clearTimeout(cap); resolve(); }, { once: true });
      }
    });

    // 3. Minimum time so Framer Motion and CSS animations have at least one full render cycle
    const minDelay = new Promise<void>(resolve => setTimeout(resolve, 1500));

    // 4. Portfolio content hydrated (server data rendered, SkillsSection rows built)
    //    ContentReadySignal dispatches this event; 3 s fallback handles edge cases.
    const contentMounted = new Promise<void>(resolve => {
      const cap = setTimeout(resolve, 3000);
      window.addEventListener("portfolio:content-ready", () => { clearTimeout(cap); resolve(); }, { once: true });
    });

    Promise.all([fontsReady, domReady, minDelay, contentMounted]).then(reveal);

    // Hard fallback: never keep users waiting past 5 s regardless of network
    const hardCap = setTimeout(reveal, 5000);
    return () => clearTimeout(hardCap);
  }, []);

  return (
    <>
      {mounted && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <DeepBackground />
        </>
      )}
      <div
        id="main-content"
        className="bg-bg-0 text-text-2 relative z-10"
        style={{
          opacity: contentReady ? 1 : 0,
          pointerEvents: contentReady ? "auto" : "none",
          transition: "opacity 0.8s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
