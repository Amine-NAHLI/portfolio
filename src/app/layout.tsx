import type { ReactNode } from "react";
import Script from "next/script";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const themeScript = `try { var theme = localStorage.getItem('portfolio-theme'); if (theme !== 'light' && theme !== 'dark') theme = 'dark'; document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch (_) { document.documentElement.dataset.theme = 'dark'; }`;

import { AdminAutoLogout } from "@/components/admin/AdminAutoLogout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning className={`${spaceGrotesk.variable} ${geist.variable} ${jetbrainsMono.variable}`}>
      <head><Script id="theme-preference" strategy="beforeInteractive">{themeScript}</Script></head>
      <body>
        <AdminAutoLogout />
        {children}
      </body>
    </html>
  );
}
