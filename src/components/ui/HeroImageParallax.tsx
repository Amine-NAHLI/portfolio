"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroImageParallax({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  // Move the image inside its container at a different speed than the scroll
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative aspect-[3/4] w-full max-w-sm overflow-hidden p-3 sm:max-w-md">
      {/* Frame corners */}
      <div className="absolute left-0 top-0 size-10 border-l-2 border-t-2 border-accent rounded-tl-xl opacity-80" />
      <div className="absolute right-0 top-0 size-10 border-r-2 border-t-2 border-accent rounded-tr-xl opacity-80" />
      <div className="absolute bottom-0 left-0 size-10 border-b-2 border-l-2 border-accent rounded-bl-xl opacity-80" />
      <div className="absolute bottom-0 right-0 size-10 border-b-2 border-r-2 border-accent rounded-br-xl opacity-80" />
      
      {/* Photo container */}
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface-subtle shadow-2xl">
        <motion.div style={{ y, height: "120%", top: "-10%" }} className="absolute w-full">
          <Image 
            src="/nahli.png" 
            alt={name} 
            fill 
            className="object-cover object-top" 
            priority 
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        </motion.div>
      </div>
    </div>
  );
}
