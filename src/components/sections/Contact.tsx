"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;

const SocialLink = ({ label, href, icon: Icon }: any) => (
  <motion.a
    href={href}
    target="_blank"
    whileHover={{ x: 8 }}
    transition={{ duration: 0.3, ease: EASE }}
    className="group flex items-center justify-between p-8 rounded-3xl bg-bg-1 border border-white/5 hover:border-white/10 transition-all hover:bg-bg-2 shadow-xl"
  >
    <div className="flex items-center gap-6">
       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-4 group-hover:text-cyan transition-colors">
         <Icon size={20} />
       </div>
       <span className="font-mono text-sm uppercase tracking-[0.3em] text-text-3 group-hover:text-text-1 transition-colors">{label}</span>
    </div>
    <ArrowRight size={18} className="text-text-4 group-hover:text-cyan group-hover:translate-x-2 transition-all" />
  </motion.a>
);

export default function Contact({ profile }: { profile: GitHubProfile | null }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <section id="contact" className="relative py-40 bg-bg-0 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan/40 blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo/40 blur-[120px]" />
         <div className="absolute inset-0 grid-bg" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32"
        >
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">Network.connect()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Start a <span className="text-text-4">Signal.</span>
            </h2>
          </div>
          <p className="max-w-md text-text-3 text-lg leading-relaxed">
            Available for high-impact security consultations and complex full-stack builds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left: Content */}
          <div className="space-y-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-text-1"
            >
              Building with <br /><span className="text-cyan">intention</span> and <br /><span className="text-indigo">defensive</span> logic.
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
              className="space-y-4"
            >
               <SocialLink label="LinkedIn" href="https://linkedin.com/in/amine-nahli" icon={LinkedinIcon} />
               <SocialLink label="GitHub" href={profile?.html_url} icon={GithubIcon} />
               <SocialLink label="Email" href="mailto:nahli-ami@upf.ac.ma" icon={Mail} />
            </motion.div>
          </div>

          {/* Right: Form */}
          <div className="relative">
             <AnimatePresence mode="wait">
               {status === "success" ? (
                 <motion.div
                   key="success"
                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="p-12 rounded-[3rem] bg-bg-1 border border-cyan/30 text-center space-y-8 flex flex-col items-center justify-center min-h-[600px] shadow-3xl"
                 >
                   <div className="w-24 h-24 rounded-full bg-cyan/10 flex items-center justify-center text-cyan shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                     <CheckCircle size={40} />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight text-text-1">Signal Received.</h3>
                   <p className="text-text-3 max-w-xs mx-auto text-lg leading-relaxed">Your mission brief has been logged. I&apos;ll get back to you shortly.</p>
                   <button onClick={() => setStatus("idle")} className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan hover:text-white transition-colors">Return</button>
                 </motion.div>
               ) : (
                 <motion.form
                   key="form"
                   onSubmit={handleSubmit}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="p-12 md:p-16 rounded-[3.5rem] bg-bg-1 border border-white/5 shadow-3xl space-y-12"
                 >
                   <div className="space-y-12">
                      <FormInput label="Identifier" placeholder="Your Name" />
                      <FormInput label="Return Path" placeholder="Email Address" type="email" />
                      <div className="space-y-4">
                        <label className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4">Objective</label>
                        <textarea 
                          required rows={4}
                          className="w-full bg-transparent border-b border-white/10 py-6 text-text-1 text-xl placeholder:text-text-4 focus:outline-none focus:border-cyan transition-all resize-none font-medium"
                          placeholder="What are we building?"
                        />
                      </div>
                   </div>

                   <motion.button
                     type="submit"
                     disabled={status === "submitting"}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full py-7 rounded-2xl bg-text-1 text-bg-0 font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl hover:shadow-cyan/10"
                   >
                     {status === "submitting" ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                     {status === "submitting" ? "Transmitting..." : "Send Transmission"}
                   </motion.button>
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
      className="w-full bg-transparent border-b border-white/10 py-6 text-text-1 text-xl placeholder:text-text-4 focus:outline-none focus:border-cyan transition-all font-medium"
    />
  </div>
);
