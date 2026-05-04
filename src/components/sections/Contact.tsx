"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import type { GitHubProfile } from "@/lib/github";

interface ContactLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  index: number;
}

const ContactCard = ({ label, href, icon: Icon, index }: ContactLink) => (
  <motion.a
    href={href}
    target={href.startsWith("mailto:") ? undefined : "_blank"}
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/50 border border-white/8 hover:border-accent-cyan/35 hover:bg-accent-cyan/4 group transition-all duration-[250ms]"
  >
    <div className="flex items-center gap-3.5">
      <div className="p-2 rounded-lg bg-white/5 text-text-faint group-hover:text-accent-cyan transition-colors duration-[250ms]">
        <Icon size={18} />
      </div>
      <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-[250ms]">
        {label}
      </span>
    </div>
    <ArrowRight size={16} className="text-text-faint group-hover:text-accent-cyan group-hover:translate-x-1 transition-all duration-[250ms]" aria-hidden="true" />
  </motion.a>
);

interface ContactProps {
  profile: GitHubProfile | null;
}

type FormState = { name: string; email: string; subject: string; message: string };
type Status = "idle" | "submitting" | "success" | "error";

const Contact = ({ profile }: ContactProps) => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const contactLinks: ContactLink[] = [
    { label: "LinkedIn",     icon: LinkedinIcon, href: "https://linkedin.com/in/amine-nahli-48b2a734b", index: 0 },
    { label: "Email",        icon: Mail,         href: "mailto:nahli-ami@upf.ac.ma",                   index: 1 },
    { label: "GitHub",       icon: GithubIcon,   href: profile?.html_url || "https://github.com/Amine-NAHLI", index: 2 },
  ];

  const inputClass = "w-full bg-transparent border-b border-white/10 py-3 text-text-primary placeholder:text-text-faint focus:outline-none transition-all duration-[250ms] text-sm";

  return (
    <section id="contact" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          number="05"
          label="Contact"
          heading={<>Let&apos;s <span className="gradient-text">connect.</span></>}
          subheading="If you're hiring, collaborating, or just want to talk shop — my inbox is open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-7 rounded-2xl bg-bg-secondary/50 border border-white/8 backdrop-blur-sm"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-bg-secondary/95"
                >
                  <CheckCircle size={40} className="text-success" aria-hidden="true" />
                  <p className="text-text-primary font-semibold text-lg">Message received!</p>
                  <p className="text-text-secondary text-sm">I&apos;ll get back to you soon.</p>
                  <button onClick={() => setStatus("idle")} className="mt-2 text-xs font-mono text-accent-cyan/70 hover:text-accent-cyan underline underline-offset-4 transition-colors">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-label="Contact form"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative input-underline">
                      <label htmlFor="contact-name" className="sr-only">Your name</label>
                      <input id="contact-name" type="text" required placeholder="Name" value={form.name} onChange={update("name")} className={inputClass} />
                    </div>
                    <div className="relative input-underline">
                      <label htmlFor="contact-email" className="sr-only">Your email</label>
                      <input id="contact-email" type="email" required placeholder="Email" value={form.email} onChange={update("email")} className={inputClass} />
                    </div>
                  </div>
                  <div className="relative input-underline">
                    <label htmlFor="contact-subject" className="sr-only">Subject</label>
                    <input id="contact-subject" type="text" required placeholder="Subject" value={form.subject} onChange={update("subject")} className={inputClass} />
                  </div>
                  <div className="relative input-underline">
                    <label htmlFor="contact-message" className="sr-only">Your message</label>
                    <textarea id="contact-message" required rows={4} placeholder="Message" value={form.message} onChange={update("message")} className={`${inputClass} resize-none`} />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="text-danger text-xs font-mono">Failed to send — please try emailing directly.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-indigo text-bg font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-[250ms] disabled:opacity-60 disabled:scale-100 shadow-[0_0_24px_rgba(6,182,212,0.18)]"
                  >
                    {status === "submitting"
                      ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /><span>Sending…</span></>
                      : <><Send size={16} aria-hidden="true" /><span>Send Message</span></>
                    }
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact links */}
          <div className="flex flex-col justify-center">
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-3xl font-semibold leading-snug text-text-primary border-l-2 border-accent-cyan/30 pl-6 mb-8"
            >
              &ldquo;Security is not a product — it&apos;s a property of how you build.&rdquo;
            </motion.blockquote>

            <div className="space-y-3">
              {contactLinks.map((link) => <ContactCard key={link.label} {...link} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
