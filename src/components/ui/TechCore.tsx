"use client";

import { useMemo } from "react";
import SkillIcon from "@/components/ui/SkillIcon";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";

type TechCoreProps = {
  technologies: string[];
  className?: string;
};

// Key highlighted technologies
const CORE_TECHS_ROW1 = [
  "Next.js", "Wazuh", "YOLOv8", "React", "Python", "Angular 21", "Docker", "Pentesting"
];

const CORE_TECHS_ROW2 = [
  "Spring Boot 3.5", "Laravel 12", "OpenCV", "Scikit-Learn", "TheHive", "Nmap", "Wireshark", "TypeScript"
];

export function TechCore({ technologies, className }: TechCoreProps) {
  // Deduplicate and split technologies list
  const { row1, row2, totalCount } = useMemo(() => {
    const unique = Array.from(new Set(technologies)).filter(Boolean);
    const list = unique.length > 0 ? unique : [...CORE_TECHS_ROW1, ...CORE_TECHS_ROW2];
    
    const mid = Math.ceil(list.length / 2);
    return {
      row1: list.slice(0, mid),
      row2: list.slice(mid),
      totalCount: list.length,
    };
  }, [technologies]);

  return (
    <div className={cn("relative w-full max-w-6xl mx-auto flex flex-col gap-4 select-none", className)}>
      
      {/* ELEGANT VISUAL STACK CONTAINER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface-deep/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 size-80 rounded-full bg-accent/5 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-80 rounded-full bg-purple-500/5 blur-[100px]" />

        {/* HEADER STRIP */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 border-b border-white/10">
          
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent shadow-sm">
              <Code2 className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-text-primary tracking-tight">
                Écosystème & Stack Technique
              </h3>
              <p className="text-xs text-text-muted">
                {totalCount} technologies maîtrisées et déployées en environnement réel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-surface/60 font-mono text-[0.7rem] text-text-secondary">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span>Environnement Production</span>
          </div>

        </div>

        {/* ULTRA-SLOW CONTINUOUS MOTION TRACKS (95s) */}
        <div className="relative z-10 py-5 overflow-hidden">
          
          {/* Edge Fade Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-surface-deep via-surface-deep/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-surface-deep via-surface-deep/80 to-transparent z-20" />

          <div className="flex flex-col gap-3.5">
            
            {/* TRACK 1: Moves Left Ultra Slow (95s) */}
            <div className="flex overflow-hidden">
              <div className="flex shrink-0 items-center gap-3 animate-marquee">
                {[...row1, ...row1, ...row1, ...row1].map((tech, idx) => (
                  <VisualTechCard key={`t1-${tech}-${idx}`} tech={tech} />
                ))}
              </div>
              <div aria-hidden="true" className="flex shrink-0 items-center gap-3 animate-marquee">
                {[...row1, ...row1, ...row1, ...row1].map((tech, idx) => (
                  <VisualTechCard key={`t1-dup-${tech}-${idx}`} tech={tech} />
                ))}
              </div>
            </div>

            {/* TRACK 2: Moves Right Ultra Slow (95s) */}
            <div className="flex overflow-hidden">
              <div className="flex shrink-0 items-center gap-3 animate-marquee-reverse">
                {[...row2, ...row2, ...row2, ...row2].map((tech, idx) => (
                  <VisualTechCard key={`t2-${tech}-${idx}`} tech={tech} />
                ))}
              </div>
              <div aria-hidden="true" className="flex shrink-0 items-center gap-3 animate-marquee-reverse">
                {[...row2, ...row2, ...row2, ...row2].map((tech, idx) => (
                  <VisualTechCard key={`t2-dup-${tech}-${idx}`} tech={tech} />
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER READOUT */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.68rem] text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-blue-400" />
              Cybersécurité & Audit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-purple-400" />
              Intelligence Artificielle
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Full-Stack & DevOps
            </span>
          </div>

          <span className="tracking-wider uppercase opacity-60">
            AMINE NAHLI
          </span>
        </div>

      </div>

    </div>
  );
}

// Clean Glass Technology Badge Component
function VisualTechCard({ tech }: { tech: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-surface/70 px-3.5 py-2 shadow-sm backdrop-blur-md shrink-0">
      <div className="flex size-6 items-center justify-center rounded-lg bg-surface-deep/80 p-1 border border-white/5">
        <SkillIcon name={tech} className="size-4" />
      </div>
      <span className="font-sans text-xs font-semibold text-text-primary tracking-tight whitespace-nowrap">
        {tech}
      </span>
    </div>
  );
}
