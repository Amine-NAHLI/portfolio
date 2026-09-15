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
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("");
  
  // Scramble text effect
  const [targetText, setTargetText] = useState("INITIALIZING SYSTEM...");
  const [textProgress, setTextProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("portfolio_has_loaded") === "true") {
      setShouldRender(false);
    }
  }, []);

  useEffect(() => {
    // Determine target text based on global progress
    if (progress < 50) {
      setTargetText("CHARGEMENT DU PORTFOLIO...");
    } else if (progress < 90) {
      setTargetText("PRÉPARATION DE L'ÉCOSYSTÈME...");
    } else {
      setTargetText("BIENVENUE.");
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
    let currentSimulated = 0;

    const animateProgress = () => {
      currentSimulated += Math.random() * 3 + 1; // Random increment between 1 and 4
      if (currentSimulated > 100) currentSimulated = 100;

      setProgress(current => {
        const next = current + (currentSimulated - current) * 0.15;
        if (currentSimulated === 100 && next > 99) return 100;
        return next;
      });

      if (currentSimulated < 100) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Ensure it snaps to 100 at the end
        setProgress(100);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!shouldRender) return null;

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
            progress >= 99 ? "text-accent" : "text-text-primary/70"
          }`}
          style={{ textShadow: progress >= 99 ? "0 0 15px var(--color-accent)" : "none" }}
        >
          {"> " + currentText}
          <span className="animate-pulse ml-1">_</span>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-64 h-[2px] bg-text-primary/10 relative overflow-hidden">
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
