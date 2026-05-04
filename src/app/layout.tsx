import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Amine Nahli — Security Engineer × Full-Stack Builder",
  description:
    "I break things to understand them — then I build better ones. Security engineer & full-stack developer based in Fès, Morocco.",
  keywords: [
    "Amine Nahli",
    "Security Engineer",
    "Full Stack Developer",
    "Penetration Testing",
    "Laravel",
    "Next.js",
    "Python",
    "Portfolio",
    "Morocco",
    "UPF Fès",
  ],
  authors: [{ name: "Amine Nahli" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Amine Nahli — Security Engineer × Full-Stack Builder",
    description: "I break things to understand them — then I build better ones.",
    type: "website",
    locale: "en_US",
    url: "https://amine-nahli.dev",
    siteName: "Amine Nahli",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amine Nahli — Security Engineer × Full-Stack Builder",
    description: "I break things to understand them — then I build better ones.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-bg text-text-primary">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <CustomCursor />
        <SmoothScroll>
          <div id="main-content">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
