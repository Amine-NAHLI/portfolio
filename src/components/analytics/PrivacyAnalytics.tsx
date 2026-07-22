"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
const allowedEvents = new Set(["page_view", "project_view", "article_view", "github_click", "demo_click", "cv_open", "contact_submit", "language_change"]);

export function trackAnalyticsEvent(event: string, locale: Locale, path = window.location.pathname) {
  if (!enabled || !allowedEvents.has(event) || navigator.doNotTrack === "1") return;
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, locale, path }),
    keepalive: true,
  });
}

export function PrivacyAnalytics({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !pathname || navigator.doNotTrack === "1") return;
    trackAnalyticsEvent("page_view", locale, pathname);
    if (/^\/(fr|en)\/projects\/[^/]+$/.test(pathname)) trackAnalyticsEvent("project_view", locale, pathname);
    if (/^\/(fr|en)\/blog\/[^/]+$/.test(pathname)) trackAnalyticsEvent("article_view", locale, pathname);
  }, [locale, pathname]);

  useEffect(() => {
    if (!enabled) return;
    const trackClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      const eventName = target?.dataset.analyticsEvent;
      if (eventName) trackAnalyticsEvent(eventName, locale);
    };
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [locale]);

  return null;
}
