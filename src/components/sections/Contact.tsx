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
    className="group flex items-center justify-between p-6 rounded-[2rem] bg-bg-1 border border-text-1/[0.05] hover:border-accent-cyan/20 transition-all hover:bg-bg-2 shadow-xl"
  >
    <div className="flex items-center gap-5">
       <div className="w-10 h-10 rounded-xl bg-text-1/[0.03] flex items-center justify-center text-text-4 group-hover:text-accent-cyan transition-colors">
         <Icon size={18} />
       </div>
       <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-3 group-hover:text-text-1 transition-colors">{label}</span>
    </div>
    <ArrowRight size={16} className="text-text-4 group-hover:text-accent-cyan group-hover:translate-x-2 transition-all" />
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
    <section id="contact" className="relative py-24 bg-bg-0 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-cyan/40 blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-indigo/40 blur-[120px]" />
         <div className="absolute inset-0 grid-bg" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
        >
          <div className="space-y-3">
            <span className="font-mono text-accent-cyan text-[10px] uppercase tracking-[0.4em]">Network.connect()</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Start a <span className="text-text-4">Signal.</span>
            </h2>
          </div>
          <p className="max-w-sm text-text-3 text-base leading-relaxed">
            Available for high-impact security consultations and complex full-stack builds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Content */}
          <div className="space-y-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-text-1"
            >
              Building with <br /><span className="text-accent-cyan">intention</span> and <br /><span className="text-accent-indigo">defensive</span> logic.
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
              className="space-y-3"
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
                   className="p-10 rounded-[3rem] bg-bg-1 border border-accent-cyan/30 text-center space-y-6 flex flex-col items-center justify-center min-h-[500px] shadow-3xl"
                 >
                   <div className="w-20 h-20 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                     <CheckCircle size={32} />
                   </div>
                   <h3 className="text-2xl font-black tracking-tight text-text-1">Signal Received.</h3>
                   <p className="text-text-3 max-w-xs mx-auto text-base leading-relaxed">Your mission brief has been logged.</p>
                   <button onClick={() => setStatus("idle")} className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-cyan hover:text-white transition-colors">Return</button>
                 </motion.div>
               ) : (
                 <motion.form
                   key="form"
                   onSubmit={handleSubmit}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="p-10 md:p-12 rounded-[2.5rem] bg-bg-1 border border-text-1/[0.05] shadow-3xl space-y-10"
                 >
                   <div className="space-y-10">
                      <FormInput label="Identifier" placeholder="Your Name" />
                      <FormInput label="Return Path" placeholder="Email Address" type="email" />
                      <div className="space-y-3">
                        <label className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-4">Objective</label>
                        <textarea 
                          required rows={3}
                          className="w-full bg-transparent border-b border-text-1/[0.1] py-4 text-text-1 text-lg placeholder:text-text-4 focus:outline-none focus:border-accent-cyan transition-all resize-none font-medium"
                          placeholder="What are we building?"
                        />
                      </div>
                   </div>

                   <motion.button
                     type="submit"
                     disabled={status === "submitting"}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full py-5 rounded-xl bg-text-1 text-bg-0 font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
                   >
                     {status === "submitting" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
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
  <div className="space-y-3 group">
    <label className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-4 group-focus-within:text-accent-cyan transition-colors">
      {label}
    </label>
    <input 
      type={type} required 
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-text-1/[0.1] py-4 text-text-1 text-lg placeholder:text-text-4 focus:outline-none focus:border-accent-cyan transition-all font-medium"
    />
  </div>
);
