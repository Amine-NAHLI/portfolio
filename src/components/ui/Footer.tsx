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
  return (
    <footer className="relative pt-32 pb-12 bg-bg-0 overflow-hidden border-t border-text-1/[0.05]">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Tagline Focal Point */}
        <div className="mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="text-[10vw] font-black leading-none uppercase tracking-tighter text-center"
          >
            Built with <br /> <span className="gradient-text">Intention.</span>
          </motion.h2>
        </div>

        {/* Navigation & Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 mb-24">
          <div className="space-y-12">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
               {navLinks.map(link => (
                 <Link 
                   key={link.name} 
                   href={link.href} 
                   className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-4 hover:text-text-1 transition-colors"
                 >
                   {link.name}
                 </Link>
               ))}
            </div>
            <p className="max-w-xs text-text-4 text-[10px] font-mono leading-relaxed uppercase tracking-widest">
              A commitment to defensive architecture and user-centric engineering. Fès, Morocco.
            </p>
          </div>

          <div className="flex flex-col justify-between items-start gap-10">
             <div className="space-y-5 w-full">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">Current Status</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-success ping-slow" />
                   <span className="font-mono text-[10px] uppercase tracking-widest text-text-2">Mission Ready</span>
                </div>
                {latestProject && (
                  <div className="p-6 rounded-[1.5rem] bg-bg-1 border border-text-1/[0.05] space-y-2">
                     <p className="font-mono text-[8px] uppercase tracking-widest text-accent-cyan">Latest Shipment</p>
                     <p className="font-bold text-text-1 text-base">{latestProject.title}</p>
                     <p className="font-mono text-[9px] text-text-4 uppercase tracking-widest">{new Date(latestProject.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
             </div>

             <TerminalEasterEgg />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-text-1/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">© {new Date().getFullYear()} Amine Nahli</span>
             <div className="h-px w-8 bg-text-1/[0.1]" />
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">Secured</span>
          </div>

          <div className="flex items-center gap-12">
             <Link href="#" className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors">Privacy</Link>
             <Link href="#" className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors">Legal</Link>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-accent-cyan/[0.03] to-transparent pointer-events-none" />
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
    <div className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-1 border border-white/5">
      <span className="text-success font-mono text-xs">$</span>
      <span className="font-mono text-[11px] text-text-4 tracking-widest flex-1">{text}</span>
      {!hasRun && <span className="w-1.5 h-3.5 bg-accent-cyan/40 animate-pulse" />}
    </div>
  );
};
