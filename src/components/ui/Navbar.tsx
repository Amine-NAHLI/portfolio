"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { navLinks } from "@/data/navigation";

const useActiveSection = () => {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useActiveSection();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[1.5px] origin-left z-[60]"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #06b6d4, #6366f1, #a855f7)",
        }}
      />

      {/* Floating pill */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-2xl"
      >
        <motion.div
          animate={{ scale: scrolled ? 0.97 : 1 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="glass-pill rounded-[999px] px-4 py-2.5 flex items-center justify-between"
        >
          {/* Monogram */}
          <Link href="#home" className="text-[15px] font-mono font-bold tracking-tight" aria-label="Back to top">
            <span className="gradient-text">AN</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="relative px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-[250ms]"
                    style={{ color: isActive ? "#06b6d4" : "#64748b" }}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-cyan"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Resume + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="/cv.pdf"
              download
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-[13px] font-semibold hover:bg-accent-cyan hover:text-bg transition-all duration-[250ms]"
            >
              <Download size={13} aria-hidden="true" />
              Resume
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-full text-text-muted hover:text-text-primary transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
              aria-hidden="true"
            />
            <motion.div
              key="sheet"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-bg-secondary/95 backdrop-blur-xl border-l border-white/8 z-[80] p-8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-lg font-mono font-bold gradient-text">AN</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="flex flex-col gap-2 flex-1" role="list">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-lg font-medium text-text-secondary hover:text-accent-cyan transition-colors border-b border-white/5"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="/cv.pdf"
                download
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 py-3.5 rounded-xl border border-accent-cyan text-accent-cyan font-semibold hover:bg-accent-cyan hover:text-bg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download size={15} aria-hidden="true" />
                Download Resume
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
