"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

function getRandomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function scrambleText(text: string, progress: number): string {
  // progress is 0 to 1
  const revealedLength = Math.floor(text.length * progress);
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (i < revealedLength) {
      result += text[i];
    } else {
      result += getRandomChar();
    }
  }
  return result;
}

export function GlobalLoader() {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("");
  
  // Scramble text effect
  const [targetText, setTargetText] = useState("INITIALIZING SYSTEM...");
  const [textProgress, setTextProgress] = useState(0);

  useEffect(() => {
    // Determine target text based on global progress
    if (progress < 40) {
      setTargetText("INITIALIZING SYSTEM...");
    } else if (progress < 80) {
      setTargetText("BYPASSING SECURITY...");
    } else {
      setTargetText("ACCESS GRANTED.");
    }
  }, [progress]);

  // Scrambling interval
  useEffect(() => {
    const scrambleInterval = setInterval(() => {
      if (textProgress < 1) {
        setTextProgress(p => Math.min(1, p + 0.05));
      }
      setCurrentText(scrambleText(targetText, textProgress));
    }, 50);

    return () => clearInterval(scrambleInterval);
  }, [targetText, textProgress]);

  // Reset text progress when target changes
  useEffect(() => {
    setTextProgress(0);
  }, [targetText]);

  useEffect(() => {
    let animationFrameId: number;

    const checkRealProgress = () => {
      const images = Array.from(document.images);
      const totalImages = images.length;
      const loadedImages = images.filter((img) => img.complete).length;
      
      let baseProgress = 0;
      if (document.readyState === "interactive") baseProgress = 20;
      if (document.readyState === "complete") baseProgress = 60;
      
      const imageProgress = totalImages === 0 ? 40 : (loadedImages / totalImages) * 40;
      
      let finalProgress = baseProgress + imageProgress;
      
      if (document.readyState === "complete" && loadedImages === totalImages) {
        finalProgress = 100;
      }
      
      // Smoothly animate towards finalProgress
      setProgress(current => {
        const next = current + (finalProgress - current) * 0.1;
        
        // If we are super close to 100%, snap to 100%
        if (finalProgress === 100 && next > 99) {
          return 100;
        }
        return next;
      });

      if (finalProgress < 100) {
        animationFrameId = requestAnimationFrame(checkRealProgress);
      } else {
        // Just wait
      }
    };

    // Sometimes events fire fast or already fired
    checkRealProgress();

    // Fallback interval just in case requestAnimationFrame gets stuck
    const fallbackInterval = setInterval(checkRealProgress, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(fallbackInterval);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-bg-page"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05,
        filter: "blur(10px)",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <div className="font-mono flex flex-col items-center gap-6">
        {/* Hacker text decoding */}
        <div 
          className={`text-xl sm:text-2xl font-bold tracking-widest transition-colors duration-300 ${
            progress >= 99 ? "text-accent" : "text-slate-800/70 dark:text-white/70"
          }`}
          style={{ textShadow: progress >= 99 ? "0 0 15px var(--color-accent)" : "none" }}
        >
          {"> " + currentText}
          <span className="animate-pulse ml-1">_</span>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-64 h-[2px] bg-slate-800/10 dark:bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>

        <div className="text-sm font-mono text-accent/50 tracking-[0.2em]">
          {Math.min(100, Math.floor(progress))}%
        </div>
      </div>
    </motion.div>
  );
}
