import type { ReactNode } from "react";
import Script from "next/script";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const themeScript = `(function(){try{var s=localStorage.getItem('portfolio-theme');var t=(s==='light'||s==='dark')?s:'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(_){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark';}})();`;

import { AdminAutoLogout } from "@/components/admin/AdminAutoLogout";

import FluidBackground from "@/components/layout/FluidBackground";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${spaceGrotesk.variable} ${geist.variable} ${jetbrainsMono.variable}`}>
      <head><Script id="theme-preference" strategy="beforeInteractive">{themeScript}</Script></head>
      <body>
        <FluidBackground />
        <AdminAutoLogout />
        {children}
      </body>
    </html>
  );
}
