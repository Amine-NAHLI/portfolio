import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amine Nahli — Security Engineer × Full-Stack Builder",
  description: "I break things to understand them — then I build better ones. Security engineer & full-stack developer based in Morocco.",
  keywords: ["Amine Nahli", "Security Engineer", "Full Stack", "Morocco", "Pentesting", "Laravel", "Python"],
  authors: [{ name: "Amine Nahli" }],
  openGraph: {
    title: "Amine Nahli — Portfolio",
    description: "Security Engineer × Full-Stack Builder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}