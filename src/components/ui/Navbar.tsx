"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { navLinks } from "@/data/navigation";
import { useTheme } from "@/contexts/ThemeContext";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const ids = ["home", "about", "projects", "stack", "contact"];
    let observer: IntersectionObserver | null = null;

    function setupObserver() {
      observer?.disconnect();

      const sections = ids
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (sections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) setActiveSection(target.id);
          });
        },
        { threshold: 0.4, rootMargin: "0px 0px -20% 0px" }
      );

      sections.forEach(s => observer!.observe(s));
    }

    setupObserver();

    const onReady = () => setupObserver();
    window.addEventListener("portfolio:content-ready", onReady, { once: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("portfolio:content-ready", onReady);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "py-0 backdrop-blur-md border-b border-[var(--border)]"
            : "py-4 bg-transparent"
        }`}
        style={scrolled ? { backgroundColor: "var(--bg-navbar)" } : undefined}
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

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-mono text-[9px] uppercase tracking-[0.4em] transition-colors relative group ${
                      isActive ? "text-accent-cyan" : "text-text-3 hover:text-text-1"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-scanner"
                        className="absolute -bottom-1 left-0 h-0.5 bg-accent-cyan shadow-[0_0_10px_rgba(0,180,216,0.5)] z-10"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                      >
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        />
                      </motion.div>
                    )}
                    <span className="absolute -bottom-1 left-0 h-px bg-text-1/5 w-full" />
                  </Link>
                );
              })}

              <div className="h-3 w-px bg-text-1/[0.1]" />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-text-3 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors duration-200"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <Link
                href="#contact"
                className="px-5 py-1.5 rounded-full border border-[var(--border)] text-[9px] font-mono uppercase tracking-[0.4em] text-text-1 hover:bg-text-1/[0.05] transition-colors"
              >
                Hire
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-text-3"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="text-text-1 p-2 rounded-xl bg-text-1/5 border border-[var(--border)]"
              >
                <Menu size={20} />
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
              className="absolute top-10 right-10 p-3 rounded-full bg-text-1/5 text-text-4 hover:text-text-1 transition-all border border-[var(--border)]"
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
