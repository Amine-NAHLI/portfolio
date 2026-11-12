"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface RoadPoint {
  x: number;
  y: number;
}

/** Builds a smooth C1-continuous winding GPS route path through sequential waypoint coordinates. */
export function buildWindingRoadPath(points: RoadPoint[], width: number): string {
  if (points.length === 0) return "";

  const first = points[0];
  const last = points[points.length - 1];
  const isDesktop = width >= 768;
  const stub = isDesktop ? 44 : 28;

  if (points.length === 1) {
    return `M ${first.x} ${Math.max(8, first.y - stub)} L ${first.x} ${first.y + stub}`;
  }

  // Enter & exit vertically inside the open pin corridor so the road never cuts behind cards
  const parts: string[] = [
    `M ${first.x} ${Math.max(8, first.y - stub)} L ${first.x} ${first.y}`,
  ];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dy = p2.y - p1.y;
    // Higher mobile vertical tension keeps the road clear of card corners before crossing horizontally
    const tension = isDesktop ? 0.72 : 0.84;
    parts.push(
      `C ${p1.x} ${p1.y + dy * tension}, ${p2.x} ${p2.y - dy * tension}, ${p2.x} ${p2.y}`
    );
  }

  parts.push(`L ${last.x} ${last.y + stub}`);

  return parts.join(" ");
}

interface WindingRoadOverlayProps {
  wrapperRef: RefObject<HTMLDivElement | null>;
  pinRefs: RefObject<(HTMLDivElement | null)[]>;
  itemCount: number;
}

/** Renders a layered SVG winding map road and drives a glowing GPS route trace + beacon along scroll. */
export default function WindingRoadOverlay({
  wrapperRef,
  pinRefs,
  itemCount,
}: WindingRoadOverlayProps) {
  const measurePathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const beaconRef = useRef<SVGGElement>(null);

  const [geometry, setGeometry] = useState({ width: 1000, height: 800, d: "" });

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let observer: ResizeObserver | null = null;

    const updateGeometry = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return false;

      const wRect = wrapper.getBoundingClientRect();
      if (wRect.width === 0 || wRect.height === 0) return false;

      const points = pinRefs.current
        .slice(0, itemCount)
        .filter((el): el is HTMLDivElement => Boolean(el))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left - wRect.left + r.width / 2,
            y: r.top - wRect.top + r.height / 2,
          };
        });

      const d = buildWindingRoadPath(points, wRect.width);
      if (!d) return false;

      setGeometry((prev) => {
        if (
          Math.abs(prev.width - wRect.width) < 1 &&
          Math.abs(prev.height - wRect.height) < 1 &&
          prev.d === d
        ) {
          return prev;
        }
        return { width: wRect.width, height: wRect.height, d };
      });
      return true;
    };

    const bind = (attempt = 0) => {
      if (cancelled) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) {
        if (attempt < 20) {
          rafId = requestAnimationFrame(() => bind(attempt + 1));
        }
        return;
      }

      updateGeometry();
      rafId = requestAnimationFrame(() => updateGeometry());

      observer = new ResizeObserver(() => updateGeometry());
      observer.observe(wrapper);
    };

    bind();

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) updateGeometry();
      });
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const handleResize = () => {
      updateGeometry();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!cancelled) updateGeometry();
      }, 120);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [wrapperRef, pinRefs, itemCount]);

  useGSAP(
    () => {
      if (
        typeof window === "undefined" ||
        !wrapperRef.current ||
        !measurePathRef.current ||
        !progressPathRef.current ||
        !corePathRef.current ||
        !geometry.d
      ) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const measurePath = measurePathRef.current;
      const glowPath = progressPathRef.current;
      const corePath = corePathRef.current;
      const beacon = beaconRef.current;

      const totalLen = measurePath.getTotalLength();
      if (totalLen <= 0) return;

      const applyProgress = (rawProgress: number) => {
        const p = Math.max(0, Math.min(1, rawProgress));
        const dashOffset = totalLen * (1 - p);

        glowPath.style.strokeDasharray = `${totalLen}`;
        glowPath.style.strokeDashoffset = `${dashOffset}`;
        corePath.style.strokeDasharray = `${totalLen}`;
        corePath.style.strokeDashoffset = `${dashOffset}`;

        if (beacon) {
          if (p > 0.005 && p < 0.998) {
            const pt = measurePath.getPointAtLength(p * totalLen);
            beacon.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
            beacon.style.opacity = "1";
          } else {
            beacon.style.opacity = "0";
          }
        }
      };

      // Initialize at current scroll state
      applyProgress(0);

      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top 75%",
        end: "bottom 75%",
        scrub: true,
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onUpdate: (self) => applyProgress(self.progress),
        onRefresh: (self) => applyProgress(self.progress),
      });

      const rafRefresh = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        applyProgress(st.progress);
      });

      return () => {
        cancelAnimationFrame(rafRefresh);
        st.kill();
      };
    },
    { scope: wrapperRef, dependencies: [geometry.d] }
  );

  if (!geometry.d) return null;

  const isMobile = geometry.width < 768;
  const curbWidth = isMobile ? 13 : 20;
  const asphaltWidth = isMobile ? 11.5 : 18;
  const dashWidth = isMobile ? 1 : 1.25;
  const dashArray = isMobile ? "4 7" : "5 9";
  const traceWidth = isMobile ? 2.2 : 3;
  const coreWidth = isMobile ? 0.9 : 1.1;

  return (
    <svg
      aria-hidden="true"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      className="pointer-events-none absolute inset-0 size-full overflow-visible z-0"
    >
      {/* Subtle architectural road border / curb */}
      <path
        d={geometry.d}
        fill="none"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth={curbWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Matte dark tarmac road bed */}
      <path
        ref={measurePathRef}
        d={geometry.d}
        fill="none"
        stroke="#0B0B0C"
        strokeWidth={asphaltWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Understated cartographic centerline dashes */}
      <path
        d={geometry.d}
        fill="none"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth={dashWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
      />

      {/* Calm scroll-driven route progress line (no harsh neon glow) */}
      <path
        ref={progressPathRef}
        d={geometry.d}
        fill="none"
        stroke="rgba(200, 241, 34, 0.55)"
        strokeWidth={traceWidth}
        strokeLinecap="round"
      />

      {/* Crisp restrained inner filament */}
      <path
        ref={corePathRef}
        d={geometry.d}
        fill="none"
        stroke="rgba(255, 255, 255, 0.72)"
        strokeWidth={coreWidth}
        strokeLinecap="round"
      />

      {/* Minimalist precision navigation marker riding along scroll */}
      <g ref={beaconRef} style={{ opacity: 0 }}>
        <circle
          r={isMobile ? 5.5 : 7}
          fill="rgba(200, 241, 34, 0.16)"
          stroke="rgba(200, 241, 34, 0.45)"
          strokeWidth="1"
        />
        <circle
          r={isMobile ? 2.5 : 3}
          fill="#C8F122"
          stroke="#0B0B0C"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}
