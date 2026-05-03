"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import type { GitHubProfile } from "@/lib/github";

const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const StatCard = ({ label, value, index }: { label: string; value: string | number; index: number }) => {
  const isNumber = typeof value === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative p-6 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm group overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <h3 className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2 tabular-nums">
          {isNumber ? <Counter value={value as number} /> : value}
        </h3>
        <p className="text-sm font-mono text-text-secondary uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
};

interface AboutProps {
  profile: GitHubProfile | null;
  personal: {
    location: string;
    education: string;
  };
  stats: {
    totalRepos: number;
    totalStars: number;
    languages: string[];
    categories: string[];
    memberSince: string;
  };
}

const About = ({ profile, personal, stats }: AboutProps) => {
  const dynamicStats = [
    { label: "Projects Shipped", value: stats.totalRepos },
    { label: "Domains", value: stats.categories.length },
    { label: "Languages Used", value: stats.languages.length },
    { label: "Member Since", value: stats.memberSince },
  ];

  const followers = profile?.followers || 0;

  return (
    <section id="about" className="relative py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-label">// 02 ─ ABOUT</span>
          <div className="h-[1px] flex-1 max-w-20 bg-accent-cyan/20" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden border border-white/10 bg-bg-secondary/80 backdrop-blur-sm">
              <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-xs font-mono text-text-muted">MISSION_BRIEF.md</div>
                <div className="w-12" />
              </div>

              <div className="p-6 md:p-8 font-mono text-sm leading-relaxed text-text-secondary border-l-2 border-accent-cyan/30">
                <p className="mb-6">
                  <span className="text-accent-cyan font-bold"># </span>
                  I&apos;m a <span className="text-white font-bold">{personal.education}</span> student, 
                  based in <span className="text-accent-indigo font-semibold">{personal.location}</span>.
                  I&apos;ve shipped{" "}
                  <span className="text-accent-purple font-semibold">{stats.totalRepos} projects</span>{" "}
                  across {stats.categories.length} domains using{" "}
                  <span className="text-accent-cyan font-semibold">{stats.languages.length} languages</span>.
                </p>
                <p className="mb-6">
                  <span className="text-accent-cyan font-bold"># </span>
                  Half my brain runs{" "}
                  <span className="text-accent-indigo font-semibold">nmap</span>, the other half writes{" "}
                  <span className="text-accent-purple font-semibold">Laravel</span> migrations.
                  I don&apos;t believe security and product are different jobs — they&apos;re two sides of the same craft.
                </p>
                {followers > 0 && (
                  <p className="text-text-muted text-xs">
                    <span className="text-accent-cyan">→</span> {followers} followers on GitHub
                  </p>
                )}
                <div className="mt-6 flex items-center gap-1">
                  <span className="text-accent-cyan">❯</span>
                  <span className="animate-pulse text-accent-cyan">▋</span>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border border-accent-cyan/10 rounded-xl" />
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {dynamicStats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
