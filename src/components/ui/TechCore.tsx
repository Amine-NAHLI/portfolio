"use client";

import { useMemo, useState } from "react";
import SkillIcon from "@/components/ui/SkillIcon";
import { cn } from "@/lib/utils";

type TechCoreProps = {
  technologies: string[];
  className?: string;
};

export function TechCore({ technologies, className }: TechCoreProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const isHovered = activeTech !== null;

  // Pre-calculate orbits to distribute the technologies
  // We'll put them on 3 different orbital rings
  const orbits = useMemo(() => {
    const sorted = [...technologies].sort();
    const ringCount = Math.min(3, Math.max(1, Math.ceil(sorted.length / 8))); // dynamically adjust ring count based on items
    const rings: string[][] = Array.from({ length: ringCount }, () => []);
    
    // Distribute evenly among the rings
    sorted.forEach((tech, index) => {
      rings[index % ringCount].push(tech);
    });

    return rings;
  }, [technologies]);

  const ringRadiuses = [120, 190, 260]; // in pixels
  const ringSpeeds = [25, 35, 50]; // in seconds for a full orbit

  return (
    <div className={cn("relative flex h-[350px] sm:h-[500px] md:h-[600px] w-full max-w-4xl mx-auto items-center justify-center overflow-hidden", className)}>
      <div className="absolute inset-0 flex items-center justify-center scale-[0.6] sm:scale-[0.8] md:scale-100 origin-center">
        {/* Background glow for the core */}
        <div className="absolute inset-0 bg-accent/5 rounded-full blur-[100px] pointer-events-none scale-75" />

        {/* The Core (Singularity) */}
        <div className="relative z-10 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-surface-raised shadow-[0_0_80px_rgba(var(--color-accent-rgb),0.3)] border border-accent/30 backdrop-blur-xl">
          {/* Core pulsing animation */}
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/40 to-transparent animate-spin-slow opacity-50" style={{ animationPlayState: isHovered ? 'paused' : 'running' }} />
          <span className="relative z-20 font-display text-xl sm:text-2xl font-bold tracking-wider text-text-primary">
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">AN</span>
          </span>
        </div>

      {/* Orbits */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {orbits.map((ringTechs, ringIndex) => {
          const radius = ringRadiuses[ringIndex];
          const speed = ringSpeeds[ringIndex];
          const isReverse = ringIndex % 2 !== 0;

          return (
            <div 
              key={ringIndex}
              className="absolute rounded-full border border-border-strong/20 transition-opacity duration-300"
              style={{
                width: radius * 2,
                height: radius * 2,
                opacity: isHovered ? 0.4 : 1,
              }}
            >
              <div 
                className={cn("w-full h-full animate-orbit pointer-events-none", isReverse && "animate-orbit-reverse")}
                style={{
                  animationDuration: `${speed}s`,
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              >
                {ringTechs.map((tech, techIndex) => {
                  const angle = (techIndex / ringTechs.length) * 360;
                  return (
                    <div
                      key={tech}
                      className={cn("absolute inset-0 m-auto flex items-center justify-center w-0 h-0", activeTech === tech ? "z-[100]" : "hover:z-[100]")}
                      style={{
                        transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                      }}
                      onMouseEnter={() => setActiveTech(tech)}
                      onMouseLeave={() => setActiveTech(null)}
                      onTouchStart={() => setActiveTech(tech)}
                      onTouchEnd={() => setActiveTech(null)}
                      onTouchCancel={() => setActiveTech(null)}
                    >
                      <div 
                        className={cn("animate-orbit-counter pointer-events-auto", isReverse && "animate-orbit-counter-reverse")}
                        style={{ 
                          animationDuration: `${speed}s`,
                          animationPlayState: isHovered ? 'paused' : 'running',
                        }}
                      >
                        <div className={cn("relative flex items-center justify-center transition-transform duration-300 z-10", activeTech === tech ? "scale-150 z-[100]" : "scale-100 hover:z-[100]")}>
                          <SkillIcon name={tech} className={cn("text-[40px] sm:text-5xl rounded-full bg-surface-raised shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-10", activeTech === tech ? "ring-2 ring-accent shadow-[0_0_30px_rgba(56,189,248,0.8)]" : "ring-1 ring-border-strong/50")} />
                          <div className={cn("absolute -top-14 transition-opacity whitespace-nowrap px-4 py-2 rounded-lg text-sm font-black pointer-events-none z-[100] border-2", activeTech === tech ? "opacity-100 bg-accent text-bg-page border-accent-light shadow-[0_0_20px_rgba(56,189,248,0.6)]" : "opacity-0 bg-bg-page text-text-primary border-border-strong shadow-2xl")}>
                            {tech}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
