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

const Footer = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "session paused · ready when you are";
  
  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    
    const interval = setInterval(() => {
      if (!isDeleting) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
        if (index === fullText.length) {
          setTimeout(() => { isDeleting = true; }, 3000);
        }
      } else {
        setDisplayText(fullText.slice(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
        }
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative pt-24 pb-12 bg-bg overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6">
        {/* Top Tagline */}
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity duration-700 select-none cursor-default bg-gradient-to-b from-white to-transparent bg-clip-text text-transparent"
          >
            BUILT WITH INTENTION.
          </motion.h2>
        </div>

        {/* Middle Navigation */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-mono text-text-muted hover:text-accent-cyan transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-mono text-text-muted">
            © {new Date().getFullYear()} Amine Nahli. <span className="text-green-500/50 italic ml-1">All systems operational.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com/in/amine-nahli-48b2a734b" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent-cyan transition-colors">
              <LinkedinIcon size={18} />
            </a>
            <a href="https://github.com/Amine-NAHLI" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent-cyan transition-colors">
              <GithubIcon size={18} />
            </a>
            <a href="mailto:nahli-ami@upf.ac.ma" className="text-text-muted hover:text-accent-cyan transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Easter Egg Terminal */}
        <div className="mt-12 flex justify-center">
          <div className="font-mono text-[10px] text-text-muted/30 uppercase tracking-[0.3em] flex items-center gap-2">
            <span>{displayText}</span>
            <span className="w-1 h-3 bg-accent-cyan/30 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
