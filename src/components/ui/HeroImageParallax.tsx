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
      {/* Frame corners that glow */}
      <div className="absolute left-0 top-0 size-10 border-l-2 border-t-2 border-accent rounded-tl-xl opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_15px_var(--color-accent)] transition-all duration-300" />
      <div className="absolute right-0 top-0 size-10 border-r-2 border-t-2 border-accent rounded-tr-xl opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_15px_var(--color-accent)] transition-all duration-300" />
      <div className="absolute bottom-0 left-0 size-10 border-b-2 border-l-2 border-accent rounded-bl-xl opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_15px_var(--color-accent)] transition-all duration-300" />
      <div className="absolute bottom-0 right-0 size-10 border-b-2 border-r-2 border-accent rounded-br-xl opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_15px_var(--color-accent)] transition-all duration-300" />
      
      {/* Magnetic Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-20 mix-blend-screen"
        style={{ background }}
      />
      
      {/* Photo container */}
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface-subtle shadow-2xl" style={{ transform: "translateZ(30px)" }}>
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
