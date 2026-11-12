"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = "section h2, section p, section header span, section > div > div > span";

function isExcludedElement(el: HTMLElement): boolean {
  return Boolean(
    el.closest("#hero") ||
      el.closest("#manifesto") ||
      el.closest(".pin-spacer") ||
      el.closest('[role="dialog"]') ||
      el.closest("#terminal-chat") ||
      el.closest('[role="tooltip"]') ||
      el.closest("[data-lenis-prevent]") ||
      el.closest("[data-no-text-reveal]") ||
      el.closest(".cert-card-wrapper") ||
      el.closest(".github-anim-card") ||
      el.closest(".contact-card-btn") ||
      el.classList.contains("about-paragraph")
  );
}

/**
 * Lightweight scroll-triggered text reveal across page sections.
 * Keeps initial above-the-fold content visible immediately and gently fades in
 * headings and paragraphs as the user scrolls down.
 */
export default function ScrollTextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.getElementById("main-content");
    if (!main) return;

    const tracked = new Set<HTMLElement>();
    const pending = new Set<HTMLElement>();
    let batchIndex = 0;
    let batchTimer: ReturnType<typeof setTimeout> | null = null;
    let scrollRafId: number | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;

    const revealElement = (el: HTMLElement, observer: IntersectionObserver) => {
      if (!pending.has(el)) return;
      pending.delete(el);

      const delay = Math.min(batchIndex * 55, 165);
      batchIndex += 1;

      el.style.transitionDelay = `${delay}ms`;
      el.dataset.textReveal = "visible";

      window.setTimeout(() => {
        el.style.transitionDelay = "";
      }, delay + 750);

      observer.unobserve(el);

      if (batchTimer) clearTimeout(batchTimer);
      batchTimer = setTimeout(() => {
        batchIndex = 0;
      }, 120);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealElement(entry.target as HTMLElement, observer);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    const enrollCandidates = () => {
      const cutoff = window.innerHeight * 0.94;
      const elements = main.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

      for (const el of elements) {
        if (tracked.has(el) || el.dataset.textReveal) continue;
        if (isExcludedElement(el)) continue;

        const rect = el.getBoundingClientRect();
        if (rect.height <= 0 || rect.top < cutoff) continue;

        tracked.add(el);
        pending.add(el);
        el.dataset.textReveal = "hidden";
        observer.observe(el);
      }
    };

    const revealPassedElements = () => {
      scrollRafId = null;
      const cutoff = window.innerHeight * 0.96;
      for (const el of Array.from(pending)) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= cutoff) {
          revealElement(el, observer);
        }
      }
    };

    const handleScroll = () => {
      if (scrollRafId !== null || pending.size === 0) return;
      scrollRafId = window.requestAnimationFrame(revealPassedElements);
    };

    // Initial scan + re-scan for async-streamed/hydrated sections
    enrollCandidates();

    const mutationObserver = new MutationObserver(() => {
      if (rescanTimer) clearTimeout(rescanTimer);
      rescanTimer = setTimeout(enrollCandidates, 80);
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafId !== null) window.cancelAnimationFrame(scrollRafId);
      if (rescanTimer) clearTimeout(rescanTimer);
      if (batchTimer) clearTimeout(batchTimer);

      for (const el of tracked) {
        el.style.transitionDelay = "";
        if (el.dataset.textReveal === "hidden") {
          el.dataset.textReveal = "visible";
        }
      }
    };
  }, [pathname]);

  return null;
}
