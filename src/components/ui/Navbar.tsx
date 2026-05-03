"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Stack", href: "#stack" },
  { name: "Timeline", href: "#timeline" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  const menuVariants = {
    closed: { x: "100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
    opened: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
  };

  const navLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      }
    })
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-bg-secondary/90 backdrop-blur-xl border-b border-white/10 py-3" 
            : "bg-transparent py-5"
        )}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-purple origin-left"
          style={{ scaleX }}
        />

        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="group">
            <motion.div 
              className="text-2xl font-mono font-bold tracking-tighter"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="bg-gradient-to-r from-accent-cyan to-accent-indigo bg-clip-text text-transparent">
                AN
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navLinkVariants}
                >
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full border border-accent-cyan text-accent-cyan text-sm font-semibold hover:bg-accent-cyan hover:text-bg-secondary transition-all duration-300"
            >
              Download CV
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-text-secondary hover:text-accent-cyan transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial="closed"
              animate="opened"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-bg-secondary border-l border-white/10 z-[70] p-8 md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="text-2xl font-mono font-bold tracking-tighter">
                  <span className="bg-gradient-to-r from-accent-cyan to-accent-indigo bg-clip-text text-transparent">
                    AN
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-text-secondary hover:text-accent-cyan transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-6 mb-12">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xl font-medium text-text-secondary hover:text-accent-cyan transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full py-4 rounded-xl border border-accent-cyan text-accent-cyan font-bold hover:bg-accent-cyan hover:text-bg-secondary transition-all"
              >
                Download CV
              </motion.button>
              
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-text-muted text-xs text-center font-mono">
                  &copy; {new Date().getFullYear()} AMINE NAHLI
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
