"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { ShieldCheck, Zap, Globe, MapPin, GraduationCap, ArrowUpRight } from "lucide-react";
import type { GitHubProfile, Project } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Count Up Component ─────────────────────────────────────────── */

const CountUp = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: EASE,
        onUpdate: (v) => setDisplayValue(Math.floor(v)),
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return <span ref={ref} className="tabular-nums">{displayValue}</span>;
};

/* ─── Bento Card ─────────────────────────────────────────────────── */

const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: EASE }}
    className={`glass-card rounded-[2.5rem] p-8 flex flex-col justify-between group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── About Section ────────────────────────────────────────────── */

export default function About({ profile, personal, stats, latestProject }: any) {
  return (
    <section id="about" className="relative py-24 bg-bg-0">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="space-y-3">
            <span className="font-mono text-accent-cyan text-[10px] uppercase tracking-[0.4em]">System.initialize()</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              The <span className="text-text-4">Architect.</span>
            </h2>
          </div>
          <p className="max-w-sm text-text-3 text-base leading-relaxed mb-1">
            I build defensive systems and high-performance applications with a focus on structural integrity and user experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[220px]">
          {/* Mission Card */}
          <BentoCard className="md:col-span-8 md:row-span-2 p-10">
            <div className="space-y-6">
              <ShieldCheck className="text-accent-cyan" size={28} />
              <h3 className="text-3xl font-bold tracking-tight max-w-lg leading-tight">
                Engineering software that is as <span className="text-accent-cyan">secure</span> as it is <span className="text-accent-indigo">intuitive</span>.
              </h3>
              <p className="text-text-3 text-base leading-relaxed max-w-xl">
                I approach every project with a defensive mindset, ensuring that performance 
                and safety are never mutually exclusive.
              </p>
            </div>
            <div className="flex gap-3 pt-6 border-t border-text-1/[0.05] mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-text-1/[0.03] text-[9px] font-mono uppercase tracking-widest text-text-4">
                <MapPin size={10} className="text-accent-cyan" /> {personal.location}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-text-1/[0.03] text-[9px] font-mono uppercase tracking-widest text-text-4">
                <GraduationCap size={10} className="text-accent-indigo" /> {personal.education}
              </div>
            </div>
          </BentoCard>

          {/* Efficiency Card */}
          <BentoCard className="md:col-span-4" delay={0.1}>
            <div className="flex justify-between items-start">
              <Zap className="text-warning" size={20} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Performance</span>
            </div>
            <div>
              <p className="text-5xl font-black text-text-1 mb-1 tracking-tighter">
                <CountUp value={stats.totalRepos} />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-3">Active Repositories</p>
            </div>
          </BentoCard>

          {/* Reach Card */}
          <BentoCard className="md:col-span-4" delay={0.2}>
            <div className="flex justify-between items-start">
              <Globe className="text-accent-indigo" size={20} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Community</span>
            </div>
            <div>
              <p className="text-5xl font-black text-text-1 mb-1 tracking-tighter">
                <CountUp value={stats.totalStars} />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-3">Total Stars</p>
            </div>
          </BentoCard>

          {/* Latest Work Bar */}
          <BentoCard className="md:col-span-12 md:row-span-1 flex-row items-center gap-8 py-8" delay={0.3}>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success ping-slow" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Latest Transmission</span>
              </div>
              <h4 className="text-2xl font-bold group-hover:text-accent-cyan transition-colors">
                {latestProject?.title || "Project in progress..."}
              </h4>
            </div>
            <div className="hidden md:block h-10 w-px bg-text-1/[0.05]" />
            <div className="flex-1 hidden md:block">
              <p className="text-text-3 line-clamp-2 max-w-sm italic text-xs">
                {latestProject?.description || "Building something significant."}
              </p>
            </div>
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-text-1 group-hover:text-bg-0 transition-all duration-300">
              <ArrowUpRight size={20} />
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
