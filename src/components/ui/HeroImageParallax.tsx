"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export default function HeroImageParallax({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

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
    
    rotateX.set(((y - centerY) / centerY) * -10);
    rotateY.set(((x - centerX) / centerX) * 10);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const background = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(56, 189, 248, 0.4), transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 0 }}
      animate={{ y: [-8, 8, -8] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative aspect-[3/4] w-full max-w-sm overflow-hidden p-3 sm:max-w-md group"
    >
      {/* Cyber HUD Overlay */}
      <div className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 opacity-60 group-hover:opacity-100" style={{ transform: "translateZ(40px)" }}>
        {/* Top Left Bracket */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent" />
        <div className="absolute top-0 left-0 w-4 h-1 bg-accent" />
        <div className="absolute top-0 left-0 w-1 h-4 bg-accent" />
        
        {/* Top Right Bracket with chamfer illusion */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-accent animate-pulse" />
        
        {/* Bottom Left with Tech Text */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent" />
        <div className="absolute bottom-2 left-3 text-[0.55rem] font-mono text-accent leading-none opacity-80">
          SYS.01<br/>RDY
        </div>
        
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent" />
        
        {/* Target Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-24 border border-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150 group-hover:scale-100 flex items-center justify-center">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent/40" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-accent/40" />
          <div className="size-1.5 bg-accent/80 rounded-full" />
        </div>

        {/* Scanning line */}
        <motion.div 
          className="absolute left-0 right-0 h-0.5 bg-accent/60 shadow-[0_0_8px_var(--color-accent)] opacity-0 group-hover:opacity-100"
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        />
      </div>
      
      {/* Magnetic Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20 mix-blend-screen"
        style={{ background, clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
      />
      
      {/* Photo container */}
      <div 
        className="relative h-full w-full overflow-hidden bg-surface-subtle shadow-2xl transition-all duration-500" 
        style={{ 
          transform: "translateZ(30px)",
          clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)"
        }}
      >
        <motion.div style={{ y: yParallax, height: "120%", top: "-10%" }} className="absolute w-full">
          <Image 
            src="/nahli.png" 
            alt={name} 
            fill 
            className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out" 
            priority 
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
