"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const testimonials = [
  {
    id: 1,
    quote: "Amine's ability to identify vulnerabilities while simultaneously proposing architectural improvements is rare. He delivered a thorough security audit and full remediation plan weeks ahead of schedule.",
    author: "Dr. Mehdi Alaoui",
    role: "Professor · Network Security",
    org: "UPF · Fès",
    initials: "MA",
  },
  {
    id: 2,
    quote: "One of the most driven engineers I've worked with. Amine built our entire backend from scratch, integrated real-time threat detection, and documented every decision. Exceptional quality.",
    author: "Yassine Berrada",
    role: "Tech Lead",
    org: "Startup · Casablanca",
    initials: "YB",
  },
  {
    id: 3,
    quote: "He joins a CTF team and immediately becomes a force multiplier. Sharp instincts, deep knowledge of exploitation techniques, and always sharing knowledge with teammates.",
    author: "Salma Idrissi",
    role: "CTF Teammate",
    org: "Morocco Cyber Collective",
    initials: "SI",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-indigo/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="relative">
            <span className="absolute -top-12 -left-4 text-[6rem] md:text-[10rem] font-black text-text-1 opacity-[0.02] select-none pointer-events-none -z-10 uppercase tracking-tighter leading-none">
              Signal
            </span>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-accent-indigo rounded-full" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent-indigo font-black">
                Verified_Signals
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
              What They <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}>
                Say.
              </span>
            </h2>
          </div>

          <div className="max-w-sm border-l-2 border-accent-indigo pl-8 py-2">
            <p className="text-text-3 text-[11px] uppercase tracking-[0.2em] font-mono leading-relaxed">
              Authenticated testimonials from collaborators, mentors, and teammates across security and engineering domains.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
              className="relative flex flex-col gap-8 p-10 rounded-[2.5rem] bg-bg-1/40 border border-white/5 backdrop-blur-2xl shadow-2xl hover:border-accent-indigo/20 transition-colors duration-500 group"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center group-hover:bg-accent-indigo/20 transition-colors">
                <Quote size={16} className="text-accent-indigo" />
              </div>

              {/* Quote text */}
              <p className="text-text-3 text-sm leading-relaxed flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-black text-accent-indigo">{t.initials}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-text-1 tracking-tight">{t.author}</span>
                  <span className="text-[9px] font-mono text-text-4 uppercase tracking-widest">{t.role}</span>
                  <span className="text-[8px] font-mono text-accent-indigo/60 uppercase tracking-widest">{t.org}</span>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-accent-indigo/20 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
