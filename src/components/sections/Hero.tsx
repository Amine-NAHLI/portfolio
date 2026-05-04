"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { useTypingCycle } from "@/hooks/useTypingCycle";
import { GithubIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

const ROLES = [
  "Security Engineer.",
  "Full-Stack Builder.",
  "Curious Mind.",
  "Problem Solver.",
];

/* ─── Animated Mesh Gradient ─────────────────────────────────────── */

const MeshGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <motion.div
      animate={{
        x: [0, 100, -100, 0],
        y: [0, -100, 100, 0],
      }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-cyan/20 blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, -150, 150, 0],
        y: [0, 150, -150, 0],
      }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-indigo/20 blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, 150, -150, 0],
        y: [0, 150, -150, 0],
      }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-purple/10 blur-[120px]"
    />
    <div className="absolute inset-0 grid-bg opacity-[0.03]" />
  </div>
);

/* ─── Hero Section ───────────────────────────────────────────────── */

export default function Hero({ profile }: { profile: GitHubProfile | null }) {
  const [mounted, setMounted] = useState(false);
  const { displayText } = useTypingCycle(ROLES);
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => setMounted(true), []);

  const displayName = profile?.name ?? "Amine Nahli";
  const githubUrl = profile?.html_url ?? "https://github.com/Amine-NAHLI";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  if (!mounted) return <section id="home" className="min-h-svh bg-bg-0" />;

  return (
    <section id="home" className="relative min-h-svh w-full flex items-center justify-center overflow-hidden">
      <MeshGradient />

      <motion.div 
        style={{ opacity, y }}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center text-center"
      >
        {/* Availability */}
        <motion.div variants={item} className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-white/5 mb-12 shadow-xl">
          <div className="relative flex h-2 w-2">
            <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-success"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-3">
            Available for opportunities
          </span>
        </motion.div>

        {/* Heading Reveal */}
        <motion.h1 variants={item} className="text-7xl md:text-[9vw] font-black tracking-tighter leading-[0.85] uppercase mb-8">
          {displayName.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-4 last:mr-0 overflow-hidden">
               <motion.span
                 initial={{ y: "100%" }}
                 animate={{ y: 0 }}
                 transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className={`inline-block ${i === 1 ? "gradient-text" : "text-text-1"}`}
               >
                 {word}
               </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.div variants={item} className="font-mono text-xl md:text-3xl text-text-3 flex items-center justify-center gap-4">
          <span>{displayText}</span>
          <motion.span 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-3 h-[1em] bg-cyan"
          />
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="mt-16 flex flex-wrap items-center justify-center gap-8">
          <Link
            href="#projects"
            className="group flex items-center gap-3 px-10 py-5 rounded-full bg-text-1 text-bg-0 font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl hover:shadow-cyan/10"
          >
            Explore Work
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="#contact"
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors"
            >
              Contact
            </Link>
            <div className="h-px w-8 bg-white/10" />
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-4 hover:text-cyan transition-colors"
            >
              <GithubIcon size={20} />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Aesthetic Accents */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
           <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Current Coordinates</span>
           <span className="font-mono text-[10px] uppercase tracking-widest text-text-2">Fès, Morocco (UTC+1)</span>
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}

const ScrollIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2, duration: 1 }}
    className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-4"
  >
    <div className="h-24 w-px bg-white/10 relative overflow-hidden">
      <motion.div 
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan to-transparent"
      />
    </div>
    <span className="font-mono text-[9px] uppercase tracking-[0.5em] vertical-text text-text-4">Scroll</span>
  </motion.div>
);
