"use client";

import React from "react";
import dynamic from "next/dynamic";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

const SceneBackground = dynamic(() => import("@/components/three/SceneBackground"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <SceneBackground />
      <ScrollProgress />
      <SmoothScroll>
        <div id="main-content">{children}</div>
      </SmoothScroll>
    </>
  );
}
