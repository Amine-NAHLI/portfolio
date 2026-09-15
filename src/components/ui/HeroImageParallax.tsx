"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

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
        {/* Inner Bento Card Frame - Pure Portrait Image without text overlays */}
        <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-surface-deep/90">
          <Image
            src="/nahli.png"
            alt={name}
            fill
            className="object-cover object-top scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
            sizes="(max-width: 768px) 100vw, 35vw"
          />
          
          {/* Subtle Bottom Vignette for elegant depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* High-Tech Personal Logo Badge at bottom corner of picture */}
        <motion.div 
          className="absolute -bottom-3 -right-3 z-20 flex size-16 sm:size-20 items-center justify-center rounded-2xl border-2 border-accent/40 bg-surface/90 p-2 shadow-2xl shadow-accent/30 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-accent"
          whileHover={{ scale: 1.12, rotate: 3 }}
        >
          <Image
            src="/logo-light.png"
            alt="Amine Nahli Logo"
            width={64}
            height={64}
            className="size-full object-contain dark:hidden"
          />
          <Image
            src="/logo-dark.png"
            alt="Amine Nahli Logo"
            width={64}
            height={64}
            className="size-full object-contain hidden dark:block"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
