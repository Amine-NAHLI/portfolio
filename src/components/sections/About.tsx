"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldAlert, Terminal, MapPin, Activity, GitCommit
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function About({ personal }: { personal: any }) {
  return (
    <section id="about" className="relative py-32 bg-white dark:bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Simplified Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-bg-3 dark:border-white/5 pb-10">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-3">System_Access_v3.0</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Unified Identity Card */}
           <div className="lg:col-span-12">
              <div className="bg-white dark:bg-bg-1/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-12 relative overflow-hidden group min-h-[400px] flex flex-col justify-center shadow-sm dark:shadow-none transition-all hover:shadow-xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-5 text-text-1">
                    <Terminal size={240} />
                 </div>

                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="space-y-12 relative z-10"
                  >
                     <div className="space-y-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan">Identity.load()</span>
                        <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1] text-text-1 uppercase">
                           Architecting <br /> <span className="text-text-3 italic">The Future.</span>
                        </h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
                        {[
                          { label: "Status", val: "3rd Year Eng. Student" },
                          { label: "Academy", val: "UPF University" },
                          { label: "Focus", val: "Software & Security" },
                          { label: "Location", val: personal.location }
                        ].map((item) => (
                          <div key={item.label} className="space-y-1 border-l border-slate-200 dark:border-white/10 pl-6">
                             <p className="font-mono text-[9px] uppercase tracking-widest text-text-4">{item.label}</p>
                             <p className="text-lg font-bold text-text-2 tracking-tight">{item.val}</p>
                          </div>
                        ))}
                     </div>

                     <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 font-mono text-[10px] text-text-3 uppercase tracking-widest transition-colors hover:border-accent-cyan/30">
                           <Activity size={12} className="text-success" /> Operational Status: Active
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 font-mono text-[10px] text-text-3 uppercase tracking-widest transition-colors hover:border-accent-cyan/30">
                           <ShieldAlert size={12} className="text-accent-cyan" /> Systems Hardened
                        </div>
                     </div>
                  </motion.div>
              </div>
           </div>

        </div>

      </div>
    </section>
  );
}
