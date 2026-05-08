"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Shield, Wifi, Radio } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ConnectionLog = ({ message, type }: { message: string; type: "info" | "success" | "warn" }) => {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 font-mono text-[9px] uppercase tracking-widest"
    >
      <span className="text-white/20">[{time}]</span>
      <span className={type === "success" ? "text-green-500" : type === "warn" ? "text-amber-500" : "text-accent-cyan"}>
        {message}
      </span>
    </motion.div>
  );
};

export default function Contact({ profile }: { profile?: any }) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  const channels = [
    {
      id: "linkedin",
      label: "LinkedIn_Secure",
      icon: LinkedinIcon,
      href: "https://linkedin.com/in/amine-nahli",
      color: "blue"
    },
    {
      id: "github",
      label: "GitHub_Source",
      icon: GithubIcon,
      href: "https://github.com/Amine-NAHLI",
      color: "slate"
    },
    {
      id: "email",
      label: "Direct_Uplink",
      icon: Mail,
      href: "mailto:nahliamine2@gmail.com",
      color: "cyan"
    }
  ];

  return (
    <section id="contact" className="py-48 relative overflow-hidden">

      {/* ─── RADAR SWEEP BACKGROUND ─────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,180,216,0.2)_90deg,transparent_100deg)]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[var(--border)] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[var(--border)] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

          {/* ─── LEFT: COMMS INTERFACE ────────────────── */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
                <Radio size={14} className="text-accent-cyan" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan font-black">Transmission_Bridge</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                Initialize <br />
                <span className="ghost-stroke">Contact.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target="_blank"
                    onMouseEnter={() => setHoveredChannel(channel.id)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    className="group relative flex items-center justify-between p-8 rounded-[2rem] bg-bg-1/40 border border-[var(--border)] backdrop-blur-xl hover:border-accent-cyan/40 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-accent-cyan scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />

                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-text-1/5 flex items-center justify-center border border-[var(--border)] group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/20 transition-all duration-500">
                        <Icon size={24} className="text-text-2 group-hover:text-accent-cyan" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-text-4 uppercase tracking-widest">{channel.label}</span>
                        <span className="text-xl font-bold text-text-1">Uplink_Authorized</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[8px] font-mono text-accent-cyan uppercase">Ping: 14ms</span>
                        <span className="text-[8px] font-mono text-green-500 uppercase">Secure_Link</span>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-accent-cyan group-hover:text-accent-cyan transition-all">
                        <Send size={16} className="-rotate-45" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ─── RIGHT: STATUS HUD — always dark terminal ── */}
          <div className="flex flex-col justify-end">
            <div className="terminal-dark rounded-[3rem] p-10 border shadow-2xl space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest font-black text-white">Bridge_Console</span>
                </div>
                <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono text-white/40 uppercase">Mode: Tactical</span>
                </div>
              </div>

              <div className="h-64 flex flex-col gap-3 overflow-hidden">
                <ConnectionLog message="BRIDGE_INTERFACE_INITIALIZED" type="info" />
                <ConnectionLog message="SYSTEM_DIAGNOSTIC_COMPLETE" type="success" />
                <ConnectionLog message="LISTENING_FOR_INBOUND_SIGNALS..." type="info" />
                {hoveredChannel && (
                  <ConnectionLog message={`ESTABLISHING_SECURE_TUNNEL_TO_${hoveredChannel.toUpperCase()}...`} type="warn" />
                )}
                <AnimatePresence>
                  {hoveredChannel && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-auto space-y-2"
                    >
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-mono text-white/40 uppercase">Signal_Strength</span>
                        <span className="text-[11px] font-mono text-accent-cyan font-black">98.4%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "98.4%" }}
                          className="h-full bg-accent-cyan"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <Shield size={16} className="text-accent-cyan" />
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">TLS_v1.3_Active</span>
                </div>
                <div className="flex gap-2">
                  <Wifi size={16} className="text-accent-cyan" />
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Signal: High</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
