"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { GitCommit, MapPin, GraduationCap, ArrowUpRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { useTilt } from "@/hooks/useTilt";
import type { GitHubProfile, Project } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Refined Stat Card ─────────────────────────────────────────── */

const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay, ease: EASE }}
    className={`glass-card rounded-[2rem] p-8 flex flex-col justify-between group ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── About Section ────────────────────────────────────────────── */

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
  const containerRef = useRef<HTMLElement>(null);
  
  return (
    <section ref={containerRef} id="about" className="relative py-40 bg-bg-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">System.initialize()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              The <span className="text-text-4">Architect.</span>
            </h2>
          </div>
          <p className="max-w-md text-text-3 text-lg leading-relaxed mb-2">
            I build defensive systems and high-performance applications with a focus on structural integrity and user experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          
          {/* Large Mission Card */}
          <BentoCard className="md:col-span-8 md:row-span-2">
            <div className="space-y-6">
              <ShieldCheck className="text-cyan" size={32} />
              <h3 className="text-4xl font-bold tracking-tight max-w-lg leading-tight">
                My mission is to engineer software that is as <span className="text-cyan">secure</span> as it is <span className="text-indigo">intuitive</span>.
              </h3>
              <p className="text-text-3 text-lg leading-relaxed max-w-xl">
                With a background in security engineering, I approach every project with a defensive mindset, 
                ensuring that performance and safety are never mutually exclusive. I specialize in bridging 
                the gap between complex backend infrastructure and seamless frontend interactions.
              </p>
            </div>
            <div className="flex gap-4 mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs font-mono uppercase tracking-widest">
                <MapPin size={14} className="text-cyan" /> {personal.location}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs font-mono uppercase tracking-widest">
                <GraduationCap size={14} className="text-indigo" /> {personal.education}
              </div>
            </div>
          </BentoCard>

          {/* Stats Cards */}
          <BentoCard className="md:col-span-4" delay={0.1}>
            <div className="flex justify-between items-start">
              <Zap className="text-warning" size={24} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-4">Efficiency</span>
            </div>
            <div>
              <p className="text-5xl font-black text-text-1 mb-1">{stats.totalRepos}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-3">Active Repositories</p>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-4" delay={0.2}>
            <div className="flex justify-between items-start">
              <Globe className="text-indigo" size={24} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-4">Reach</span>
            </div>
            <div>
              <p className="text-5xl font-black text-text-1 mb-1">{stats.totalStars}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-3">Global Stars</p>
            </div>
          </BentoCard>

          {/* Latest Work Card */}
          <BentoCard className="md:col-span-12 md:row-span-1 flex-row items-center gap-12" delay={0.3}>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-4">Currently Shipping</span>
              </div>
              <h4 className="text-3xl font-bold group-hover:text-cyan transition-colors">
                {latestProject?.title || "Developing next iteration..."}
              </h4>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10" />
            <div className="flex-1 hidden md:block">
              <p className="text-text-3 line-clamp-2 max-w-sm italic">
                {latestProject?.description || "Building something significant."}
              </p>
            </div>
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-cyan group-hover:text-bg-0 transition-all">
              <ArrowUpRight size={24} />
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
