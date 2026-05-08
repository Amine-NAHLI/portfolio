"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, MessageSquarePlus, X, Loader2, Terminal } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const EMPTY_FORM = { name: "", role: "", company: "", message: "", rating: 5 };

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTestimonials(data); })
      .catch(() => {})
      .finally(() => setLoadingTestimonials(false));
  }, []);

  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setSubmitted(false), 6000);
    return () => clearTimeout(t);
  }, [submitted]);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.role.trim() || !formData.message.trim()) return;
    if (formData.message.trim().length < 50) {
      setSubmitError("Message must be at least 50 characters.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || "Submission failed. Please retry.");
      } else {
        setSubmitted(true);
        setShowForm(false);
        setFormData(EMPTY_FORM);
      }
    } catch {
      setSubmitError("Network error. Check your connection.");
    }
    setSubmitting(false);
  };

  const charCount = formData.message.trim().length;
  const canSubmit = !submitting && formData.name.trim() && formData.role.trim() && charCount >= 50;

  return (
    <>
      {/* ─── PUBLIC SECTION ─── */}
      {!loadingTestimonials && testimonials.length > 0 && (
        <section id="testimonials" className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-indigo/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
              <div className="relative">
                <span className="ghost-text absolute -top-12 -left-4 text-[6rem] md:text-[10rem] font-black select-none pointer-events-none -z-10 uppercase tracking-tighter leading-none">
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
                  <span className="ghost-stroke">Say.</span>
                </h2>
              </div>
              <div className="max-w-sm border-l-2 border-accent-indigo pl-8 py-2">
                <p className="text-text-3 text-[11px] uppercase tracking-[0.2em] font-mono leading-relaxed">
                  Authenticated testimonials from collaborators, mentors, and teammates across security and engineering domains.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
                  className="relative flex flex-col gap-6 p-8 rounded-[2.5rem] bg-bg-1/40 border border-[var(--border)] backdrop-blur-2xl hover:border-accent-indigo/20 transition-colors duration-500 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center group-hover:bg-accent-indigo/20 transition-colors">
                      <Quote size={16} className="text-accent-indigo" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-text-4 uppercase tracking-widest">{RATING_LABELS[t.rating]}</span>
                      <span className="w-5 h-5 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-[10px] font-black text-accent-cyan">{t.rating}</span>
                    </div>
                  </div>
                  <p className="text-text-3 text-sm leading-relaxed flex-1 break-words overflow-hidden">"{t.message}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                    <div className="w-10 h-10 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-black text-accent-indigo">{getInitials(t.name)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="text-sm font-black text-text-1 tracking-tight truncate">{t.name}</span>
                      <span className="text-[9px] font-mono text-text-4 uppercase tracking-widest truncate">{t.role}</span>
                      {t.company && <span className="text-[8px] font-mono text-accent-cyan/60 uppercase tracking-widest truncate">{t.company}</span>}
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-accent-indigo/20 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FLOATING BUTTON ─── */}
      <div className="fixed bottom-8 right-8 z-40">
        <AnimatePresence mode="wait">
          {!showForm && (
            <motion.button
              key="fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-0 border border-accent-cyan/30 text-accent-cyan font-mono font-bold uppercase tracking-widest text-[10px] hover:border-accent-cyan/60 hover:bg-accent-cyan/5 transition-all duration-300 shadow-[0_0_20px_rgba(0,180,216,0.15)]"
            >
              <Terminal size={14} />
              Leave_Review
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ─── SUCCESS TOAST ─── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-8 z-50 px-5 py-4 rounded-xl bg-bg-0 border border-accent-cyan/25 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
          >
            <p className="text-[11px] font-mono text-accent-cyan tracking-widest">&gt; REVIEW_SUBMITTED</p>
            <p className="text-[10px] font-mono text-text-4 mt-1 tracking-wide">Your review is pending moderation.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL — terminal aesthetic, always dark ─── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

            {/* Modal uses terminal-dark so it stays dark in both modes */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="terminal-dark relative w-full max-w-lg rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] z-10 overflow-hidden border"
            >
              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#00B4D8]/40 to-transparent" />

              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Terminal size={13} className="text-accent-cyan" />
                      <span className="text-[9px] font-mono text-accent-cyan uppercase tracking-[0.3em]">Review_Form</span>
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight">Leave a testimonial</h3>
                    <p className="text-[10px] font-mono text-white/25 mt-0.5 tracking-wide">Will be published after manual moderation.</p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Name + Role */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">
                        Full Name <span className="text-accent-cyan">*</span>
                      </label>
                      <input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/15 outline-none focus:border-accent-cyan/40 focus:bg-accent-cyan/[0.03] font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">
                        Title / Role <span className="text-accent-cyan">*</span>
                      </label>
                      <input
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Tech Lead"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/15 outline-none focus:border-accent-cyan/40 focus:bg-accent-cyan/[0.03] font-mono"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">Organisation</label>
                    <input
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company · City"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/15 outline-none focus:border-accent-cyan/40 focus:bg-accent-cyan/[0.03] font-mono"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: n })}
                          className={`flex-1 py-2 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-200 ${
                            formData.rating === n
                              ? "bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan"
                              : "bg-white/[0.03] border-white/10 text-white/25 hover:border-white/20 hover:text-white/50"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] font-mono text-white/20 tracking-wide">
                      {RATING_LABELS[formData.rating]}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">
                        Testimonial <span className="text-accent-cyan">*</span>
                      </label>
                      <span className={`text-[9px] font-mono tabular-nums ${charCount >= 50 ? "text-accent-cyan/50" : "text-white/20"}`}>
                        {charCount}/50 min
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your experience working with Amine..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/15 outline-none resize-none focus:border-accent-cyan/40 focus:bg-accent-cyan/[0.03] font-mono leading-relaxed"
                    />
                  </div>

                  {submitError && (
                    <p className="text-[10px] font-mono text-red-400/80 tracking-wide">&gt; ERROR: {submitError}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 rounded-lg border border-white/10 text-white/30 text-[10px] font-mono uppercase tracking-widest hover:border-white/20 hover:text-white/50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="flex-[2] py-3 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-accent-cyan/15 hover:border-accent-cyan/50 transition-all flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? <><Loader2 size={13} className="animate-spin" /> Submitting...</>
                        : <><Terminal size={13} /> SUBMIT_REVIEW</>
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
