"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Glasses } from "lucide-react";

export default function FlashbangOverlay() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleFlashbang = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsActive(true);

      // Play the CS:GO flashbang sound effect
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/flashbang-cs_qoRhxLn.mp3");
          audioRef.current.volume = 0.85;
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch {
        // audio fallback
      }

      // Exactly 5 seconds as requested by the user
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 5000);
    };

    window.addEventListener("flashbang_trigger", handleFlashbang);

    return () => {
      window.removeEventListener("flashbang_trigger", handleFlashbang);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-white animate-flashbang text-neutral-900 select-none cursor-default"
      style={{
        animation: "flashbangFade 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      }}
    >
      <style jsx global>{`
        @keyframes flashbangFade {
          0% {
            opacity: 1;
            filter: brightness(2) contrast(1.5);
          }
          15% {
            opacity: 1;
            filter: brightness(1.6);
          }
          65% {
            opacity: 0.95;
            filter: brightness(1.1);
          }
          100% {
            opacity: 0;
            pointer-events: none;
          }
        }
      `}</style>

      {/* Funny Flashbang Content */}
      <div className="flex flex-col items-center text-center max-w-md p-6 rounded-3xl bg-black/90 text-white border-2 border-accent shadow-[0_0_80px_rgba(200,241,34,0.6)] backdrop-blur-xl">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/20 border border-accent/40 mb-4 animate-bounce">
          <Glasses className="size-9 text-accent" />
        </div>

        <div className="font-mono text-xs font-bold text-accent tracking-widest uppercase mb-2">
          {isEn ? "⚡ TACTICAL FLASHBANG DEPLOYED ⚡" : "⚡ GRENADE FLASHBANG DÉPLOYÉE ⚡"}
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          {isEn ? "MY EYES! 😵" : "MES YEUX ! 😵"}
        </h2>

        <p className="mt-3 text-sm text-neutral-300 leading-relaxed font-medium">
          {isEn
            ? "Stop spamming the light switch! You think Amine doesn't pay the electricity bill?! 😂"
            : "Arrête de jouer avec l'interrupteur ! Tu crois qu'Amine ne paye pas la facture d'électricité ?! 😂"}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-mono text-neutral-300">
          <span>{isEn ? "Recovery in progress (5s)..." : "Rétablissement de la vue (5s)..."}</span>
        </div>
      </div>
    </div>
  );
}
