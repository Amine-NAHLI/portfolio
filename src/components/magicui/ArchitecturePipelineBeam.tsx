"use client";

import { useRef } from "react";
import { Shield, Cpu, Layers, Server, Globe, Lock, Database, Radio, Sparkles } from "lucide-react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import type { Locale } from "@/i18n/config";

interface ArchitecturePipelineBeamProps {
  locale: Locale;
  trackId: "cyber" | "soft" | "ai" | string;
}

export function ArchitecturePipelineBeam({ locale, trackId }: ArchitecturePipelineBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);

  // Define configs per track
  const trackConfig = {
    cyber: {
      colorStart: "#10B981",
      colorEnd: "#38BDF8",
      node1: { label: "Client Ingress", icon: Globe, sub: "TCP / TLS" },
      node2: { label: "Scapy Forensics", icon: Radio, sub: "Deep Inspection" },
      node3: { label: "Zero-Trust IAM", icon: Lock, sub: "Auth & Policies" },
      node4: { label: "Protected Server", icon: Server, sub: "Hardened OS" },
    },
    ai: {
      colorStart: "#A855F7",
      colorEnd: "#C8F122",
      node1: { label: "Video Feed", icon: Globe, sub: "Frame Capture" },
      node2: { label: "MediaPipe", icon: Cpu, sub: "Landmark Vector" },
      node3: { label: "Gemma Model", icon: Sparkles, sub: "Edge Inference" },
      node4: { label: "Action Output", icon: Server, sub: "Real-time Telemetry" },
    },
    soft: {
      colorStart: "#38BDF8",
      colorEnd: "#C8F122",
      node1: { label: "Next.js UI", icon: Globe, sub: "Client State" },
      node2: { label: "API Gateway", icon: Layers, sub: "Microservices" },
      node3: { label: "Postgres RLS", icon: Database, sub: "Row Security" },
      node4: { label: "Encrypted Edge", icon: Server, sub: "High Availability" },
    },
  }[trackId as "cyber" | "ai" | "soft"] || {
    colorStart: "#C8F122",
    colorEnd: "#38BDF8",
    node1: { label: "Input", icon: Globe, sub: "Telemetry" },
    node2: { label: "Engine", icon: Cpu, sub: "Logic" },
    node3: { label: "Security", icon: Lock, sub: "Verified" },
    node4: { label: "Output", icon: Server, sub: "Outcome" },
  };

  const Node1Icon = trackConfig.node1.icon;
  const Node2Icon = trackConfig.node2.icon;
  const Node3Icon = trackConfig.node3.icon;
  const Node4Icon = trackConfig.node4.icon;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-between rounded-2xl border border-border bg-surface-raised/90 p-4 sm:p-5 overflow-hidden shadow-inner select-none"
    >
      {/* Node 1 */}
      <div
        ref={node1Ref}
        className="z-10 flex flex-col items-center justify-center text-center"
      >
        <div className="flex size-10 sm:size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-primary shadow-sm">
          <Node1Icon className="size-4 sm:size-5 text-accent" />
        </div>
        <span className="mt-1.5 font-mono text-[10px] sm:text-xs font-semibold text-text-primary">
          {trackConfig.node1.label}
        </span>
        <span className="font-mono text-[9px] text-text-muted">
          {trackConfig.node1.sub}
        </span>
      </div>

      {/* Node 2 */}
      <div
        ref={node2Ref}
        className="z-10 flex flex-col items-center justify-center text-center"
      >
        <div className="flex size-10 sm:size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-primary shadow-sm">
          <Node2Icon className="size-4 sm:size-5 text-text-primary" />
        </div>
        <span className="mt-1.5 font-mono text-[10px] sm:text-xs font-semibold text-text-primary">
          {trackConfig.node2.label}
        </span>
        <span className="font-mono text-[9px] text-text-muted">
          {trackConfig.node2.sub}
        </span>
      </div>

      {/* Node 3 */}
      <div
        ref={node3Ref}
        className="z-10 flex flex-col items-center justify-center text-center"
      >
        <div className="flex size-10 sm:size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-primary shadow-sm">
          <Node3Icon className="size-4 sm:size-5 text-text-primary" />
        </div>
        <span className="mt-1.5 font-mono text-[10px] sm:text-xs font-semibold text-text-primary">
          {trackConfig.node3.label}
        </span>
        <span className="font-mono text-[9px] text-text-muted">
          {trackConfig.node3.sub}
        </span>
      </div>

      {/* Node 4 */}
      <div
        ref={node4Ref}
        className="z-10 flex flex-col items-center justify-center text-center"
      >
        <div className="flex size-10 sm:size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-primary shadow-sm">
          <Node4Icon className="size-4 sm:size-5 text-accent" />
        </div>
        <span className="mt-1.5 font-mono text-[10px] sm:text-xs font-semibold text-text-primary">
          {trackConfig.node4.label}
        </span>
        <span className="font-mono text-[9px] text-text-muted">
          {trackConfig.node4.sub}
        </span>
      </div>

      {/* Animated Energy Beams (Magic UI) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node1Ref}
        toRef={node2Ref}
        duration={3}
        gradientStartColor={trackConfig.colorStart}
        gradientStopColor={trackConfig.colorEnd}
        startYOffset={-14}
        endYOffset={-14}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node2Ref}
        toRef={node3Ref}
        duration={3}
        delay={0.8}
        gradientStartColor={trackConfig.colorStart}
        gradientStopColor={trackConfig.colorEnd}
        startYOffset={-14}
        endYOffset={-14}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node3Ref}
        toRef={node4Ref}
        duration={3}
        delay={1.6}
        gradientStartColor={trackConfig.colorStart}
        gradientStopColor={trackConfig.colorEnd}
        startYOffset={-14}
        endYOffset={-14}
      />
    </div>
  );
}
