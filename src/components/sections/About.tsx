"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Shield, Brain, Fingerprint, Activity, Database, GraduationCap, Code2, Globe, Music, BookOpen, Coffee } from "lucide-react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const CapabilityGauge = ({ label, count, level, delay }: { label: string; count: number; level: number; delay: number }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4 group"
    >
      <div className="relative w-24 h-24">
        {/* Background Ring */}
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={radius} className="stroke-white/5 fill-none" strokeWidth="4" />
          <motion.circle 
            cx="48" cy="48" r={radius} 
            className="stroke-accent-cyan fill-none" 
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center Data */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-[14px] font-black text-text-1 group-hover:text-accent-cyan transition-colors">{level}%</span>
           <span className="text-[7px] font-mono text-text-4 uppercase">Cap_Load</span>
        </div>

        {/* Decorative HUD bits */}
        <div className="absolute -inset-2 border border-white/5 rounded-full rotate-45 group-hover:rotate-180 transition-transform duration-1000" />
      </div>

      <div className="text-center space-y-1">
         <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-cyan font-black">{label}</div>
         <div className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/5 text-[8px] font-mono text-text-4 uppercase tracking-widest">
            {count} Projects_Found
         </div>
      </div>
    </motion.div>
  );
};

export default function About({ 
  stats, 
  profile, 
  personal, 
  latestProject 
}: { 
  stats?: any; 
  profile?: any; 
  personal?: any; 
  latestProject?: any; 
}) {
  const [terminalLine, setTerminalLine] = useState(0);
  const logs = [
    "> INITIALIZING_PROFILE_SCAN...",
    "> ACCESSING_COGNITIVE_BIOMETRICS...",
    "> STATUS: OPERATIONAL",
    "> PASSION: BREAKING_TO_BUILD",
    "> MISSION: SECURING_THE_FUTURE",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalLine(prev => (prev < logs.length ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* ─── LEFT: BIOMETRIC VISUALS ────────────────── */}
          <div className="relative">
             <div className="absolute inset-0 bg-accent-cyan/5 blur-[100px] rounded-full" />
             <div className="relative z-10 bg-bg-1/40 border border-white/5 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-3">
                      <Fingerprint className="text-accent-cyan" size={24} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">Subject: AN_882</span>
                   </div>
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-green-500/60 uppercase">Authenticated</span>
                   </div>
                </div>

                {/* Tactical Gauge Matrix */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                   <CapabilityGauge label="Security" count={stats?.counts?.security || 0} level={94} delay={0.1} />
                   <CapabilityGauge label="Web_Dev" count={stats?.counts?.web || 0} level={88} delay={0.2} />
                   <CapabilityGauge label="AI_Neural" count={stats?.counts?.ai || 0} level={82} delay={0.3} />
                   <CapabilityGauge label="Mobile" count={stats?.counts?.mobile || 0} level={64} delay={0.4} />
                </div>

                <div className="mt-12 space-y-4">
                   <div className="flex justify-between items-center px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-mono text-text-4 uppercase">Cognitive_Load</span>
                      <div className="flex gap-1">
                         {[1,2,3,4,5,6,7,8].map(i => (
                           <div key={i} className={`w-1.5 h-3 rounded-sm ${i < 7 ? 'bg-accent-cyan' : 'bg-white/10'}`} />
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* ─── RIGHT: TERMINAL & BIO ──────────────────── */}
          <div className="space-y-10">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-indigo/10 border border-accent-indigo/20">
                   <Activity size={14} className="text-accent-indigo" />
                   <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-indigo font-black">Biometric_Profile</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                  Breaking <br /> <span className="text-text-4/20 dark:text-white/5 stroke-text-1">to Build.</span>
                </h2>
             </div>

             <div className="bg-[#0B0F19] rounded-3xl p-8 border border-white/10 font-mono text-sm shadow-2xl">
                <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
                   <div className="w-3 h-3 rounded-full bg-red-500/20" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                   <div className="w-3 h-3 rounded-full bg-green-500/20" />
                   <span className="ml-4 text-[10px] text-white/20 uppercase tracking-widest">root@nahli-amine:~/identity</span>
                </div>
                <div className="space-y-2 text-accent-cyan/80">
                   {logs.slice(0, terminalLine).map((log, i) => (
                     <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                     >
                        {log}
                     </motion.p>
                   ))}
                   {terminalLine >= logs.length && (
                     <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-text-2 mt-4 leading-relaxed"
                     >
                        I am a Security Engineer and Full-Stack Developer who views every system as a puzzle. My approach is simple: understand the vulnerability, master the architecture, and rebuild it with absolute integrity. Based in Fès, I bridge the gap between aggressive security research and high-performance product engineering.
                     </motion.p>
                   )}
                   <motion.div
                     animate={{ opacity: [1, 0] }}
                     transition={{ repeat: Infinity, duration: 0.8 }}
                     className="w-2 h-5 bg-accent-cyan inline-block align-middle ml-1"
                   />
                </div>
             </div>

             {/* ─── BEYOND CODE ────────────────────────── */}
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-4 h-px bg-accent-cyan/40" />
                 <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">Beyond_Code</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {[
                   { icon: Music, label: "Music" },
                   { icon: BookOpen, label: "Research" },
                   { icon: Globe, label: "CTF_Comps" },
                   { icon: Coffee, label: "Late_Night_Builds" },
                 ].map(({ icon: Icon, label }) => (
                   <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-cyan/20 transition-colors">
                     <Icon size={10} className="text-accent-cyan" />
                     <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">{label}</span>
                   </div>
                 ))}
               </div>
               <p className="text-[10px] font-mono text-text-4 italic border-l-2 border-accent-cyan/30 pl-4 leading-relaxed">
                 "The best security engineers are the ones who never stopped being curious about how things break."
               </p>
             </div>
          </div>

        </div>

        {/* ─── TRUST SIGNALS ──────────────────────────── */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-5 px-8 py-6 rounded-[2rem] bg-bg-1/40 border border-white/5 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={20} className="text-accent-cyan" />
            </div>
            <div>
              <div className="font-black text-text-1 text-sm tracking-tight">Université Privée de Fès</div>
              <div className="font-mono text-[9px] text-text-4 uppercase tracking-widest mt-1">3rd Year · Software Engineering</div>
            </div>
          </div>

          <a
            href="https://github.com/Amine-NAHLI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 px-8 py-6 rounded-[2rem] bg-bg-1/40 border border-white/5 backdrop-blur-xl hover:border-accent-cyan/20 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-accent-cyan/30 transition-colors">
              <Code2 size={20} className="text-text-2 group-hover:text-accent-cyan transition-colors" />
            </div>
            <div>
              <div className="font-black text-text-1 text-sm tracking-tight">Open Source</div>
              <div className="font-mono text-[9px] text-text-4 uppercase tracking-widest mt-1">github.com/Amine-NAHLI</div>
            </div>
          </a>

          <div className="flex items-center gap-5 px-8 py-6 rounded-[2rem] bg-bg-1/40 border border-white/5 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-accent-indigo" />
            </div>
            <div>
              <div className="font-black text-text-1 text-sm tracking-tight">Security Researcher</div>
              <div className="font-mono text-[9px] text-text-4 uppercase tracking-widest mt-1">CTF · Pentesting · Web_Sec</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
