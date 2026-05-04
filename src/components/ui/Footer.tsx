"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navLinks } from "@/data/navigation";
import type { Project } from "@/lib/github";

const GlobeVisual = dynamic(() => import("@/components/three/GlobeVisual"), { ssr: false });

export default function Footer({ latestProject }: { latestProject: Project | null }) {
  return (
    <footer className="relative pt-40 pb-12 bg-bg-0 overflow-hidden border-t border-white/5">
      {/* Background Globe (Subtle) */}
      <div className="absolute left-[-10%] bottom-[-10%] w-[800px] h-[800px] pointer-events-none opacity-10">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <GlobeVisual />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-24 mb-40">
          
          <div className="space-y-12">
            <h2 className="text-7xl md:text-[8vw] font-black tracking-tighter leading-none uppercase">
              Keep <br /> <span className="text-text-4">Exploring.</span>
            </h2>
            <div className="flex flex-wrap gap-8">
               {navLinks.map(link => (
                 <Link 
                   key={link.name} 
                   href={link.href} 
                   className="font-mono text-xs uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors"
                 >
                   {link.name}
                 </Link>
               ))}
            </div>
          </div>

          <div className="flex flex-col justify-between items-start gap-12">
             <div className="space-y-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-cyan">Latest Status</span>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-success ping-slow" />
                   <span className="font-mono text-xs uppercase tracking-widest text-text-2">Systems Operational</span>
                </div>
                {latestProject && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                     <p className="font-mono text-[9px] uppercase tracking-widest text-text-4">Recent Shipment</p>
                     <p className="font-bold text-text-1">{latestProject.title}</p>
                     <p className="font-mono text-[10px] text-text-4">{new Date(latestProject.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
             </div>

             <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4">Local Time</span>
                <p className="text-4xl font-black text-text-1 tabular-nums">
                   {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-4">Fès, Morocco (GMT+1)</p>
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">© {new Date().getFullYear()} Amine Nahli</span>
             <div className="h-px w-8 bg-white/10" />
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">Secure by Design</span>
          </div>

          <div className="flex items-center gap-12">
             <Link href="#" className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors">Privacy</Link>
             <Link href="#" className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4 hover:text-text-1 transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
