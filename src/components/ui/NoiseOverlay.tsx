"use client";

import { memo } from "react";

const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.015] dark:opacity-[0.025] overflow-hidden" 
    />
  );
});

export default NoiseOverlay;
