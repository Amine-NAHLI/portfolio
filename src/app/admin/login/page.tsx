"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center p-6 font-sans transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-full grid-bg" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-bg-1/50 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-xl dark:shadow-2xl transition-all">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-text-1 uppercase">Admin Access</h1>
            <p className="text-slate-500 dark:text-text-4 font-mono text-[10px] uppercase tracking-widest mt-2">Secure Terminal Session</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-text-4 ml-4">Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-text-4" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@upf.ac.ma"
                  className="w-full bg-slate-50 dark:bg-bg-2/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 text-slate-900 dark:text-text-1 focus:border-accent-cyan/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-text-4 ml-4">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-text-4" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-bg-2/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 text-slate-900 dark:text-text-1 focus:border-accent-cyan/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-accent-cyan text-white py-4 rounded-2xl font-semibold uppercase tracking-[0.05em] text-[10px] hover:bg-slate-800 dark:hover:brightness-90 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Establish Connection</>
              )}
            </button>
          </form>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => router.push("/")}
              className="text-slate-500 dark:text-text-4 font-mono text-[9px] uppercase tracking-widest hover:text-accent-cyan transition-colors"
            >
              ← Return to Portfolio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
