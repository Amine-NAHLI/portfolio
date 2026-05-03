"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
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

const StatCard = ({ label, value, index }: { label: string; value: string | number; index: number }) => {
  const isNumber = typeof value === "number" || (!isNaN(Number(value)) && !value.toString().includes("/"));
  const numericValue = isNumber ? Number(value.toString().match(/\d+/)?.[0]) : null;
  const suffix = value.toString().replace(/\d+/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative p-6 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h3 className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2">
          {numericValue !== null ? (
            <>
              <Counter value={numericValue} />
              {suffix}
            </>
          ) : (
            value
          )}
        </h3>
        <p className="text-sm font-mono text-text-secondary uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
};

const About = () => {
  const stats = [
    { label: "Projects Shipped", value: 16 },
    { label: "Mission Domains", value: 4 },
    { label: "Languages Spoken", value: "3 (AR/FR/EN)" },
    { label: "Available", value: 2026 },
  ];

  return (
    <section id="about" className="relative py-24 bg-bg overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-accent-cyan font-mono font-bold">// 02</span>
          <div className="h-[1px] w-12 bg-accent-cyan/30" />
          <h2 className="text-2xl font-bold tracking-widest uppercase">About</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Mission Statement (Terminal Style) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-bg-secondary">
              {/* Terminal Header */}
              <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-xs font-mono text-text-muted">MISSION_BRIEF.md</div>
                <div className="w-12" /> {/* spacer */}
              </div>
              
              {/* Terminal Body */}
              <div className="p-8 font-mono text-sm md:text-base leading-relaxed text-text-secondary">
                <p className="mb-6">
                  <span className="text-accent-cyan"># </span>
                  I&apos;m a third-year engineering student turning curiosity into shipped code. 
                  Half my brain runs <span className="text-accent-indigo">nmap</span>, 
                  the other half writes <span className="text-accent-purple">Laravel</span> migrations. 
                  I&apos;ve shipped 16 projects spanning offensive security, full-stack platforms, 
                  computer vision, and robotics.
                </p>
                <p>
                  <span className="text-accent-cyan"># </span>
                  I don&apos;t believe security and product are different jobs. 
                  They&apos;re two sides of the same craft: understanding systems deeply enough to build ones that hold.
                </p>
                <div className="mt-8 flex gap-2">
                  <span className="animate-pulse text-accent-cyan">▋</span>
                </div>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-b border-r border-accent-cyan/20 rounded-xl" />
          </motion.div>

          {/* Right Column: Stat Cards */}
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
