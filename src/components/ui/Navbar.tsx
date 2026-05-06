"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? "py-0 bg-bg-1/80 backdrop-blur-md border-b border-bg-3 dark:border-white/10"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            
            {/* Logo */}
            <Link href="#home" className="group flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-text-1 flex items-center justify-center text-bg-0 font-black text-base transition-transform group-hover:rotate-12">
                A
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-1 hidden md:block">
                Amine.Nahli
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-mono text-[9px] uppercase tracking-[0.4em] transition-colors relative group ${
                    activeSection === link.href.replace("#", "") ? "text-accent-cyan" : "text-text-2 dark:text-text-3 hover:text-text-1"
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-px bg-accent-cyan transition-all ${
                    activeSection === link.href.replace("#", "") ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}
              <div className="h-3 w-px bg-text-1/[0.1]" />
              <ThemeToggle />
              <Link
                href="#contact"
                className="px-5 py-1.5 rounded-full border border-bg-3 dark:border-white/10 text-[9px] font-mono uppercase tracking-[0.4em] text-text-1 hover:bg-bg-2 dark:hover:bg-text-1/[0.05] transition-colors"
              >
                Hire
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={() => setMobileOpen(true)}
                className="text-text-1"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-[200] bg-bg-0/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8"
          >
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-10 right-10 p-3 rounded-full bg-slate-100 dark:bg-white/5 text-text-4 hover:text-text-1 transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: EASE_OUT_EXPO }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-4xl md:text-6xl font-black tracking-tighter text-text-1 hover:text-accent-cyan transition-all uppercase"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-16 flex flex-col items-center gap-6">
              <div className="h-px w-12 bg-accent-cyan/30" />
              <div className="flex gap-10">
                 <a href="https://linkedin.com/in/amine-nahli" className="text-text-4 hover:text-text-1 transition-colors font-mono text-[10px] uppercase tracking-[0.3em]">LinkedIn</a>
                 <a href="https://github.com/Amine-NAHLI" className="text-text-4 hover:text-text-1 transition-colors font-mono text-[10px] uppercase tracking-[0.3em]">GitHub</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
