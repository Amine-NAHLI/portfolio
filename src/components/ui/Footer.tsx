"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Stack", href: "#stack" },
  { name: "Timeline", href: "#timeline" },
  { name: "Contact", href: "#contact" },
];

/**
 * Easter egg — types out a terminal message character by character, loops.
 */
const TerminalEasterEgg = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "session paused · ready when you are";

  useEffect(() => {
    let charIndex = 0;
    let direction: "forward" | "backward" = "forward";
    let pauseTimeout: NodeJS.Timeout | null = null;

    const tick = () => {
      if (direction === "forward") {
        charIndex++;
        setDisplayText(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          pauseTimeout = setTimeout(() => {
            direction = "backward";
            tick();
          }, 3000);
          return;
        }
      } else {
        charIndex--;
        setDisplayText(fullText.slice(0, charIndex));
        if (charIndex <= 0) {
          direction = "forward";
        }
      }
      pauseTimeout = setTimeout(tick, direction === "forward" ? 80 : 40);
    };

    tick();
    return () => {
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, []);

  return (
    <div className="font-mono text-[10px] text-text-muted/30 uppercase tracking-[0.3em] flex items-center gap-1">
      <span>{displayText}</span>
      <span className="w-1 h-3 bg-accent-cyan/30 animate-pulse" />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 bg-bg overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Massive tagline */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter select-none cursor-default gradient-text opacity-30 hover:opacity-80 transition-opacity duration-700"
          >
            BUILT WITH INTENTION.
          </motion.h2>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-14">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-mono text-text-muted hover:text-accent-cyan transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-text-muted">
            © {new Date().getFullYear()} Amine Nahli.{" "}
            <span className="text-emerald-500/50 italic ml-1">
              All systems operational.
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://linkedin.com/in/amine-nahli-48b2a734b"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-cyan transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="https://github.com/Amine-NAHLI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-cyan transition-colors duration-300"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="mailto:nahli-ami@upf.ac.ma"
              className="text-text-muted hover:text-accent-cyan transition-colors duration-300"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Easter Egg */}
        <div className="mt-10 flex justify-center">
          <TerminalEasterEgg />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
