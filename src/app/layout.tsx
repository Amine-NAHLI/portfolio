import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

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
    <html lang="en" className="antialiased selection:bg-cyan selection:text-bg-0">
      <body className="bg-bg-0 text-text-1">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
