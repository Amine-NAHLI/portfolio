"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const scrollIfTarget = () => {
        const target = document.querySelector(hash);
        if (target && window.__lenis) {
          ScrollTrigger.refresh();
          window.__lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.2 });
        }
      };
      const t1 = setTimeout(scrollIfTarget, 150);
      const t2 = setTimeout(scrollIfTarget, 500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register ScrollTrigger once on the client
    gsap.registerPlugin(ScrollTrigger);

    // Prevent browser native jump from fighting Lenis on page load/refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      prevent: (node: HTMLElement) => {
        if (!node) return false;

        // 1. If element or ancestor explicitly requests prevention via attribute
        if (
          node.hasAttribute?.("data-lenis-prevent") ||
          node.closest?.("[data-lenis-prevent]")
        ) {
          return true;
        }

        // 2. If inside any modal, dialog, terminal, popup, drawer, or fullscreen menu
        if (
          node.closest?.('[role="dialog"]') ||
          node.closest?.('[aria-modal="true"]') ||
          node.closest?.("[data-scroll-lock]") ||
          node.closest?.(".modal-overlay") ||
          node.closest?.("#terminal-chat")
        ) {
          return true;
        }

        // 3. If body scroll is locked (e.g. any modal is open)
        if (typeof document !== "undefined" && document.body.style.overflow === "hidden") {
          return true;
        }

        // 4. If hovering over any scrollable inner container (overflow-y or overflow-x auto/scroll)
        let el: HTMLElement | null = node;
        while (el && el !== document.body && el !== document.documentElement) {
          const style = window.getComputedStyle(el);
          const hasScrollY =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            el.scrollHeight > el.clientHeight;
          const hasScrollX =
            (style.overflowX === "auto" || style.overflowX === "scroll") &&
            el.scrollWidth > el.clientWidth;
          if (hasScrollY || hasScrollX) {
            return true;
          }
          el = el.parentElement;
        }

        return false;
      },
    });

    // Make lenis globally accessible for navbar and in-page anchor links
    window.__lenis = lenis;

    // Synchronize Lenis scroll event with ScrollTrigger calculations
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis directly from GSAP's internal animation ticker
    // Ensures a single unified 60/120fps clock without frame-skipping
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger layout calculation
    ScrollTrigger.refresh();

    // Check if page loaded with an anchor hash (e.g. #certifications, #work, #journey)
    const handleInitialHash = () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          ScrollTrigger.refresh();
          lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.2, immediate: false });
        }
      }
    };

    const hashTimer = setTimeout(handleInitialHash, 250);
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Handle hash changes (e.g. back/forward button or external hash navigation)
    const handleHashChange = () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.2 });
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    // Intercept in-page anchor link clicks to scroll smoothly with Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const [path, hash] = href.split("#");
      if (!hash) return;

      const currentPath = window.location.pathname;
      const isSamePage =
        !path ||
        path === currentPath ||
        path === currentPath.replace(/\/$/, "") ||
        (currentPath.endsWith("/") && path === currentPath.slice(0, -1));

      if (isSamePage) {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          e.preventDefault();
          window.history.pushState(null, "", `#${hash}`);
          lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      clearTimeout(hashTimer);
      clearTimeout(refreshTimer);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete window.__lenis;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
