"use client";

import { useEffect } from "react";

export default function ContentReadySignal() {
  useEffect(() => {
    window.dispatchEvent(new Event("portfolio:content-ready"));
  }, []);
  return null;
}
