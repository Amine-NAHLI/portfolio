"use client";

import { useEffect, useRef } from "react";

/**
 * Aurora-style premium background.
 * Renders layered, slow-moving gradient blobs that morph and blend
 * like liquid light / northern aurora. Works in both light and dark themes.
 */
export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    let isScrolling = false;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    function resize() {
      // Background auroras are soft continuous gradients: DPR 1 is crisp, perfectly smooth,
      // and eliminates massive multi-megapixel overdraw on Retina / 4K displays.
      const dpr = 1;
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // Aurora blob definitions — larger radii with multi-stop radial gradients
    // provide native soft light without requiring heavy GPU post-processing blur filters.
    const blobs = [
      { cx: 0.15, cy: 0.1, rx: 0.65, ry: 0.7, speed: 0.0003, phase: 0, driftX: 0.08, driftY: 0.06 },
      { cx: 0.75, cy: 0.2, rx: 0.6, ry: 0.65, speed: 0.00025, phase: 2.1, driftX: 0.07, driftY: 0.09 },
      { cx: 0.5, cy: 0.7, rx: 0.75, ry: 0.7, speed: 0.00035, phase: 4.2, driftX: 0.1, driftY: 0.07 },
      { cx: 0.3, cy: 0.5, rx: 0.55, ry: 0.6, speed: 0.0002, phase: 1.5, driftX: 0.06, driftY: 0.08 },
      { cx: 0.85, cy: 0.65, rx: 0.5, ry: 0.55, speed: 0.00028, phase: 3.7, driftX: 0.05, driftY: 0.05 },
    ];

    // Midnight Lime neutral charcoal & olive atmospheric layers (#0B0B0C base + subtle #C8F122 ambient whisper)
    const darkColors = [
      ["rgba(18, 19, 22, 0.65)", "rgba(18, 19, 22, 0)"],
      ["rgba(15, 16, 19, 0.7)", "rgba(15, 16, 19, 0)"],
      ["rgba(22, 26, 14, 0.35)", "rgba(22, 26, 14, 0)"],
      ["rgba(11, 11, 12, 0.6)", "rgba(11, 11, 12, 0)"],
      ["rgba(200, 241, 34, 0.05)", "rgba(200, 241, 34, 0)"],
    ];

    const lightColors = [
      ["rgba(236, 239, 234, 0.85)", "rgba(236, 239, 234, 0)"],
      ["rgba(116, 141, 146, 0.20)", "rgba(116, 141, 146, 0)"],
      ["rgba(0, 102, 255, 0.12)", "rgba(0, 102, 255, 0)"],
      ["rgba(228, 232, 229, 0.72)", "rgba(228, 232, 229, 0)"],
      ["rgba(0, 102, 255, 0.08)", "rgba(0, 102, 255, 0)"],
    ];

    let isLightTheme = document.documentElement.dataset.theme === "light";

    const handleScroll = () => {
      if (!isMobile) return;
      isScrolling = true;
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new MutationObserver(() => {
      isLightTheme = document.documentElement.dataset.theme === "light";
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    function drawBlobs(time: number, colors: string[][], alpha: number) {
      if (alpha <= 0.005) return;
      ctx!.save();
      ctx!.globalAlpha = alpha;

      const blobCount = isMobile ? 3 : blobs.length;

      for (let i = 0; i < blobCount; i++) {
        const b = blobs[i];
        const t = time * b.speed + b.phase;

        const cx = (b.cx + Math.sin(t) * b.driftX) * width;
        const cy = (b.cy + Math.cos(t * 0.7) * b.driftY) * height;
        const rx = b.rx * width * (0.9 + 0.1 * Math.sin(t * 1.3));
        const ry = b.ry * height * (0.9 + 0.1 * Math.cos(t * 0.9));

        const radius = Math.max(rx, ry);
        const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, colors[i][0]);
        gradient.addColorStop(0.35, colors[i][0].replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.65})`));
        gradient.addColorStop(0.7, colors[i][0].replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.2})`));
        gradient.addColorStop(1, colors[i][1]);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.ellipse(cx, cy, rx, ry, Math.sin(t * 0.5) * 0.3, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore();
    }

    let isVisible = true;
    let lastRenderTime = 0;
    const targetInterval = isMobile ? 40 : 33; // ~25-30fps throttle (saves 60% CPU/battery for slow atmospheric aurora)

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReduced) {
        cancelAnimationFrame(animRef.current);
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function draw(time: number) {
      if (!isVisible) return;
      if (isMobile && isScrolling) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Throttle rendering: aurora motion is very slow, 30fps is visually identical to 120fps with a fraction of CPU load
      if (time - lastRenderTime < targetInterval) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastRenderTime = time;

      // Base background fill matching active theme
      // Dark: #0B0B0C (11, 11, 12), Light: #D3D9D4 (211, 217, 212)
      ctx!.fillStyle = isLightTheme ? "rgb(211, 217, 212)" : "rgb(11, 11, 12)";
      ctx!.fillRect(0, 0, width, height);

      // Render only the active theme's blobs (zero double-allocation)
      if (isLightTheme) {
        drawBlobs(time, lightColors, 1);
      } else {
        drawBlobs(time, darkColors, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    // Check reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      animRef.current = requestAnimationFrame(draw);
    } else {
      // Draw once, static
      draw(0);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Base page color */}
      <div className="absolute inset-0 bg-bg-page transition-colors duration-700" />

      {/* Aurora canvas without expensive GPU-filter blur */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-normal transform-gpu will-change-transform"
      />

      {/* Lightweight, high-performance static noise overlay (SVG data-URI compiled once by GPU) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
