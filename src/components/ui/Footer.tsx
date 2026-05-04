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
    <footer className="relative pt-48 pb-12 bg-bg-0 overflow-hidden border-t border-white/5">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
         <div className="absolute inset-0 grid-bg" />
         <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-accent-cyan to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        


        {/* Tactical Navigation & Data Grid (REMOVED per user request) */}

        {/* Industrial Attribution */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">© {new Date().getFullYear()} Amine Nahli — Session Persistent</span>
             <div className="h-px w-12 bg-white/10" />
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan">Secure.Terminal</span>
          </div>

          <div className="flex items-center gap-8 font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
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
    <div className="w-full flex flex-col gap-2 p-6 rounded-[1.5rem] bg-bg-1/50 border border-white/5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
         <span className="font-mono text-[8px] uppercase tracking-widest text-text-4">Kernel_Log</span>
         <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
         </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-accent-cyan font-mono text-xs">❯</span>
        <span className="font-mono text-[11px] text-text-2 tracking-widest flex-1">{text}</span>
        {!hasRun && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-4 bg-accent-cyan/60" />}
      </div>
    </div>
  );
};
