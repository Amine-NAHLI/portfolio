"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";

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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-4" : "py-8"}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex items-center justify-between px-8 py-4 rounded-full transition-all duration-500 ${scrolled ? "glass shadow-2xl" : "bg-transparent"}`}>
            
            {/* Logo */}
            <Link href="#home" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-text-1 flex items-center justify-center text-bg-0 font-black text-lg transition-transform group-hover:rotate-12">
                A
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.5em] text-text-1 hidden md:block">
                Amine.Nahli
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-mono text-[10px] uppercase tracking-[0.4em] transition-colors relative group ${
                    activeSection === link.href.replace("#", "") ? "text-cyan" : "text-text-4 hover:text-text-1"
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-px bg-cyan transition-all ${
                    activeSection === link.href.replace("#", "") ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}
              <div className="h-4 w-px bg-white/10" />
              <Link
                href="#contact"
                className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-[0.4em] text-text-1 hover:bg-white/5 transition-colors"
              >
                Hire
              </Link>
            </div>

            {/* Mobile Trigger */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-text-1"
            >
              <Menu size={24} />
            </button>
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
                    className="text-5xl font-black tracking-tighter text-text-1 hover:text-cyan transition-colors"
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
