import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { getSiteUrl } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0f1720",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
