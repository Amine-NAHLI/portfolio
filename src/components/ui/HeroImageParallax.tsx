"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export default function HeroImageParallax({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX.set(((y - centerY) / centerY) * -6);
    rotateY.set(((x - centerX) / centerX) * 6);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div className="relative flex items-center justify-center w-full max-w-sm sm:max-w-md">
      {/* Ambient Radial Backlight Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -inset-6 rounded-[3.5rem] bg-gradient-to-tr from-accent/30 via-blue-500/15 to-purple-500/10 blur-3xl opacity-80"
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-surface/60 p-2.5 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-accent/40 group"
      >
        {/* Inner Bento Card Frame */}
        <div className="relative flex flex-col h-full w-full overflow-hidden rounded-[1.75rem] bg-surface-deep/90">
          
          {/* Top Status Header Bar inside the card */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[0.7rem] font-medium text-text-secondary">
              <MapPin className="size-3 text-accent" />
              <span>Fès, Maroc</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[0.7rem] font-medium text-accent">
              <GraduationCap className="size-3" />
              <span>4ᵉ Année UPF</span>
            </div>
          </div>

          {/* Portrait Image */}
          <div className="relative flex-1 w-full overflow-hidden">
            <Image
              src="/nahli.png"
              alt={name}
              fill
              className="object-cover object-top scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              sizes="(max-width: 768px) 100vw, 35vw"
            />
            
            {/* Bottom Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>

          {/* Bottom Executive Information Overlay inside the card */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                {name}
                <Sparkles className="size-4 text-accent" />
              </span>
              <span className="inline-flex items-center gap-1 text-[0.68rem] font-mono font-semibold uppercase tracking-wider text-emerald-400 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
                <ShieldCheck className="size-3" />
                IntelTrust PFA
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-snug">
              Ingénierie Logicielle · Cybersécurité · Intelligence Artificielle
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
