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
    } else {
      window.scrollTo(0, 0);
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
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

    // Force window to top immediately if no anchor hash is specified
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      virtualScroll: (data) => {
        // Never hijack touch events on mobile/tablets — preserve 100% native 120Hz/60Hz hardware momentum scrolling!
        if (data.event.type.includes("touch")) {
          return false;
        }
        return true;
      },
      prevent: (node: HTMLElement) => {
        if (!node) return false;

        // 1. If element or ancestor explicitly requests prevention via attribute, or scrollable container
        if (
          node.hasAttribute?.("data-lenis-prevent") ||
          node.closest?.(
            "[data-lenis-prevent], [role='dialog'], [aria-modal='true'], [data-scroll-lock], .modal-overlay, #terminal-chat, .overflow-y-auto, .overflow-auto"
          )
        ) {
          return true;
        }

        // 2. If body scroll is locked (e.g. any modal is open)
        if (typeof document !== "undefined" && document.body.style.overflow === "hidden") {
          return true;
        }

        return false;
      },
    });

    // Make lenis globally accessible for navbar and in-page anchor links
    window.__lenis = lenis;

    // Reset scroll to top immediately if no anchor hash in URL
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }

    // Synchronize Lenis scroll event with ScrollTrigger calculations
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis directly from GSAP's internal animation ticker
    // Ensures a single unified 60/120fps clock without frame-skipping
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(500, 33);

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
