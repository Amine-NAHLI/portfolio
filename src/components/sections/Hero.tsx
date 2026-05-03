"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { GitHubProfile } from "@/lib/github";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene"),
  { ssr: false, loading: () => null }
);

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const roles = [
  "a security engineer.",
  "a full-stack builder.",
  "a problem solver.",
  "a curious mind.",
];

interface HeroProps {
  profile: GitHubProfile | null;
  stats: {
    totalRepos: number;
    categories: string[];
  };
  personal: {
    status: string;
  };
}

const Hero = ({ profile, stats, personal }: HeroProps) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = profile?.name || "Amine Nahli";
  const bio = profile?.bio || "I break things to understand them — then I build better ones.";
  const githubUrl = profile?.html_url || "https://github.com/Amine-NAHLI";

  const handleTyping = useCallback(() => {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      setDisplayText((prev) => currentRole.substring(0, prev.length - 1));
    } else {
      setDisplayText((prev) => currentRole.substring(0, prev.length + 1));
    }
  }, [isDeleting, roleIndex]);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timeout = setTimeout(handleTyping, isDeleting ? 40 : 80);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, handleTyping]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      <HeroScene />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.7)_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Status Badge — Dynamic from Profile README */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-accent-cyan uppercase">
             {personal.status}
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
          <span className="text-text-primary">Hi, I&apos;m</span>
          <br />
          <span className="gradient-text">{displayName}.</span>
        </motion.h1>

        <motion.div variants={itemVariants} className="text-xl md:text-2xl lg:text-3xl font-mono text-text-secondary mb-6 h-10">
          <span>I&apos;m </span>
          <span className="text-accent-cyan">{displayText}</span>
          <span className="inline-block w-[2px] h-[0.8em] bg-accent-cyan ml-0.5 animate-pulse align-middle" />
        </motion.div>

        <motion.p variants={itemVariants} className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          {bio}
          <br className="hidden md:block" />
          <span className="text-text-muted">
            {stats.totalRepos} shipped projects across {stats.categories.length} domains.
          </span>
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#projects"
            className="px-8 py-3.5 rounded-xl bg-accent-cyan text-bg font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]"
          >
            View Work
          </Link>
          <Link
            href="#contact"
            className="px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm text-white font-bold text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/25 hover:scale-105 active:scale-95"
          >
            Get in Touch
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-white/15 bg-white/5 text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-300 hover:scale-105"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] text-text-muted uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="text-accent-cyan" size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
