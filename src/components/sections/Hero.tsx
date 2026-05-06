"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowRight, Download } from "lucide-react";
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

const MeshGradient = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 50, y: (e.clientY / window.innerHeight - 0.5) * 50 });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-[0.08] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
      <div className="absolute inset-0 noise-bg mix-blend-soft-light opacity-10 dark:opacity-[0.05]" />
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
        }}
        style={{ translateX: mousePos.x, translateY: mousePos.y }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-accent-cyan/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -150, 150, 0],
          y: [0, 150, -150, 0],
        }}
        style={{ translateX: -mousePos.x * 1.5, translateY: -mousePos.y * 1.5 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-accent-indigo/20 blur-[120px]"
      />
      <div className="absolute inset-0 grid-bg opacity-[0.05] dark:opacity-[0.02]" />
    </div>
  );
};

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
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (!mounted) return <section id="home" className="min-h-svh bg-bg-0" />;

  return (
    <section id="home" className="relative min-h-screen w-full flex items-start justify-center overflow-hidden pt-28 md:pt-32 lg:pt-[120px] pb-20 bg-transparent">
      <MeshGradient />
      <motion.div 
        style={{ opacity, y }}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16"
      >
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          {/* Availability */}
          <motion.div variants={item} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent-green-bg border border-accent-green/20 dark:border-white/10 mb-10 shadow-sm dark:shadow-none transition-colors">
            <div className="relative flex h-2 w-2">
              <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-accent-green"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-green font-bold">
              Available for opportunities
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={item} className="text-6xl md:text-8xl lg:text-[7vw] font-black tracking-tighter leading-[0.85] uppercase mb-8">
            {displayName.split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-3 last:mr-0 overflow-hidden">
                 <motion.span
                   initial={{ y: "100%" }}
                   animate={{ y: 0 }}
                   transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                   className={`inline-block ${i === 1 ? "text-accent-cyan" : "text-text-1"}`}
                 >
                   {word}
                 </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Tagline */}
          <motion.div variants={item} className="font-mono text-xl md:text-2xl text-text-2 dark:text-text-3 flex items-center gap-4 mb-12">
            <span>{displayText}</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-[1em] bg-accent-cyan"
            />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6">
            <Link
              href="#projects"
              className="group flex items-center gap-2.5 px-10 py-5 rounded-full bg-text-1 text-bg-0 dark:bg-accent-cyan dark:text-[#0f172a] font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-accent-cyan dark:hover:bg-accent-cyan/80 hover:scale-[1.03] active:scale-[0.98] shadow-2xl"
            >
              Explore Work
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="/nahli amine cv.pdf"
              download="nahli amine cv.pdf"
              className="group flex items-center gap-2.5 px-10 py-5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-accent-cyan hover:text-bg-0 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Download size={14} />
              Download CV
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex items-center gap-8">
            <Link
              href="#contact"
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-3 hover:text-text-1 transition-all"
            >
              Contact
            </Link>
            <div className="h-px w-12 bg-bg-3" />
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-4 hover:text-accent-cyan transition-colors"
            >
              <GithubIcon size={20} />
            </a>
          </motion.div>
        </div>

        {/* RIGHT CONTENT: PROFILE PHOTO */}
        <motion.div 
          variants={item}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            e.currentTarget.style.setProperty("--tilt-x", `${y * 20}deg`);
            e.currentTarget.style.setProperty("--tilt-y", `${-x * 20}deg`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty("--tilt-x", `0deg`);
            e.currentTarget.style.setProperty("--tilt-y", `0deg`);
          }}
          className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2 perspective-1000"
        >
          <div 
            className="relative group transition-transform duration-500 ease-out"
            style={{ transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))" }}
          >
            {/* Artistic Decorations */}
            <div className="absolute -inset-10 bg-accent-cyan/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Floating Code Signature */}
            <div className="absolute -top-12 -left-12 font-mono text-[9px] text-accent-cyan/40 select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 group-hover:-translate-y-2">
               <div className="flex flex-col gap-1">
                  <span>01  struct Engineer &#123;</span>
                  <span>02    let status: String = "Active"</span>
                  <span>03    let focus: String = "Security"</span>
                  <span>04  &#125;</span>
               </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-accent-cyan/20 rounded-tr-[3rem] pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-accent-cyan/20 rounded-bl-[3rem] pointer-events-none" />
            
            <div className="relative w-[280px] h-[350px] md:w-[350px] md:h-[450px] rounded-[3rem] border-2 border-slate-200 dark:border-white/5 p-3 bg-slate-50 dark:bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                <img 
                  src="/nahli.png" 
                  alt="Amine Nahli" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-0/60 via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Float Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 min-w-[160px] px-6 py-3 rounded-2xl bg-white dark:bg-bg-1 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl backdrop-blur-xl flex items-center gap-4 z-20"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-accent-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <div className="flex flex-col">
               <span className="font-mono text-[9px] uppercase tracking-widest text-text-3">Status</span>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider whitespace-nowrap">Operational</span>
              </div>
            </motion.div>
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
           <span className="font-mono text-[9px] uppercase tracking-widest text-text-3">Current Coordinates</span>
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
    <div className="h-24 w-px bg-slate-200 dark:bg-white/10 relative overflow-hidden">
      <motion.div 
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan to-transparent"
      />
    </div>
    <span className="font-mono text-[9px] uppercase tracking-[0.5em] vertical-text text-text-4">Scroll</span>
  </motion.div>
);
