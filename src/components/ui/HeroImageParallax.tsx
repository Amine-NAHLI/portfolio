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
      <div className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 opacity-80 group-hover:opacity-100" style={{ transform: "translateZ(40px)" }}>
        
        {/* Precise SVG HUD tracing the chamfered corners */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-accent overflow-visible">
          {/* Top-Left Chamfer Bracket */}
          <path d="M 0 35 L 0 15 L 15 0 L 35 0" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M 0 15 L 15 0" fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" className="opacity-50" />
          
          {/* Bottom-Right Chamfer Bracket */}
          <path d="M 100 65 L 100 85 L 85 100 L 65 100" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M 100 85 L 85 100" fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" className="opacity-50" />
          
          {/* Top-Right Simple Bracket */}
          <path d="M 80 0 L 100 0 L 100 20" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <rect x="96" y="4" width="4" height="4" fill="currentColor" className="animate-pulse" />
          
          {/* Bottom-Left Simple Bracket */}
          <path d="M 0 80 L 0 100 L 20 100" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          
          {/* Side ticks / scales */}
          <path d="M 0 45 L 3 45 M 0 50 L 5 50 M 0 55 L 3 55" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M 100 45 L 97 45 M 100 50 L 95 50 M 100 55 L 97 55" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Tech Text Data Overlays */}
        <div className="absolute top-4 left-6 text-[0.55rem] font-mono text-accent leading-tight opacity-70 tracking-widest hidden sm:block">
          STATUS: <span className="text-white">ONLINE</span><br/>
          UPLINK: <span className="text-white">STABLE</span>
        </div>
        
        <div className="absolute bottom-4 left-6 text-[0.55rem] font-mono text-accent leading-none opacity-90 tracking-widest">
          SYS.01 // <span className="animate-pulse">REC</span>
        </div>
        
        {/* Target Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 border-[0.5px] border-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-[1.5] group-hover:scale-100 flex items-center justify-center">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent/40" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-accent/40" />
          {/* Center dot */}
          <div className="size-1.5 bg-accent rounded-full" />
          {/* Inner dashed ring */}
          <div className="absolute inset-4 border border-dashed border-accent/30 rounded-full animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Scanning line confined to a container that matches the image shape */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}>
          <motion.div 
            className="absolute left-0 right-0 h-0.5 bg-accent/50 shadow-[0_0_12px_var(--color-accent)] opacity-0 group-hover:opacity-100"
            initial={{ top: "-10%" }}
            animate={{ top: ["-10%", "110%", "-10%"] }}
            transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
          />
        </div>
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
