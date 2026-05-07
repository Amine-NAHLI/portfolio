"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Shield, Brain, Cpu, Box } from "lucide-react";

interface FilterProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const categories = [
  { id: "all", label: "All_Systems", icon: LayoutGrid },
  { id: "Full-Stack", label: "Full_Stack", icon: Cpu },
  { id: "Security", label: "Cyber_Sec", icon: Shield },
  { id: "AI", label: "Neural_Net", icon: Brain },
  { id: "Experiments", label: "Exp_Lab", icon: Box },
];

export default function ProjectFilters({ activeCategory, setActiveCategory }: FilterProps) {
  return (
    <div className="flex flex-col gap-6 w-full lg:w-48 shrink-0">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">Control_Panel</span>
        <div className="h-px w-full bg-white/5" />
      </div>

      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 whitespace-nowrap"
            >
              {/* Active Indicator (Switch style) */}
              <div className={`w-1.5 h-8 rounded-full transition-all duration-500 ${
                isActive ? "bg-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-white/10"
              }`} />

              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={isActive ? "text-accent-cyan" : "text-text-4 group-hover:text-text-2"} />
                  <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    isActive ? "text-text-1" : "text-text-4 group-hover:text-text-2"
                  }`}>
                    {cat.label}
                  </span>
                </div>
                {isActive && (
                  <motion.span 
                    layoutId="status-active"
                    className="text-[8px] font-mono text-accent-cyan/60 uppercase"
                  >
                    Active_Link
                  </motion.span>
                )}
              </div>

              {/* Hover Background */}
              {!isActive && (
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
              )}
            </button>
          );
        })}
      </div>

      {/* Connection Metadata */}
      <div className="hidden lg:flex flex-col gap-4 mt-8 pt-8 border-t border-white/5">
         <div className="space-y-1">
            <span className="text-[9px] font-mono text-text-4 uppercase">System_State</span>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-mono text-text-2">SYNC_OK</span>
            </div>
         </div>
         <div className="space-y-1">
            <span className="text-[9px] font-mono text-text-4 uppercase">Database_Link</span>
            <span className="text-[10px] font-mono text-text-2 uppercase">Supabase_Main</span>
         </div>
      </div>
    </div>
  );
}
