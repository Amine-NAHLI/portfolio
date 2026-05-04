"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { GithubIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

const roles = [
  "a security engineer.",
  "a full-stack builder.",
  "a curious mind.",
  "a problem solver.",
];

interface HeroProps {
  profile: GitHubProfile | null;
  stats: {
    totalRepos: number;
    totalStars: number;
    languages: string[];
    categories: string[];
  };
  personal: {
    status: string;
  };
}

const STAGGER = 0.08;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const Hero = ({ profile, stats, personal }: HeroProps) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 100));
    return unsub;
  }, [scrollY]);

  const handleTyping = useCallback(() => {
    const current = roles[roleIndex];
    if (isDeleting) {
      setDisplayText((prev) => current.substring(0, prev.length - 1));
    } else {
      setDisplayText((prev) => current.substring(0, prev.length + 1));
    }
  }, [isDeleting, roleIndex]);

  useEffect(() => {
    const current = roles[roleIndex];
    let t: NodeJS.Timeout;
    if (!isDeleting && displayText === current) {
      t = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      t = setTimeout(handleTyping, isDeleting ? 35 : 75);
    }
    return () => clearTimeout(t);
  }, [displayText, isDeleting, roleIndex, handleTyping]);

  const displayName = profile?.name || "Amine Nahli";
  const githubUrl = profile?.html_url || "https://github.com/Amine-NAHLI";

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-bg"
    >
      {/* Mesh gradient */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      {/* Grain + grid overlays */}
      <div className="grain-overlay" aria-hidden="true" />
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,transparent_40%,rgba(3,7,18,0.85)_100%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center pt-24"
      >
        {/* Status pill */}
        <motion.div variants={item} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill mb-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          </span>
          <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-accent-cyan/80 uppercase">
            {personal.status}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.03em] leading-[1.05] mb-4">
          <span className="text-text-secondary">Hi, I&apos;m</span>
          <br />
          <span className="gradient-text">{displayName}.</span>
        </motion.h1>

        {/* Typing line */}
        <motion.div
          variants={item}
          aria-label={`I'm ${roles[roleIndex]}`}
          className="h-9 flex items-center justify-center mb-6"
        >
          <span className="font-mono text-lg md:text-xl text-text-muted select-none">
            {">"}{" "}
          </span>
          <span className="font-mono text-lg md:text-xl text-accent-cyan ml-1" aria-live="off">
            {displayText}
          </span>
          <span className="cursor-blink inline-block w-[2px] h-[1.1em] bg-accent-cyan ml-0.5 translate-y-[1px]" aria-hidden="true" />
        </motion.div>

        {/* Tagline */}
        <motion.p variants={item} className="text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
          I break things to understand them — then I build better ones.
        </motion.p>

        {/* Stats row */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-1 flex-wrap text-[13px] font-mono text-text-muted mb-10"
        >
          <span>{stats.totalRepos} repos</span>
          <span className="opacity-30 px-2">·</span>
          <span>{stats.totalStars} stars</span>
          <span className="opacity-30 px-2">·</span>
          <span>{stats.languages.length} languages</span>
          <span className="opacity-30 px-2">·</span>
          <span>{stats.categories.length} domains</span>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="#projects"
            className="px-7 py-3 rounded-xl bg-accent-cyan text-bg font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(6,182,212,0.45)] active:translate-y-0 duration-[250ms]"
          >
            View Work
          </Link>
          <Link
            href="#contact"
            className="px-7 py-3 rounded-xl border border-accent-indigo/40 bg-accent-indigo/5 text-text-primary font-semibold text-sm transition-all hover:bg-accent-indigo/10 hover:border-accent-indigo/60 hover:-translate-y-0.5 active:translate-y-0 duration-[250ms]"
          >
            Get in Touch
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-text-muted hover:text-text-primary font-medium text-sm transition-colors duration-[250ms] hover:underline underline-offset-4"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] text-text-faint uppercase mb-1">Scroll</span>
        <div className="relative w-[1px] h-12 bg-white/5 overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-accent-cyan to-transparent rounded-full"
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            style={{ height: "50%" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
