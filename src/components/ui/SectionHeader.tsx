"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  number: string;
  label: string;
  heading: React.ReactNode;
  subheading?: string;
}

const SectionHeader = ({ number, label, heading, subheading }: SectionHeaderProps) => (
  <div className="mb-16">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-baseline gap-3 mb-4"
    >
      <span className="section-label">{number}</span>
      <span className="h-px w-16 bg-accent-cyan/20 inline-block" />
      <span className="section-label">{label}</span>
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary mb-4"
    >
      {heading}
    </motion.h2>

    {subheading && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="text-lg text-text-secondary max-w-2xl"
      >
        {subheading}
      </motion.p>
    )}
  </div>
);

export default SectionHeader;
