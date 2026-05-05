"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { motion } from "framer-motion";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

const GeometricBackground = dynamic(() => import("@/components/ui/GeometricBackground"), {
  ssr: false,
});

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
      <GeometricBackground />
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
