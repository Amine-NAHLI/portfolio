"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { GithubIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

const ROLES = [
  "a security engineer.",
  "a full-stack builder.",
  "a curious mind.",
  "a problem solver.",
];

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden:   { opacity: 0, y: 14 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_EXPO } },
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

const STATS_DIVIDER = (
  <span className="w-px h-3 bg-white/15 mx-3 inline-block align-middle" aria-hidden="true" />
);

export default function Hero({ profile, stats, personal }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const tick = useCallback(() => {
    const current = ROLES[roleIndex];
    setDisplayText((prev) =>
      isDeleting
        ? current.slice(0, prev.length - 1)
        : current.slice(0, prev.length + 1)
    );
  }, [isDeleting, roleIndex]);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let t: NodeJS.Timeout;
    if (!isDeleting && displayText === current) {
      t = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((p) => (p + 1) % ROLES.length);
    } else {
      t = setTimeout(tick, isDeleting ? 35 : 75);
    }
    return () => clearTimeout(t);
  }, [displayText, isDeleting, roleIndex, tick]);

  const displayName = profile?.name ?? "Amine Nahli";
  const githubUrl   = profile?.html_url ?? "https://github.com/Amine-NAHLI";

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-bg"
    >
      {/* ── Mesh gradient ───────────────────────────────────────── */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      {/* ── Overlays ────────────────────────────────────────────── */}
      <div className="grain-overlay"   aria-hidden="true" />
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 55%, transparent 30%, rgba(3,7,18,0.92) 100%)" }}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none" aria-hidden="true" />

      {/* ── Content ─────────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center pt-28"
      >
        {/* Status pill */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-accent-cyan ping-slow opacity-70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          </span>
          <span className="section-label" style={{ letterSpacing: "0.18em" }}>
            {personal.status}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={item}
          className="mb-5 font-semibold tracking-[-0.03em] leading-[1.05]"
          style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)" }}
        >
          <span className="text-text-secondary">Hi, I&apos;m</span>
          <br />
          <span className="gradient-text">{displayName}.</span>
        </motion.h1>

        {/* Typing line */}
        <motion.div
          variants={item}
          aria-label={`I'm ${ROLES[roleIndex]}`}
          className="h-8 md:h-9 flex items-center justify-center mb-5"
        >
          <span className="font-mono text-base md:text-lg text-text-muted select-none">{">"}&nbsp;</span>
          <span className="font-mono text-base md:text-lg text-accent-cyan" aria-live="off">{displayText}</span>
          <span className="cursor-blink inline-block w-[2px] h-[1em] bg-accent-cyan ml-0.5" aria-hidden="true" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-base md:text-lg text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed"
        >
          I break things to understand them — then I build better ones.
        </motion.p>

        {/* GitHub stats row */}
        <motion.div
          variants={item}
          className="inline-flex items-center text-[12px] font-mono text-text-muted mb-10"
        >
          <span><span className="text-text-secondary font-medium">{stats.totalRepos}</span> repos</span>
          {STATS_DIVIDER}
          <span><span className="text-text-secondary font-medium">{stats.totalStars}</span> stars</span>
          {STATS_DIVIDER}
          <span><span className="text-text-secondary font-medium">{stats.languages.length}</span> languages</span>
          {STATS_DIVIDER}
          <span><span className="text-text-secondary font-medium">{stats.categories.length}</span> domains</span>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="#projects"
            className="px-7 py-3 rounded-[10px] bg-accent-cyan text-bg font-semibold text-sm
              shadow-[0_0_0_0_rgba(6,182,212,0.4)]
              hover:shadow-[0_0_28px_8px_rgba(6,182,212,0.25)]
              hover:-translate-y-[2px] active:translate-y-0
              transition-all duration-[250ms]"
          >
            View Work
          </Link>
          <Link
            href="#contact"
            className="px-7 py-3 rounded-[10px] border border-accent-indigo/35 bg-accent-indigo/6
              text-text-primary font-semibold text-sm
              hover:bg-accent-indigo/12 hover:border-accent-indigo/55 hover:-translate-y-[2px]
              active:translate-y-0 transition-all duration-[250ms]"
          >
            Get in Touch
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex items-center gap-1.5 px-4 py-3 rounded-[10px] text-text-muted
              hover:text-text-primary font-medium text-sm
              transition-colors duration-[250ms]"
          >
            <GithubIcon size={15} />
            GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator (Stripe style) ─────────────────────── */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="section-label" style={{ opacity: 0.4 }}>scroll</span>
        {/* Vertical line with travelling dot */}
        <div className="relative w-px h-14 bg-white/8 overflow-hidden">
          <motion.div
            className="absolute inset-x-0 h-5 rounded-full"
            style={{ background: "linear-gradient(to bottom, transparent, #06b6d4, transparent)" }}
            animate={{ y: ["-100%", "280%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
