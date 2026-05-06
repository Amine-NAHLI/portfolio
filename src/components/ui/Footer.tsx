"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navLinks } from "@/data/navigation";
import type { Project } from "@/lib/github";

const GIT_COMMANDS = [
  "git log --oneline -1",
  "npm run build",
  "vercel deploy --prod",
  "docker-compose up -d",
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer({ latestProject }: { latestProject: Project | null }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative pt-48 pb-12 bg-bg-0 overflow-hidden border-t border-bg-3 dark:border-white/5">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
         <div className="absolute inset-0 grid-bg" />
         <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-accent-cyan to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-text-1">
              End of <br /> <span className="text-text-4">Transmission.</span>
            </h3>
            <p className="text-text-3 max-w-sm font-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Synthesizing data... All systems operational. Terminal session will persist in cache.
            </p>
          </div>
          <div className="flex flex-col justify-end">
            <div className="max-w-md">
              <TerminalEasterEgg />
            </div>
          </div>
        </div>

        {/* Industrial Attribution */}
        <div className="pt-12 border-t border-bg-3 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">© {new Date().getFullYear()} Amine Nahli — Session Persistent</span>
              <div className="h-px w-12 bg-bg-3 dark:bg-white/10" />
              <Link 
                href="/admin/login" 
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan font-bold hover:text-white transition-colors cursor-pointer"
              >
                Secure.Terminal
              </Link>
          </div>

          <div className="flex items-center gap-8 font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                <span>Systems_Optimal</span>
             </div>
             <span>Fès, Morocco</span>
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

  useEffect(() => {
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
    <div className="w-full flex flex-col p-5 rounded-lg bg-[#1e1e2e] dark:bg-[#0d1117] border border-[#374151] dark:border-[#30363d] shadow-2xl font-mono">
      {/* Terminal Window Dots */}
      <div className="flex gap-1.5 mb-4">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      <div className="flex items-center justify-between mb-2">
         <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Kernel_Log</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-accent-cyan font-mono text-xs">❯</span>
        <span className="font-mono text-[11px] text-[#e2e8f0] tracking-widest flex-1">{text}</span>
        {!hasRun && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-4 bg-accent-cyan/60" />}
      </div>
    </div>
  );
};
