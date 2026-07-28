"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

export default function LocaleDocumentAttributes({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  return null;
}
