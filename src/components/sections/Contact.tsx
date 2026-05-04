"use client";

import React, { useState, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Mail, ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { useTilt } from "@/hooks/useTilt";
import type { GitHubProfile } from "@/lib/github";

const WaveVisual = dynamic(() => import("@/components/three/WaveVisual"), { ssr: false });

const SocialLink = ({ label, href, icon: Icon }: any) => (
  <a
    href={href}
    target="_blank"
    className="group flex items-center justify-between p-8 rounded-3xl bg-bg-1 border border-white/5 hover:border-white/10 transition-all hover:bg-bg-2"
  >
    <div className="flex items-center gap-6">
       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-4 group-hover:text-cyan transition-colors">
         <Icon size={20} />
       </div>
       <span className="font-mono text-sm uppercase tracking-[0.3em] text-text-3 group-hover:text-text-1 transition-colors">{label}</span>
    </div>
    <ArrowRight size={18} className="text-text-4 group-hover:text-cyan group-hover:translate-x-2 transition-all" />
  </a>
);

export default function Contact({ profile }: { profile: GitHubProfile | null }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 2000);
  };

  return (
    <section id="contact" className="relative py-40 bg-bg-0">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">Network.connect()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Start a <span className="text-text-4">Signal.</span>
            </h2>
          </div>
          <p className="max-w-md text-text-3 text-lg leading-relaxed">
            I&apos;m currently available for freelance projects and high-impact security consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left: Direct & Socials */}
          <div className="space-y-12">
            <h3 className="text-4xl font-black tracking-tighter uppercase leading-tight">
              Looking for someone to <span className="text-cyan">secure</span> your next big idea?
            </h3>
            
            <div className="space-y-4">
               <SocialLink label="LinkedIn" href="https://linkedin.com/in/amine-nahli" icon={LinkedinIcon} />
               <SocialLink label="GitHub" href={profile?.html_url} icon={GithubIcon} />
               <SocialLink label="Email" href="mailto:nahli-ami@upf.ac.ma" icon={Mail} />
            </div>

            <div className="p-8 rounded-3xl glass border border-white/10 space-y-4">
               <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-cyan">Response Time</span>
               <p className="text-text-2 text-lg">Usually responds within <span className="text-white font-bold">12 hours</span>.</p>
            </div>
          </div>

          {/* Right: Modern Form */}
          <div className="relative">
             <AnimatePresence mode="wait">
               {status === "success" ? (
                 <motion.div
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-12 rounded-[3rem] bg-bg-1 border border-cyan/30 text-center space-y-8 flex flex-col items-center justify-center min-h-[600px] shadow-3xl"
                 >
                   <div className="w-24 h-24 rounded-full bg-cyan/10 flex items-center justify-center text-cyan shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                     <CheckCircle size={40} />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">Transmission Successful.</h3>
                   <p className="text-text-3 max-w-xs mx-auto">I&apos;ve received your signal and will respond shortly.</p>
                   <button onClick={() => setStatus("idle")} className="font-mono text-[10px] uppercase tracking-[0.5em] text-cyan hover:text-white transition-colors">Return to form</button>
                 </motion.div>
               ) : (
                 <motion.form
                   key="form"
                   onSubmit={handleSubmit}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-12 md:p-16 rounded-[3rem] bg-bg-1 border border-white/5 shadow-3xl space-y-12"
                 >
                   <div className="space-y-10">
                      <FormInput label="Full Name" placeholder="Identify yourself" />
                      <FormInput label="Email Address" placeholder="Return coordinates" type="email" />
                      <div className="space-y-4">
                        <label className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4">The Message</label>
                        <textarea 
                          required rows={4}
                          className="w-full bg-transparent border-b border-white/10 py-6 text-text-1 text-xl placeholder:text-text-4 focus:outline-none focus:border-cyan transition-all resize-none"
                          placeholder="What's the objective?"
                        />
                      </div>
                   </div>

                   <button
                     type="submit"
                     disabled={status === "submitting"}
                     className="w-full py-6 rounded-2xl bg-text-1 text-bg-0 font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                     {status === "submitting" ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                     {status === "submitting" ? "Transmitting..." : "Send Transmission"}
                   </button>
                 </motion.form>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const FormInput = ({ label, placeholder, type = "text" }: any) => (
  <div className="space-y-4 group">
    <label className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4 group-focus-within:text-cyan transition-colors">
      {label}
    </label>
    <input 
      type={type} required 
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-white/10 py-6 text-text-1 text-xl placeholder:text-text-4 focus:outline-none focus:border-cyan transition-all"
    />
  </div>
);
