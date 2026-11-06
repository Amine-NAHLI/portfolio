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

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // Aurora blob definitions — positions animate with sin/cos
    const blobs = [
      { cx: 0.15, cy: 0.1, rx: 0.45, ry: 0.5, speed: 0.0003, phase: 0, driftX: 0.08, driftY: 0.06 },
      { cx: 0.75, cy: 0.2, rx: 0.4, ry: 0.45, speed: 0.00025, phase: 2.1, driftX: 0.07, driftY: 0.09 },
      { cx: 0.5, cy: 0.7, rx: 0.55, ry: 0.5, speed: 0.00035, phase: 4.2, driftX: 0.1, driftY: 0.07 },
      { cx: 0.3, cy: 0.5, rx: 0.35, ry: 0.4, speed: 0.0002, phase: 1.5, driftX: 0.06, driftY: 0.08 },
      { cx: 0.85, cy: 0.65, rx: 0.3, ry: 0.35, speed: 0.00028, phase: 3.7, driftX: 0.05, driftY: 0.05 },
    ];

    // Color palettes mixed from requested colors: Black (#000000), Asphalt (#0C0404), Black Hole (#060605), Black Magic (#0B0510), Black Pearl (#0E161A)
    const darkColors = [
      ["rgba(14, 22, 26, 0.6)", "rgba(14, 22, 26, 0)"],   // Black Pearl #0E161A (left cool slate/teal depth)
      ["rgba(11, 5, 16, 0.7)", "rgba(11, 5, 16, 0)"],     // Black Magic #0B0510 (right violet/indigo depth)
      ["rgba(12, 4, 4, 0.45)", "rgba(12, 4, 4, 0)"],     // Asphalt #0C0404 (warm dark undertone)
      ["rgba(6, 6, 5, 0.6)", "rgba(6, 6, 5, 0)"],         // Black Hole #060605
      ["rgba(154, 113, 255, 0.08)", "rgba(154, 113, 255, 0)"], // Subtle accent glow
    ];

    function draw(time: number) {
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, width, height);

      const colors = darkColors;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const t = time * b.speed + b.phase;

        const cx = (b.cx + Math.sin(t) * b.driftX) * width;
        const cy = (b.cy + Math.cos(t * 0.7) * b.driftY) * height;
        const rx = b.rx * width * (0.9 + 0.1 * Math.sin(t * 1.3));
        const ry = b.ry * height * (0.9 + 0.1 * Math.cos(t * 0.9));

        const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        gradient.addColorStop(0, colors[i][0]);
        gradient.addColorStop(0.6, colors[i][0].replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.4})`));
        gradient.addColorStop(1, colors[i][1]);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.ellipse(cx, cy, rx, ry, Math.sin(t * 0.5) * 0.3, 0, Math.PI * 2);
        ctx!.fill();
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
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Base page color */}
      <div className="absolute inset-0 bg-bg-page transition-colors duration-700" />

      {/* Aurora canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-normal"
        style={{ filter: "blur(80px) saturate(1.4)" }}
      />

      {/* Subtle grain overlay for premium texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.25] mix-blend-overlay pointer-events-none">
        <filter id="auroraGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#auroraGrain)" />
      </svg>
    </div>
  );
}
