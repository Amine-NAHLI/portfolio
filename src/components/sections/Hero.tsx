"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { useTypingCycle } from "@/hooks/useTypingCycle";
import { GithubIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

const HeroVisual = dynamic(() => import("@/components/three/HeroVisual"), { ssr: false });

const ROLES = [
  "Security Engineer.",
  "Full-Stack Builder.",
  "Curious Mind.",
  "Problem Solver.",
];

export default function Hero({ profile }: { profile: GitHubProfile | null }) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { displayText } = useTypingCycle(ROLES);
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => setMounted(true), []);

  const displayName = profile?.name ?? "Amine Nahli";
  const githubUrl = profile?.html_url ?? "https://github.com/Amine-NAHLI";

  if (!mounted) return <section id="home" className="min-h-svh bg-bg-0" />;

  return (
    <section id="home" className="relative min-h-svh w-full flex items-center justify-center overflow-hidden py-20">
      {/* Subtle Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[30vw] font-black leading-none uppercase">Creative</h2>
      </div>

      {/* 3D Visual (Subtle) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <HeroVisual />
          </Suspense>
        </Canvas>
      </div>

      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center text-center"
      >
        {/* Availability Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-white/10 mb-12 shadow-xl"
        >
          <div className="relative flex h-2 w-2">
            <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-success"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-1">
            Open for high-impact projects
          </span>
        </motion.div>

        {/* Main Header */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="font-mono text-cyan text-sm md:text-base uppercase tracking-[0.5em] mb-4">
              Designing the future of security
            </span>
            <h1 className="text-7xl md:text-[9vw] font-black tracking-tighter leading-[0.85] uppercase mb-8">
              {displayName.split(" ").map((word, i) => (
                <span key={i} className={i === 1 ? "gradient-text" : "text-text-1"}>
                  {word}{i === 0 ? <br className="hidden md:block" /> : ""}
                  {i === 0 ? " " : ""}
                </span>
              ))}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="font-mono text-xl md:text-3xl text-text-3 flex items-center justify-center gap-4"
          >
            <span>{displayText}</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-3 h-[1em] bg-cyan"
            />
          </motion.div>
        </div>

        {/* Action Group */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <Link
              href="#projects"
              className="group flex items-center gap-3 px-10 py-5 rounded-full bg-text-1 text-bg-0 font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-cyan/20"
            >
              Examine Work
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="flex items-center gap-6"
          >
            <Link
              href="#contact"
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors"
            >
              Contact
            </Link>
            <div className="h-px w-8 bg-white/10" />
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-4 hover:text-cyan transition-colors"
            >
              <GithubIcon size={20} />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-8">
        <div className="flex flex-col gap-2">
           <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Current Location</span>
           <span className="font-mono text-[10px] uppercase tracking-widest text-text-2">Fès, Morocco (GMT+1)</span>
        </div>
        <div className="flex flex-col gap-2">
           <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Expertise</span>
           <span className="font-mono text-[10px] uppercase tracking-widest text-text-2">SecOps × Full-Stack</span>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

const ScrollIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2, duration: 1 }}
    className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-4"
  >
    <div className="h-24 w-px bg-white/10 relative overflow-hidden">
      <motion.div 
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan to-transparent"
      />
    </div>
    <span className="font-mono text-[9px] uppercase tracking-[0.5em] vertical-text text-text-4">Scroll Down</span>
  </motion.div>
);
