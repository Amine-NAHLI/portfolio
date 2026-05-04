"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    
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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 ${scrolled ? "glass shadow-2xl" : "bg-transparent"}`}>
            
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
                    activeSection === link.href.replace("#", "") ? "text-accent-cyan" : "text-text-4 hover:text-text-1"
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
                className="px-5 py-1.5 rounded-full border border-text-1/[0.1] text-[9px] font-mono uppercase tracking-[0.4em] text-text-1 hover:bg-text-1/[0.05] transition-colors"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg-0 flex flex-col items-center justify-center p-12"
          >
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-12 right-12 text-text-4 hover:text-text-1 transition-colors"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-5xl font-black tracking-tighter text-text-1 hover:text-accent-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4">Fès, Morocco</span>
              <div className="flex gap-8">
                 <a href="#" className="text-text-4 hover:text-text-1 transition-colors font-mono text-xs uppercase tracking-widest">LinkedIn</a>
                 <a href="#" className="text-text-4 hover:text-text-1 transition-colors font-mono text-xs uppercase tracking-widest">GitHub</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
