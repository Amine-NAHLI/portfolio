"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Terminal, Shield, Zap, Activity, Cpu, Download } from "lucide-react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const DecipherText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

const HUDMetric = ({ label, value, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 1, ease: EASE_OUT_EXPO }}
    className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md"
  >
    <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
      <Icon size={14} className="text-accent-cyan" />
    </div>
    <div className="flex flex-col">
      <span className="text-[8px] font-mono text-text-4 uppercase tracking-[0.2em]">{label}</span>
      <span className="text-[11px] font-mono text-text-1 font-black">{value}</span>
    </div>
  </motion.div>
);

export default function Hero({ profile, stats }: { profile: any; stats: any }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
      
      {/* ─── TACTICAL HUD BACKGROUND ─────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border-[0.5px] border-accent-cyan/10 rounded-full"
        >
          <div className="absolute top-0 left-1/2 w-px h-6 bg-accent-cyan/20" />
          <div className="absolute bottom-0 left-1/2 w-px h-6 bg-accent-cyan/20" />
          <div className="absolute left-0 top-1/2 w-6 h-px bg-accent-cyan/20" />
          <div className="absolute right-0 top-1/2 w-6 h-px bg-accent-cyan/20" />
        </motion.div>

        <div className="absolute inset-0 opacity-[0.03] grid-bg" style={{ backgroundSize: '80px 80px' }} />
        
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 hidden lg:flex">
           <HUDMetric label="System_Core" value="Groq_Cloud" icon={Cpu} delay={1} />
           <HUDMetric label="Net_Latency" value="14ms" icon={Zap} delay={1.1} />
           <HUDMetric label="Sec_Status" value="ENCRYPTED" icon={Shield} delay={1.2} />
        </div>
      </div>

      {/* ─── MAIN CONTENT ────────────────────────────── */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Profile Image Restoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-accent-cyan/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-2 border-accent-cyan/20 p-2 bg-bg-1/40 backdrop-blur-xl">
             <img 
               src="/nahli.png" 
               alt="Amine Nahli" 
               className="w-full h-full object-cover rounded-[1.8rem] grayscale hover:grayscale-0 transition-all duration-700"
             />
             <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center border-4 border-bg-0">
                <Shield size={12} className="text-bg-0" />
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent-cyan font-black">
            Authorized_Access: Level_8
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-8">
          <div className="text-text-1">
            <DecipherText text="AMINE" />
          </div>
          <div className="text-text-4/20 dark:text-white/5 stroke-text-1">
            <DecipherText text="NAHLI." />
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="max-w-xl mx-auto text-base md:text-lg text-text-3 font-medium leading-relaxed tracking-tight"
        >
          I architect secure systems and build high-fidelity digital intelligence. 
          <span className="text-text-1 block mt-4 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
            Security Engineer × Full-Stack Builder
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: EASE_OUT_EXPO }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <a href="#projects" className="group relative px-8 py-4 rounded-2xl bg-text-1 text-bg-0 font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all">
             <span className="relative z-10">Access_Vault</span>
             <div className="absolute inset-0 bg-accent-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </a>
          <a href="#contact" className="group px-8 py-4 rounded-2xl border border-white/10 text-text-1 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
             Initialize_Bridge
          </a>
          <a
            href="/cv.pdf"
            download
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan font-black uppercase tracking-widest text-[10px] hover:bg-accent-cyan/10 hover:border-accent-cyan/60 transition-all duration-300"
          >
            <Download size={14} />
            Download_CV
          </a>
        </motion.div>
      </motion.div>

      {/* ─── SCROLL INDICATOR ────────────────────────── */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">Scroll_To_Analyze</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent-cyan to-transparent" />
      </motion.div>

    </section>
  );
}
