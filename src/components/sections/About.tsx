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
    <section id="about" className="relative py-40 bg-bg-0">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24"
        >
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">System.initialize()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              The <span className="text-text-4">Architect.</span>
            </h2>
          </div>
          <p className="max-w-md text-text-3 text-lg leading-relaxed mb-2">
            I build defensive systems and high-performance applications with a focus on structural integrity and user experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[260px]">
          {/* Mission Card */}
          <BentoCard className="md:col-span-8 md:row-span-2">
            <div className="space-y-8">
              <ShieldCheck className="text-cyan" size={32} />
              <h3 className="text-4xl font-bold tracking-tight max-w-lg leading-tight">
                Engineering software that is as <span className="text-cyan">secure</span> as it is <span className="text-indigo">intuitive</span>.
              </h3>
              <p className="text-text-3 text-lg leading-relaxed max-w-xl">
                I approach every project with a defensive mindset, ensuring that performance 
                and safety are never mutually exclusive. I specialize in bridging 
                the gap between complex backend infrastructure and seamless frontend interactions.
              </p>
            </div>
            <div className="flex gap-4 pt-8 border-t border-white/5 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[10px] font-mono uppercase tracking-widest text-text-4">
                <MapPin size={12} className="text-cyan" /> {personal.location}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[10px] font-mono uppercase tracking-widest text-text-4">
                <GraduationCap size={12} className="text-indigo" /> {personal.education}
              </div>
            </div>
          </BentoCard>

          {/* Efficiency Card */}
          <BentoCard className="md:col-span-4" delay={0.1}>
            <div className="flex justify-between items-start">
              <Zap className="text-warning" size={24} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-4">Performance</span>
            </div>
            <div>
              <p className="text-6xl font-black text-text-1 mb-1 tracking-tighter">
                <CountUp value={stats.totalRepos} />
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-3">Active Repositories</p>
            </div>
          </BentoCard>

          {/* Reach Card */}
          <BentoCard className="md:col-span-4" delay={0.2}>
            <div className="flex justify-between items-start">
              <Globe className="text-indigo" size={24} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-4">Community</span>
            </div>
            <div>
              <p className="text-6xl font-black text-text-1 mb-1 tracking-tighter">
                <CountUp value={stats.totalStars} />
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-3">Total Stars</p>
            </div>
          </BentoCard>

          {/* Latest Work Bar */}
          <BentoCard className="md:col-span-12 md:row-span-1 flex-row items-center gap-12" delay={0.3}>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success ping-slow" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-4">Latest Transmission</span>
              </div>
              <h4 className="text-3xl font-bold group-hover:text-cyan transition-colors">
                {latestProject?.title || "Project in progress..."}
              </h4>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10" />
            <div className="flex-1 hidden md:block">
              <p className="text-text-3 line-clamp-2 max-w-sm italic text-sm">
                {latestProject?.description || "Building something significant."}
              </p>
            </div>
            <div className="p-5 rounded-full bg-white/5 group-hover:bg-text-1 group-hover:text-bg-0 transition-all duration-300">
              <ArrowUpRight size={24} />
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
