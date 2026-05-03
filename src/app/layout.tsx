import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

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
    description:
      "I break things to understand them — then I build better ones.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-bg text-text-primary">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}