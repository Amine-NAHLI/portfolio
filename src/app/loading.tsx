"use client";

import React, { useState, useEffect } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing Core...");

  const messages = [
    "Establishing Secure Connection...",
    "Accessing GitHub_API.v3...",
    "Fetching Identity Records...",
    "Compiling Technical Arsenal...",
    "Parsing Project Metadata...",
    "Optimizing Neural UI...",
    "Hardening System Architecture...",
    "Booting Industrial Framework...",
    "Ready for Access."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15;
        const next = Math.min(prev + increment, 99);
        const step = Math.floor((next / 100) * messages.length);
        if (step > currentStep && step < messages.length) {
          currentStep = step;
          setMessage(messages[step]);
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0B0F19] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none animate-pulse-soft" />
      
      {/* Scanner Line (CSS Animation) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent z-10 animate-scanner" />

      <div className="relative w-full max-w-sm flex flex-col items-center animate-boot-up">
        
        {/* Animated Logo/Mark */}
        <div className="mb-16 relative">
          <div className="w-20 h-20 rounded-2xl bg-[#E5E7EB] flex items-center justify-center text-[#0B0F19] font-black text-4xl shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            A
          </div>
          {/* Circular Rings (CSS Pulse) */}
          <div className="absolute inset-0 rounded-2xl border border-[#E5E7EB] opacity-20 animate-ping" />
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-4">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="block font-mono text-[10px] uppercase tracking-[0.4em] text-[#06B6D4]">System_Boot</span>
              <div className="h-4 overflow-hidden relative">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6B7280] transition-transform duration-300">
                  {message}
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-[#E5E7EB] font-bold">{Math.floor(progress)}%</span>
          </div>

          {/* Real Progress Bar */}
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
            <div 
              className="h-full bg-[#E5E7EB] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Technical Data Stream */}
          <div className="pt-8 flex justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="font-mono text-[8px] text-[#6B7280] uppercase tracking-tighter">Connection: Stable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
                <span className="font-mono text-[8px] text-[#6B7280] uppercase tracking-tighter">Encryption: AES-256</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="block font-mono text-[8px] text-[#6B7280] uppercase">Node_v20.11.0</span>
              <span className="block font-mono text-[8px] text-[#6B7280] uppercase">Protocol_SSL/TLS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Bottom Accent */}
      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-b from-[#E5E7EB]/20 to-transparent" />
        <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-[#6B7280]">Authorized Access Only</span>
      </div>
    </div>
  );
}
