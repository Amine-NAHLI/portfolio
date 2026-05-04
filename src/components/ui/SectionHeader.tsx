"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  number: string;
  label: string;
  heading: React.ReactNode;
  subheading?: string;
}

const VP = { once: true, margin: "-100px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const SectionHeader = ({ number, label, heading, subheading }: SectionHeaderProps) => (
  <div className="mb-16">
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VP}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex items-center gap-3 mb-5"
    >
      <span className="section-label">{number}</span>
      <span className="h-px w-12 bg-accent-cyan/25" aria-hidden="true" />
      <span className="section-label">{label}</span>
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, delay: 0.07, ease: EASE }}
      className="font-semibold tracking-[-0.03em] leading-[1.05] text-text-primary mb-4"
      style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
    >
      {heading}
    </motion.h2>

    {subheading && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5, delay: 0.14, ease: EASE }}
        className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed"
      >
        {subheading}
      </motion.p>
    )}
  </div>
);

export default SectionHeader;
