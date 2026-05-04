"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useTypingCycle } from "@/hooks/useTypingCycle";
import type { GitHubProfile } from "@/lib/github";

const ROLES = [
  "a security engineer.",
  "a full-stack builder.",
  "a curious mind.",
  "a problem solver.",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

interface HeroProps {
  profile: GitHubProfile | null;
  stats: {
    totalRepos: number;
    totalStars: number;
    languages: string[];
    categories: string[];
  };
  personal: { status: string };
}

export default function Hero({ profile, stats, personal }: HeroProps) {
  const [mounted, setMounted] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { displayText, currentRole } = useTypingCycle(ROLES);
  const { scrollY } = useScroll();
  
  // Gate transform behind mounted to avoid hydration mismatch
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = profile?.name ?? "Amine Nahli";
  const githubUrl = profile?.html_url ?? "https://github.com/Amine-NAHLI";

  if (!mounted) {
    return (
      <section id="home" className="relative min-h-[100svh] w-full flex flex-col items-center justify-center bg-bg-0">
        <div className="w-full max-w-[1280px] px-6 md:px-12 flex flex-col items-center text-center -translate-y-[5%] opacity-0">
          {/* Skeleton or empty space to preserve layout */}
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-bg-0"
    >
      {/* ─── BACKGROUND ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Animated Mesh Orbs */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan/15 blur-[80px]"
          style={{ animation: shouldReduceMotion ? "none" : "mesh-1 60s ease-in-out infinite alternate" }}
        />
        <div 
          className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo/12 blur-[100px]"
          style={{ animation: shouldReduceMotion ? "none" : "mesh-2 80s ease-in-out infinite alternate" }}
        />
        <div 
          className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple/10 blur-[90px]"
          style={{ animation: shouldReduceMotion ? "none" : "mesh-3 100s ease-in-out infinite alternate" }}
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-bg opacity-40" />

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-transparent to-transparent opacity-100" style={{ background: "linear-gradient(to top, var(--bg-0) 0%, transparent 30%)" }} />
      </div>

      {/* ─── CONTENT ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[1280px] px-6 md:px-12 flex flex-col items-center text-center -translate-y-[5%]"
      >
        {/* Status Pill */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/10 border-[0.5px] border-cyan/30"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-cyan ping-slow opacity-50" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-cyan" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan/80">
            Available for opportunities · 2026
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={itemVariants}
          className="mt-6 flex flex-col items-center gap-2 font-semibold tracking-[-0.03em] leading-[1.05]"
        >
          <span className="text-text-2 text-[48px] md:text-[64px]">Hi, I&apos;m</span>
          <span className="gradient-text text-[64px] md:text-[96px]">{displayName}.</span>
        </motion.h1>

        {/* Typing Effect */}
        <motion.div 
          variants={itemVariants}
          className="mt-4 flex items-center font-mono text-[16px] md:text-[20px]"
        >
          <span className="text-cyan">{">"}&nbsp;</span>
          <span className="text-text-3">I&apos;m&nbsp;</span>
          <span className="text-cyan">
            {shouldReduceMotion ? currentRole : displayText}
          </span>
          <span className="ml-1 inline-block w-2 h-[1.1em] bg-cyan cursor-blink" />
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="mt-8 max-w-[600px] space-y-2">
          <p className="text-text-2 text-base md:text-lg leading-relaxed">
            I break things to understand them — then I build better ones.
          </p>
          <p className="text-text-3 text-base md:text-lg leading-relaxed">
            {stats.totalRepos} shipped projects across security, full-stack, and computer vision.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 flex items-center gap-6 font-mono text-[13px]"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-1">{stats.totalRepos}</span>
            <span className="text-text-3">repos</span>
          </div>
          <div className="h-4 w-[1px] bg-[var(--border-default)]" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-1">{stats.totalStars}</span>
            <span className="text-text-3">stars</span>
          </div>
          <div className="h-4 w-[1px] bg-[var(--border-default)]" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-1">120</span>
            <span className="text-text-3">this year</span>
          </div>
          <div className="h-4 w-[1px] bg-[var(--border-default)]" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-1">{stats.languages.length}</span>
            <span className="text-text-3">languages</span>
          </div>
        </motion.div>

        {/* CTA Row */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#projects"
            className="flex items-center gap-2 px-6 py-3 rounded-[10px] bg-cyan text-bg-0 font-semibold text-sm hover:-translate-y-[2px] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-[250ms] ease-[var(--ease-out-expo)]"
          >
            View Work <ArrowDown size={16} />
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-2 px-6 py-3 rounded-[10px] border border-indigo/50 text-text-1 font-mono text-sm hover:bg-indigo/10 hover:border-indigo transition-all duration-300"
          >
            <Mail size={16} /> Get in Touch
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-2 hover:text-text-1 hover:underline underline-offset-4 decoration-1 transition-all duration-300"
          >
            <GithubIcon size={16} /> GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* ─── SCROLL INDICATOR ─── */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      >
        <div className="relative w-[1px] h-8 bg-white/10 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan origin-top"
            animate={{ scaleY: [0, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="font-mono text-[10px] text-text-3 uppercase tracking-[0.2em]">
          scroll
        </span>
      </motion.div>
    </section>
  );
}
