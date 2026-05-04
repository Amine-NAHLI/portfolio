"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { GitCommit, Clock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { GitHubProfile, Project } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;
const VP   = { once: true, margin: "-100px" } as const;

/* ── Counter ─────────────────────────────────────────────────────── */

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => ctrl.stop();
  }, [inView, value]);

  return <span ref={ref} className="tabular-nums">{count}</span>;
};

/* ── Stat card ───────────────────────────────────────────────────── */

interface StatCardProps { label: string; value: number | string; index: number; accent: string }

const StatCard = ({ label, value, index, accent }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={VP}
    transition={{ delay: index * 0.08, duration: 0.5, ease: EASE }}
    whileHover={{ y: -4, transition: { duration: 0.2, ease: EASE } }}
    className="relative p-6 rounded-[14px] bg-bg-card/60 border border-white/8 overflow-hidden group"
  >
    <div
      className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
    />
    <p
      className="text-[44px] md:text-[54px] font-bold leading-none mb-2"
      style={{ color: accent }}
    >
      {typeof value === "number" ? <Counter value={value} /> : value}
    </p>
    <p className="section-label" style={{ opacity: 0.7 }}>{label}</p>
  </motion.div>
);

/* ── Now Playing widget ──────────────────────────────────────────── */

const NowPlaying = ({ project }: { project: Project }) => {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 30) return `${d}d ago`;
    const m = Math.floor(d / 30);
    return `${m}mo ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
      className="mt-10 flex items-center gap-4 p-4 rounded-[10px] bg-bg-card/50 border border-white/6"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
        <GitCommit size={14} className="text-accent-cyan" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-mono text-text-faint uppercase tracking-widest mb-0.5">Now working on</p>
        <p className="text-sm font-medium text-text-primary truncate">{project.title}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 text-[11px] font-mono text-text-faint ml-auto">
        <Clock size={11} aria-hidden="true" />
        {timeAgo(project.updatedAt)}
      </div>
    </motion.div>
  );
};

/* ── About ───────────────────────────────────────────────────────── */

interface AboutProps {
  profile: GitHubProfile | null;
  personal: { location: string; education: string };
  stats: {
    totalRepos: number;
    totalStars: number;
    languages: string[];
    categories: string[];
    memberSince: string;
  };
  latestProject: Project | null;
}

export default function About({ profile, personal, stats, latestProject }: AboutProps) {
  const cards: StatCardProps[] = [
    { label: "Projects Shipped", value: stats.totalRepos,       index: 0, accent: "#06b6d4" },
    { label: "GitHub Stars",     value: stats.totalStars,       index: 1, accent: "#6366f1" },
    { label: "Languages Used",   value: stats.languages.length, index: 2, accent: "#a855f7" },
    { label: "Member Since",     value: stats.memberSince,      index: 3, accent: "#f59e0b" },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          number="01"
          label="About"
          heading={<>Who I <span className="gradient-text">am.</span></>}
          subheading="Security engineer by training, full-stack builder by obsession."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-14 items-start">
          {/* Left — editor card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative"
          >
            <div className="rounded-[14px] overflow-hidden border border-white/8 bg-bg-raised/80">
              {/* Title bar */}
              <div className="bg-white/4 px-4 py-3 flex items-center gap-3 border-b border-white/6">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] font-mono text-text-faint">mission_brief.md</span>
                </div>
              </div>

              {/* Body with syntax highlighting style */}
              <div className="p-6 md:p-8 font-mono text-[13px] leading-loose text-text-secondary border-l-2 border-accent-cyan/20">
                <p className="mb-5">
                  <span className="text-text-faint select-none">1  </span>
                  <span className="text-accent-cyan">## </span>
                  <span className="text-text-primary font-medium">{personal.education}</span>
                  <span className="text-text-secondary"> student, </span>
                  <span className="text-accent-indigo font-medium">{personal.location}</span>
                  <span className="text-text-secondary">.</span>
                </p>
                <p className="mb-5">
                  <span className="text-text-faint select-none">2  </span>
                  <span className="text-accent-cyan">## </span>
                  <span className="text-text-secondary">Shipped </span>
                  <span className="text-accent-purple font-medium">{stats.totalRepos}</span>
                  <span className="text-text-secondary"> projects across </span>
                  <span className="text-accent-cyan font-medium">{stats.categories.length}</span>
                  <span className="text-text-secondary"> domains.</span>
                </p>
                <p className="mb-5">
                  <span className="text-text-faint select-none">3  </span>
                  <span className="text-accent-cyan">## </span>
                  <span className="text-text-secondary">Half my brain runs </span>
                  <span className="text-accent-indigo font-medium">nmap</span>
                  <span className="text-text-secondary">, the other writes </span>
                  <span className="text-accent-purple font-medium">Laravel</span>
                  <span className="text-text-secondary"> migrations.</span>
                </p>
                {(profile?.followers ?? 0) > 0 && (
                  <p className="text-text-faint text-[12px] mt-4">
                    <span className="text-text-faint select-none">4  </span>
                    <span className="text-accent-cyan">→ </span>
                    {profile!.followers} followers on GitHub
                  </p>
                )}
                <div className="mt-6 flex items-center gap-1">
                  <span className="text-accent-cyan" aria-hidden="true">❯</span>
                  <span className="cursor-blink inline-block w-2 h-[1em] bg-accent-cyan/50 ml-1" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Shadow border */}
            <div className="absolute -z-10 -bottom-2.5 -right-2.5 w-full h-full border border-accent-cyan/8 rounded-[14px]" aria-hidden="true" />

            {/* Now Playing */}
            {latestProject && <NowPlaying project={latestProject} />}
          </motion.div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {cards.map((c) => <StatCard key={c.label} {...c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
