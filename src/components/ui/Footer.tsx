"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Terminal, Shield, Activity, Wifi, Cpu, Clock } from "lucide-react";
import { navLinks } from "@/data/navigation";
import type { Project } from "@/lib/github";

const GIT_COMMANDS = [
  "git log --oneline -1",
  "npm run build",
  "docker-compose up -d",
  "deploy --prod",
];

export default function Footer({ latestProject }: { latestProject: Project | null }) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = mounted ? new Date().getFullYear() : "2024";

  return (
    <footer className="relative pt-48 pb-12 bg-bg-0 overflow-hidden border-t border-bg-3 dark:border-white/5">
      {/* Dynamic Background Matrix */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
         <div className="absolute inset-0 grid-bg" style={{ backgroundSize: '40px 40px' }} />
         <div className="absolute bottom-0 inset-x-0 h-full bg-gradient-to-t from-accent-cyan/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Section 1: Branding & Philosophy */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-text-1 flex items-center justify-center text-bg-0 font-black text-xl">A</div>
               <h3 className="text-4xl font-black tracking-tighter uppercase text-text-1">
                  End of <br /> <span className="text-text-4">Transmission.</span>
               </h3>
            </div>
            <p className="text-text-3 max-w-sm font-mono text-[10px] uppercase tracking-[0.3em] leading-relaxed">
              Synthesizing data... All systems operational. Terminal session persistent in local cache. Communication bridge standby.
            </p>
            <div className="flex gap-1">
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className="w-6 h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }} 
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-full h-full bg-accent-cyan/40"
                    />
                 </div>
               ))}
            </div>
          </div>

          {/* Section 2: Mission Dashboard */}
          <div className="lg:col-span-7">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Tactical Metrics */}
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                         <Activity size={14} className="text-accent-cyan" />
                         <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Kernel_Status</span>
                      </div>
                      <span className="font-mono text-[9px] text-green-500 uppercase">Synced</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Core_Temp</span>
                         <span className="text-[10px] font-mono text-text-1">32°C</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Uptime</span>
                         <span className="text-[10px] font-mono text-text-1">482:12:04</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Build_Ver</span>
                         <span className="text-[10px] font-mono text-accent-cyan">v9.4.2-PROD</span>
                      </div>
                   </div>
                </div>

                {/* Live Console */}
                <TerminalEasterEgg />
             </div>
          </div>
        </div>

        {/* ─── INDUSTRIAL FOOTER BAR ───────────────────── */}
        <div className="pt-12 border-t border-bg-3 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">© {year} Amine Nahli — Session: AUTH_PERSISTENT</span>
              <div className="h-px w-12 bg-bg-3 dark:bg-white/10" />
              <Link 
                href="/admin/login" 
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan font-black hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <Shield size={10} /> Secure_Log
              </Link>
          </div>

          <div className="flex items-center gap-8 font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">
             <div className="flex items-center gap-3 bg-white/[0.02] px-4 py-2 rounded-full border border-white/5">
                <Clock size={12} className="text-accent-cyan" />
                <span className="text-text-1">
                  {mounted ? time.toLocaleTimeString() : "--:--:--"}
                </span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Global_Signal_Optimal</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const TerminalEasterEgg = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (hasRun) return;
    
    let i = 0;
    const command = GIT_COMMANDS[index];
    const timer = setInterval(() => {
      setText(command.slice(0, i));
      i++;
      if (i > command.length) {
        clearInterval(timer);
        setTimeout(() => {
          if (index < GIT_COMMANDS.length - 1) {
            setIndex(prev => prev + 1);
          } else {
            setHasRun(true);
          }
        }, 1500);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [index, hasRun]);

  return (
    <div className="w-full flex flex-col p-8 rounded-[2rem] bg-[#0B0F19] border border-white/10 shadow-2xl font-mono relative overflow-hidden group">
      {/* Background Matrix Rain (Subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
         <div className="flex flex-wrap gap-4 p-4 text-[8px]">
            {mounted && Array.from({length: 100}).map((_, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
         </div>
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
         <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
         </div>
         <span className="font-mono text-[8px] uppercase tracking-widest text-text-4">Uplink_Node_01</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
         <div className="flex items-center gap-3">
            <span className="text-accent-cyan font-mono text-sm">❯</span>
            <span className="font-mono text-[11px] text-text-2 tracking-widest flex-1">{text}</span>
            {!hasRun && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-4 bg-accent-cyan" />}
         </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/5 relative z-10">
         <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Deployment_Successful_200_OK</span>
      </div>
    </div>
  );
};
