"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/**
 * Contact link card with hover arrow animation.
 */
const ContactCard = ({
  icon: Icon,
  label,
  href,
  index,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  href: string;
  index: number;
}) => (
  <motion.a
    href={href}
    target={href.startsWith("mailto:") ? undefined : "_blank"}
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.1 * index }}
    className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/50 border border-white/10 hover:border-accent-cyan/40 hover:bg-accent-cyan/5 group transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-white/5 text-text-muted group-hover:text-accent-cyan transition-colors">
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
    <ArrowRight
      size={18}
      className="text-text-muted group-hover:text-accent-cyan transition-all duration-300 group-hover:translate-x-1"
    />
  </motion.a>
);

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  const contactLinks = [
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      href: "https://linkedin.com/in/amine-nahli-48b2a734b",
    },
    { label: "Email", icon: Mail, href: "mailto:nahli-ami@upf.ac.ma" },
    {
      label: "GitHub",
      icon: GithubIcon,
      href: "https://github.com/Amine-NAHLI",
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="section-label">// 06 ─ OPEN TRANSMISSION</span>
            <div className="h-[1px] flex-1 max-w-20 bg-accent-cyan/20" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-white/90 border-l-2 border-accent-cyan/30 pl-6"
            >
              &ldquo;Security is not a product — it&apos;s a property of how you
              build.&rdquo;
            </motion.blockquote>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary mb-12 max-w-md"
            >
              If you&apos;re hiring, collaborating, or just want to talk shop —
              my inbox is open.
            </motion.p>

            <div className="space-y-3 max-w-sm">
              {contactLinks.map((link, i) => (
                <ContactCard key={link.label} {...link} index={i} />
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm"
          >
            {/* Success Toast */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium"
                >
                  <CheckCircle size={16} />
                  <span>Transmission received!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group input-underline">
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-text-muted focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="relative group input-underline">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-text-muted focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="relative group input-underline">
                <input
                  type="text"
                  required
                  placeholder="Subject"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-text-muted focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="relative group input-underline">
                <textarea
                  required
                  rows={4}
                  placeholder="Message"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-text-muted focus:outline-none transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-indigo text-bg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
