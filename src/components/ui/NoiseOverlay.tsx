"use client";

import { memo } from "react";

const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.035] dark:opacity-[0.05] mix-blend-overlay overflow-hidden">
      <div 
        className="absolute inset-[-100%] h-[300%] w-[300%] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] animate-noise-drift" 
      />
    </div>
  );
});

export default NoiseOverlay;
