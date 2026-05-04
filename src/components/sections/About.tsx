"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { GitHubProfile } from "@/lib/github";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
};

interface StatCardProps {
  label: string;
  value: number | string;
  index: number;
  accent: string;
}

const StatCard = ({ label, value, index, accent }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -4 }}
    className="relative p-6 rounded-2xl bg-bg-secondary/60 border border-white/8 backdrop-blur-sm overflow-hidden group"
  >
    <div
      className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
    />
    <p className="text-[42px] md:text-[52px] font-bold leading-none mb-2" style={{ color: accent }}>
      {typeof value === "number" ? <Counter value={value} /> : value}
    </p>
    <p className="text-xs font-mono text-text-muted uppercase tracking-[0.15em]">{label}</p>
  </motion.div>
);

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
}

const About = ({ profile, personal, stats }: AboutProps) => {
  const dynamicStats: StatCardProps[] = [
    { label: "Projects Shipped",  value: stats.totalRepos,        index: 0, accent: "#06b6d4" },
    { label: "Stars Earned",      value: stats.totalStars,        index: 1, accent: "#6366f1" },
    { label: "Languages Used",    value: stats.languages.length,  index: 2, accent: "#a855f7" },
    { label: "Member Since",      value: stats.memberSince,       index: 3, accent: "#f59e0b" },
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

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-start">
          {/* Terminal card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-white/8 bg-bg-secondary/70 backdrop-blur-sm">
              {/* Title bar */}
              <div className="bg-white/4 px-4 py-3 flex items-center justify-between border-b border-white/6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden="true" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-mono text-text-faint">mission_brief.md</span>
                <div className="w-14" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 font-mono text-sm leading-relaxed text-text-secondary border-l-2 border-accent-cyan/25">
                <p className="mb-5">
                  <span className="text-accent-cyan">## </span>
                  <span className="text-white font-medium">{personal.education}</span> student based in{" "}
                  <span className="text-accent-indigo font-medium">{personal.location}</span>.
                </p>
                <p className="mb-5">
                  <span className="text-accent-cyan">## </span>
                  Shipped{" "}
                  <span className="text-accent-purple font-medium">{stats.totalRepos} projects</span>{" "}
                  across <span className="text-accent-cyan font-medium">{stats.categories.length} domains</span>{" "}
                  using <span className="text-accent-indigo font-medium">{stats.languages.length} languages</span>.
                </p>
                <p className="mb-5">
                  <span className="text-accent-cyan">## </span>
                  Half my brain runs{" "}
                  <span className="text-accent-indigo font-medium">nmap</span>, the other half writes{" "}
                  <span className="text-accent-purple font-medium">Laravel</span> migrations.
                  Security and product aren&apos;t different jobs — they&apos;re two sides of the same craft.
                </p>
                {(profile?.followers ?? 0) > 0 && (
                  <p className="text-text-muted text-xs mt-6">
                    <span className="text-accent-cyan">→ </span>
                    {profile!.followers} followers on GitHub
                  </p>
                )}
                <div className="mt-6 flex items-center gap-1">
                  <span className="text-accent-cyan" aria-hidden="true">❯</span>
                  <span className="cursor-blink inline-block w-2 h-[1em] bg-accent-cyan/60 ml-1" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full border border-accent-cyan/8 rounded-2xl" aria-hidden="true" />
          </motion.div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-4">
            {dynamicStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
