"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { GithubIcon } from "@/components/ui/Icons";
import { formatProjectTitle } from "@/lib/utils";
import { Shield, Terminal } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  visible: boolean;
  image_url?: string;
  metrics?: string;
}

const getCategoryStyle = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("cyber") || cat.includes("security") || cat.includes("penetration")) {
    return {
      borderTop: "border-t-2 border-t-red-500",
      badge: "bg-red-500/10 text-red-400 border border-red-500/20",
      dot: "bg-red-400",
      glow: "rgba(239,68,68,0.18)",
      label: "CYBER_SEC",
    };
  }
  if (cat.includes("ai") || cat.includes("machine") || cat.includes("neural") || cat.includes("deep learn")) {
    return {
      borderTop: "border-t-2 border-t-purple-500",
      badge: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      dot: "bg-purple-400",
      glow: "rgba(168,85,247,0.18)",
      label: "NEURAL_NET",
    };
  }
  if (cat.includes("full") || cat.includes("stack")) {
    return {
      borderTop: "border-t-2 border-t-cyan-500",
      badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      dot: "bg-cyan-400",
      glow: "rgba(6,182,212,0.18)",
      label: "FULL_STACK",
    };
  }
  if (cat.includes("mobile")) {
    return {
      borderTop: "border-t-2 border-t-green-500",
      badge: "bg-green-500/10 text-green-400 border border-green-500/20",
      dot: "bg-green-400",
      glow: "rgba(34,197,94,0.18)",
      label: "MOBILE",
    };
  }
  return {
    borderTop: "border-t-2 border-t-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    dot: "bg-yellow-400",
    glow: "rgba(234,179,8,0.18)",
    label: "EXP_LAB",
  };
};

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
  isLarge?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const styles = getCategoryStyle(project.category);
  const num = String(index + 1).padStart(2, "0");
  const tags = project.tags || [];
  const isFeatured = index === 0;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cy * 8, y: -cx * 8, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, active: false });
  }, []);

  if (!mounted) {
    return (
      <div
        className={`rounded-2xl border border-white/5 animate-pulse ${styles.borderTop} ${isFeatured ? "md:row-span-2" : ""}`}
        style={{ background: "rgba(255,255,255,0.02)", minHeight: isFeatured ? 380 : 200 }}
      />
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transition: tilt.active ? "transform 0.08s ease" : "transform 0.4s ease",
        boxShadow: tilt.active
          ? `0 30px 60px -10px ${styles.glow}, 0 0 50px -20px ${styles.glow}`
          : "0 4px 24px -8px rgba(0,0,0,0.4)",
      }}
      className={`group relative rounded-2xl overflow-hidden ${styles.borderTop} h-full`}
    >
      {/* Glassmorphism base */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
      />

      {/* Dynamic border */}
      <div
        className="absolute inset-0 rounded-[inherit] transition-all duration-300"
        style={{
          border: `1px solid ${tilt.active ? "rgba(0,180,216,0.25)" : "rgba(0,180,216,0.08)"}`,
        }}
      />

      {/* Inner top glow on hover */}
      <div
        className="absolute inset-0 rounded-[inherit] transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${styles.glow} 0%, transparent 70%)`,
          opacity: tilt.active ? 1 : 0,
        }}
      />

      {/* Ghost number */}
      <span
        className="absolute bottom-1 right-2 font-black select-none pointer-events-none"
        style={{ fontSize: 120, lineHeight: 0.85, opacity: 0.04, color: "white" }}
      >
        {num}
      </span>

      {/* Content */}
      <div className={`relative z-10 p-6 flex flex-col gap-4 ${isFeatured ? "h-full min-h-[340px]" : "min-h-[200px]"}`}>

        {/* Top: badge + tech dots */}
        <div className="flex items-start justify-between">
          <span className={`px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-widest ${styles.badge}`}>
            {styles.label}
          </span>
          <div className="flex gap-1.5 flex-wrap justify-end max-w-[110px]">
            {tags.slice(0, 5).map((tag, i) => (
              <div
                key={i}
                title={tag}
                className={`w-2 h-2 rounded-full ${styles.dot} animate-pulse`}
                style={{ animationDelay: `${i * 280}ms`, animationDuration: "2.5s" }}
              />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.06]" />

        {/* Title */}
        <h3
          className={`font-black text-white tracking-tight leading-tight transition-colors duration-300 group-hover:text-[#00B4D8] ${
            isFeatured ? "text-2xl md:text-[1.65rem]" : "text-lg md:text-xl"
          }`}
        >
          {formatProjectTitle(project.title)}
        </h3>

        {/* Description */}
        <p className={`text-white/40 text-sm leading-relaxed flex-1 ${isFeatured ? "line-clamp-5" : "line-clamp-3"}`}>
          {project.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Shield size={11} className="text-[#00B4D8]" />
              <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
                Secure_Build
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal size={11} className="text-[#00B4D8]" />
              <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
                CLI_Ready
              </span>
            </div>
          </div>

          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#00B4D8] hover:text-black transition-all duration-300"
            style={tilt.active ? { boxShadow: "0 0 15px rgba(0,180,216,0.5)" } : {}}
          >
            <GithubIcon size={16} />
          </a>
        </div>
      </div>

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
}
