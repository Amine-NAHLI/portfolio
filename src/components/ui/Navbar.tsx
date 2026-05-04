"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";

const Navbar = () => {
  const [active, setActive] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  // Progress bar logic
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Navbar scroll behavior (scale and opacity)
  const scale = useTransform(scrollY, [0, 80], [1, 0.97]);
  const glassOpacity = useTransform(scrollY, [0, 80], [0.6, 0.85]);

  // Spring transition for the navbar container
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Intersection Observer for active section
  useEffect(() => {
    const observers = navLinks.map((link) => {
      const id = link.href.replace("#", "");
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(id);
            }
          });
        },
        { threshold: 0.5, rootMargin: "-20% 0px -60% 0px" }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ─── TOP PROGRESS BAR ────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--color-cyan), var(--color-indigo), var(--color-purple))"
        }}
      />

      {/* ─── NAVBAR CONTAINER ────────────────────────────────────── */}
    <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // ease-out-expo
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <motion.div
          style={{ 
            scale: springScale,
            backgroundColor: useTransform(glassOpacity, (o) => `rgba(10, 10, 20, ${o})`)
          }}
          className="pointer-events-auto flex items-center justify-between w-full max-w-[720px] h-12 px-6 rounded-full glass border-[0.5px] border-[var(--border-default)]"
        >
          {/* Left: Monogram */}
          <Link 
            href="#home" 
            className="font-mono text-sm font-bold text-text-1 hover:gradient-text transition-all duration-300 group"
          >
            AN
          </Link>

          {/* Center: Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = active === id;

              return (
                <li key={link.name} className="relative">
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3 py-1 text-[13px] font-medium transition-colors duration-300 ${
                      isActive ? "text-text-1" : "text-text-2 hover:text-text-1"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Resume Button (Desktop) & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block px-4 py-1.5 text-[13px] font-mono border border-cyan text-cyan rounded-full hover:bg-cyan hover:text-bg-0 transition-all duration-300"
            >
              Resume
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden text-text-2 hover:text-text-1 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* ─── MOBILE MENU OVERLAY ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-bg-0/80 backdrop-blur-md md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // ease-out-expo
              className="absolute top-0 right-0 bottom-0 w-full max-w-[300px] bg-bg-1 border-l border-[var(--border-default)] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-mono text-lg font-bold gradient-text">AN</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="text-text-2 hover:text-text-1 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-xl font-medium ${
                        active === link.href.replace("#", "") ? "text-cyan" : "text-text-2"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto">
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 text-sm font-mono border border-cyan text-cyan rounded-xl hover:bg-cyan hover:text-bg-0 transition-all duration-300"
                >
                  Resume
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
