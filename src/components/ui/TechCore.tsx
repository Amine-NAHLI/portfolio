"use client";

import { useMemo } from "react";
import SkillIcon from "@/components/ui/SkillIcon";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type TechCoreProps = {
  technologies: string[];
  className?: string;
};

// Priority badges to add subtle sparkles
const HIGHLIGHT_TECHS = new Set([
  "Next.js", "React", "Python", "Wazuh", "YOLOv8", "Angular 21", "Spring Boot 3.5",
  "Laravel 12", "Docker", "OpenCV", "Scikit-Learn", "TheHive", "Pentesting", "TypeScript"
]);

export function TechCore({ technologies, className }: TechCoreProps) {
  // Clean, unique, and split technologies into two continuous streams
  const { row1, row2 } = useMemo(() => {
    const list = Array.from(new Set(technologies)).filter(Boolean);
    
    // Split into 2 rows for opposite scrolling
    const mid = Math.ceil(list.length / 2);
    const r1 = list.slice(0, mid);
    const r2 = list.slice(mid);

    return {
      row1: r1,
      row2: r2,
    };
  }, [technologies]);

  return (
    <div className={cn("relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4 select-none", className)}>
      
      {/* Left & Right Gradient Edge Fade Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#060709] via-[#060709]/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#060709] via-[#060709]/80 to-transparent z-20" />

      <div className="flex flex-col gap-3.5">
        
        {/* TRACK 1: Moves Left Continuously across full page width */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]">
            {[...row1, ...row1, ...row1, ...row1].map((tech, idx) => (
              <TechBadge key={`r1-${tech}-${idx}`} tech={tech} />
            ))}
          </div>
          <div aria-hidden="true" className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]">
            {[...row1, ...row1, ...row1, ...row1].map((tech, idx) => (
              <TechBadge key={`r1-dup-${tech}-${idx}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* TRACK 2: Moves Right Continuously across full page width */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 items-center gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2, ...row2].map((tech, idx) => (
              <TechBadge key={`r2-${tech}-${idx}`} tech={tech} />
            ))}
          </div>
          <div aria-hidden="true" className="flex shrink-0 items-center gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2, ...row2].map((tech, idx) => (
              <TechBadge key={`r2-dup-${tech}-${idx}`} tech={tech} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// Compact Glass Technology Badge Component
function TechBadge({ tech }: { tech: string }) {
  const isHighlight = HIGHLIGHT_TECHS.has(tech);

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-all duration-300 cursor-pointer shrink-0",
        isHighlight
          ? "border-white/15 bg-surface/80 text-text-primary hover:border-accent/60 hover:bg-surface-raised hover:scale-105 hover:shadow-md hover:shadow-accent/15 hover:text-white"
          : "border-white/10 bg-surface/50 text-text-secondary hover:border-white/30 hover:bg-surface-raised hover:scale-105 hover:text-white"
      )}
    >
      <SkillIcon name={tech} className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
      <span className="font-sans tracking-tight whitespace-nowrap">{tech}</span>
      {isHighlight && (
        <Sparkles className="size-3 text-accent/80 animate-pulse" />
      )}
    </div>
  );
}
