"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const splash = document.getElementById("splash-screen");
    if (splash) {
      splash.style.opacity = "0";
      splash.style.pointerEvents = "none";
      const timer = setTimeout(() => {
        splash.style.display = "none";
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="theme" enableColorScheme={true}>
      <CustomCursor />
      <ScrollProgress />
      <SmoothScroll>
        <div id="main-content" className="bg-bg-0 text-text-2 transition-colors duration-500">
          {children}
        </div>
      </SmoothScroll>
    </ThemeProvider>
  );
}
