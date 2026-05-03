"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import HeroScene from "@/components/three/HeroScene";
import Link from "next/link";
import { cn } from "@/lib/utils";

const roles = [
  "Amine Nahli.",
  "a security engineer.",
  "a full-stack builder.",
  "a problem solver.",
];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, typingSpeed]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      {/* 3D Scene Background */}
      <HeroScene />
      
      {/* Overlay Grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      {/* Radial Gradient for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,7,18,0.8)_100%)] pointer-events-none" />

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 z-10 text-center"
      >
        {/* Status Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-accent-cyan">
            AVAILABLE FOR OPPORTUNITIES
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          I'm{" "}
          <span className={cn(
            "gradient-text",
            roleIndex === 0 ? "inline" : "text-white"
          )}>
            {roleIndex === 0 ? displayText : ""}
          </span>
          {roleIndex !== 0 && (
            <span className="text-white">
              {displayText}
            </span>
          )}
          <span className="inline-block w-[2px] h-[0.8em] bg-accent-cyan ml-1 animate-pulse" />
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          I break things to understand them — then I build better ones.
          <br className="hidden md:block" />
          Security engineer & full-stack developer based in Morocco.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#projects"
            className="group relative px-8 py-4 rounded-xl bg-accent-cyan text-bg-secondary font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <span className="relative z-10">View Work</span>
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white font-bold transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
          >
            Get in Touch
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] text-text-muted uppercase">Scroll</span>
        <ChevronDown className="text-accent-cyan" size={20} />
      </motion.div>
    </section>
  );
};

export default Hero;
