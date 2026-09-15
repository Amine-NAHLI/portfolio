"use client";

import { useEffect, useState } from "react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

export default function Loading() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("portfolio_has_loaded");
      if (!hasLoaded) {
        setShouldShow(true);
      }
    }
  }, []);

  if (!shouldShow) return null;
  return <GlobalLoader />;
}
