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
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          #splash-screen {
            position: fixed;
            inset: 0;
            background: #0B0F19;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
          }
          .splash-logo {
            width: 80px;
            height: 80px;
            background: #E5E7EB;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0B0F19;
            font-family: sans-serif;
            font-weight: 900;
            font-size: 40px;
            box-shadow: 0 0 50px rgba(255,255,255,0.1);
            animation: pulse 2s infinite ease-in-out;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          .splash-scanner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, #06B6D4, transparent);
            animation: scan 3s linear infinite;
          }
          @keyframes scan {
            from { transform: translateY(0); }
            to { transform: translateY(100vh); }
          }
        `}} />
      </head>
      <body className="bg-bg-0 text-text-1" suppressHydrationWarning>
        <div id="splash-screen" suppressHydrationWarning>
          <div className="splash-scanner"></div>
          <div className="splash-logo">A</div>
        </div>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
