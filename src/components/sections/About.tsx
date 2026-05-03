"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

/**
 * Animated counter — counts up from 0 to value when scrolled into view.
 */
const Counter = ({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

/**
 * Single stat card with glass effect and hover lift.
 */
const StatCard = ({
  label,
  value,
  index,
}: {
  label: string;
  value: string | number;
  index: number;
}) => {
  const isNumber = typeof value === "number";
  const numericValue = isNumber ? value : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative p-6 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm group overflow-hidden"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h3 className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2 tabular-nums">
          {numericValue !== null ? (
            <Counter value={numericValue} />
          ) : (
            value
          )}
        </h3>
        <p className="text-sm font-mono text-text-secondary uppercase tracking-wider">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

const About = ({ repoCount = 16 }: { repoCount?: number }) => {
  const stats = [
    { label: "Projects Shipped", value: repoCount },
    { label: "Mission Domains", value: 4 },
    { label: "Languages Spoken", value: "3" },
    { label: "Available", value: 2026 },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-label">// 02 ─ ABOUT</span>
          <div className="h-[1px] flex-1 max-w-20 bg-accent-cyan/20" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT: Terminal-style mission brief */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden border border-white/10 bg-bg-secondary/80 backdrop-blur-sm">
              {/* Terminal Header */}
              <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-xs font-mono text-text-muted">
                  MISSION_BRIEF.md
                </div>
                <div className="w-12" />
              </div>

              {/* Terminal Body */}
              <div className="p-6 md:p-8 font-mono text-sm leading-relaxed text-text-secondary border-l-2 border-accent-cyan/30">
                <p className="mb-6">
                  <span className="text-accent-cyan font-bold"># </span>
                  I&apos;m a third-year engineering student turning curiosity
                  into shipped code. Half my brain runs{" "}
                  <span className="text-accent-indigo font-semibold">nmap</span>,
                  the other half writes{" "}
                  <span className="text-accent-purple font-semibold">
                    Laravel
                  </span>{" "}
                  migrations. I&apos;ve shipped {repoCount} projects spanning
                  offensive security, full-stack platforms, computer vision, and
                  robotics.
                </p>
                <p>
                  <span className="text-accent-cyan font-bold"># </span>
                  I don&apos;t believe security and product are different jobs.
                  They&apos;re two sides of the same craft: understanding systems
                  deeply enough to build ones that hold.
                </p>
                <div className="mt-6 flex items-center gap-1">
                  <span className="text-accent-cyan">❯</span>
                  <span className="animate-pulse text-accent-cyan">▋</span>
                </div>
              </div>
            </div>

            {/* Decoration shadow card */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border border-accent-cyan/10 rounded-xl" />
          </motion.div>

          {/* RIGHT: Stat Cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
