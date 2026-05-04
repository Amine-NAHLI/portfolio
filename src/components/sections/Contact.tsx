"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;


export default function Contact({ profile }: { profile: GitHubProfile | null }) {
  return (
    <section id="contact" className="relative py-32 bg-transparent overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-cyan/20 blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-indigo/20 blur-[120px]" />
         <div className="absolute inset-0 grid-bg" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="space-y-6 mb-20"
        >
          <div className="flex items-center justify-center gap-3">
             <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
             <span className="font-mono text-accent-cyan text-[10px] uppercase tracking-[0.4em]">Direct_Access_v1.0</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
            Let's Start <br /> <span className="text-text-4">The Signal.</span>
          </h2>
          <p className="max-w-xl mx-auto text-text-3 text-lg md:text-xl leading-relaxed">
            I'm currently open to high-impact engineering roles, offensive security research, and complex full-stack architecture.
          </p>
        </motion.div>

        {/* Direct Channels Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <ChannelCard 
             label="LinkedIn" 
             val="Amine Nahli" 
             href="https://linkedin.com/in/amine-nahli-48b2a734b" 
             icon={LinkedinIcon} 
             color="var(--accent-indigo)"
           />
           <ChannelCard 
             label="GitHub" 
             val={profile?.login || "Amine-NAHLI"} 
             href={profile?.html_url || "https://github.com/Amine-NAHLI"} 
             icon={GithubIcon} 
             color="var(--accent-cyan)"
           />
           <ChannelCard 
             label="Direct Email" 
             val="nahli-ami@upf.ac.ma" 
             href="mailto:nahli-ami@upf.ac.ma" 
             icon={Mail} 
             color="var(--accent-purple)"
           />
        </div>

        {/* Tactical Attribution Bar - Final Site Closure */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
           <div className="flex flex-col md:flex-row items-center gap-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">© {new Date().getFullYear()} Amine Nahli — Session Persistent</span>
              <div className="hidden md:block h-px w-12 bg-white/10" />
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-success" />
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan">Systems_Optimal</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">
              <span>Secure.Terminal</span>
              <span>Fès, Morocco</span>
           </div>
        </motion.div>
      </div>
    </section>
  );
}

const ChannelCard = ({ label, val, href, icon: Icon, color }: any) => (
  <motion.a
    href={href}
    target="_blank"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ duration: 0.5, ease: EASE }}
    className="group relative p-8 rounded-[2.5rem] bg-bg-1 border border-text-1/[0.05] hover:border-white/20 transition-all flex flex-col items-center gap-6 overflow-hidden shadow-2xl"
  >
     <div 
       className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none"
       style={{ background: `radial-gradient(circle at center, ${color}, transparent)` }}
     />
     <div className="w-16 h-16 rounded-2xl bg-bg-2 flex items-center justify-center text-text-4 group-hover:text-text-1 transition-colors relative z-10">
       <Icon size={24} />
     </div>
     <div className="space-y-1 relative z-10">
        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-4 group-hover:text-accent-cyan transition-colors">{label}</p>
        <p className="text-lg font-bold text-text-1 tracking-tight">{val}</p>
     </div>
     <ArrowRight size={14} className="mt-4 text-text-4 group-hover:text-text-1 group-hover:translate-x-2 transition-all opacity-0 group-hover:opacity-100" />
  </motion.a>
);
