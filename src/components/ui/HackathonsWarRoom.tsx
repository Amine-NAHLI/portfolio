"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Zap,
  Terminal,
  Camera,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { Locale } from "@/i18n/config";
import type { JourneyTimelineItem } from "@/types/journey";
import { DEFAULT_HACKATHONS } from "@/types/journey";

interface HackathonsWarRoomProps {
  locale: Locale;
  items?: JourneyTimelineItem[];
}

export default function HackathonsWarRoom({ locale, items }: HackathonsWarRoomProps) {
  const rawList = items && items.length > 0 ? items : DEFAULT_HACKATHONS;
  const enabledList = rawList.filter((it) => it.enabled !== false);
  const baseList = enabledList.length > 0 ? enabledList : rawList;

  // Filter for hackathons/competitions if mixed
  const hackathons = baseList.some(
    (it) =>
      it.categoryLabel?.toLowerCase().includes("compétition") ||
      it.categoryLabel?.toLowerCase().includes("robotique") ||
      it.id?.includes("hackathon") ||
      it.award !== undefined
  )
    ? baseList.filter(
        (it) =>
          it.categoryLabel?.toLowerCase().includes("compétition") ||
          it.categoryLabel?.toLowerCase().includes("robotique") ||
          it.id?.includes("hackathon") ||
          it.award !== undefined ||
          it.type === "experience"
      )
    : baseList;

  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [activeModalItem, setActiveModalItem] = useState<JourneyTimelineItem | null>(null);
  
  // Track active photo index per card (Instagram Carousel)
  const [cardPhotoIndices, setCardPhotoIndices] = useState<Record<string, number>>({});
  // Track active photo index in the opened detail modal
  const [modalPhotoIndex, setModalPhotoIndex] = useState<number>(0);

  const getCardPhotoIndex = (cardId: string) => cardPhotoIndices[cardId] || 0;

  const nextPhoto = (cardId: string, total: number) => {
    setCardPhotoIndices((prev) => ({
      ...prev,
      [cardId]: ((prev[cardId] || 0) + 1) % total,
    }));
  };

  const prevPhoto = (cardId: string, total: number) => {
    setCardPhotoIndices((prev) => ({
      ...prev,
      [cardId]: ((prev[cardId] || 0) - 1 + total) % total,
    }));
  };

  const setPhoto = (cardId: string, index: number) => {
    setCardPhotoIndices((prev) => ({
      ...prev,
      [cardId]: index,
    }));
  };

  return (
    <div className="w-full space-y-3">
      {/* Cards Row: Fluid Horizontal Snap on Mobile + Kinetic Hover Expansion on Desktop */}
      <div className="relative flex flex-row gap-3 sm:gap-4 w-full h-[470px] sm:h-[520px] lg:h-[590px] overflow-x-auto md:overflow-visible snap-x snap-mandatory px-4 sm:px-6 md:px-0 -mx-4 sm:-mx-6 md:mx-0 pb-3 md:pb-0 scrollbar-none select-none scroll-smooth">
        {hackathons.map((hackathon, idx) => {
          const isExpanded = idx === hoveredIndex;
          const title =
            locale === "fr" ? hackathon.title : hackathon.titleEn || hackathon.title;
          const award =
            locale === "fr" ? hackathon.award : hackathon.awardEn || hackathon.award;
          const images = hackathon.images || [];

          const currentPhotoIdx = getCardPhotoIndex(hackathon.id);
          const activeImage = images[currentPhotoIdx] || images[0] || null;

          const accentColor =
            hackathon.awardColor ||
            (hackathon.award?.includes("1")
              ? "#38BDF8"
              : hackathon.award?.includes("3")
              ? "#F59E0B"
              : "#38BDF8");

          // Framing and fit options configured in Admin
          const imageFit = hackathon.imageFit || "cover";
          const imagePosition = hackathon.imagePosition || "center";

          return (
            <motion.div
              key={hackathon.id}
              layout
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => {
                setHoveredIndex(idx);
                setModalPhotoIndex(currentPhotoIdx);
                setActiveModalItem(hackathon);
              }}
              className={`group relative rounded-[26px] sm:rounded-[32px] overflow-hidden border border-white/10 bg-[#0d0e12] transition-colors duration-500 cursor-pointer snap-center shrink-0 md:shrink ${
                isExpanded
                  ? "w-[82vw] sm:w-[72vw] md:w-auto md:flex-[3.2] lg:flex-[4] shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-white/25"
                  : "w-[82vw] sm:w-[72vw] md:w-auto md:flex-1 md:min-w-[125px] lg:min-w-[145px] opacity-85 md:opacity-75 hover:opacity-100"
              }`}
            >
              {/* Photo Background (Full Bleed with customizable framing and fit) */}
              {activeImage ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      objectFit: imageFit,
                      objectPosition: imagePosition,
                    }}
                    className={`absolute inset-0 size-full contrast-110 transition-transform duration-700 ease-out group-hover:scale-105 ${
                      isExpanded ? "grayscale-0" : "grayscale contrast-110"
                    }`}
                  />
                </AnimatePresence>
              ) : (
                // Stylized Monochrome Darkroom Slate when image is empty (ready for admin)
                <div className="absolute inset-0 size-full bg-gradient-to-b from-[#181920] via-[#101116] to-[#07080a] flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                  <div className="relative size-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-colors">
                    <Camera className="size-6" />
                  </div>
                  <span className="relative font-mono text-[10px] uppercase tracking-widest text-white/40 mt-3 group-hover:text-white/70 transition-colors">
                    {locale === "fr" ? "Cliché en attente" : "Photo pending"}
                  </span>
                </div>
              )}

              {/* Ambient Dark Vignette & Bottom Gradient for clean text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 pointer-events-none" />

              {/* Top Left Badge: "HACKATHON & EVENT" */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-sm">
                  <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
                    HACKATHON & EVENT
                  </span>
                </div>
              </div>

              {/* Top Right: Instagram Multi-Photo Counter or Single Badge */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-2">
                {images.length > 1 ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10.5px] font-mono font-bold text-white/90 shadow-sm">
                    <Layers className="size-3 text-cyan-400" />
                    <span>
                      {currentPhotoIdx + 1}/{images.length}
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] font-bold text-white/40 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Instagram Carousel Navigation Arrows (desktop hover or mobile tap) */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevPhoto(hackathon.id, images.length);
                    }}
                    aria-label="Photo précédente"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 size-9 sm:size-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black flex items-center justify-center opacity-90 md:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextPhoto(hackathon.id, images.length);
                    }}
                    aria-label="Photo suivante"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 size-9 sm:size-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black flex items-center justify-center opacity-90 md:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}

              {/* Instagram-style Carousel Pagination Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-20 sm:bottom-24 inset-x-0 z-30 flex items-center justify-center gap-1.5 pointer-events-auto">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhoto(hackathon.id, dotIdx);
                      }}
                      className={`transition-all rounded-full cursor-pointer ${
                        dotIdx === currentPhotoIdx
                          ? "w-5 h-1.5 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                          : "size-1.5 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Bottom Caption: Vertical Colored Bar + Title */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 lg:p-7 flex flex-col justify-end">
                <div className="flex items-center min-w-0">
                  {/* Vertical Accent Bar */}
                  <span
                    className="w-1 h-4 sm:h-5 rounded-full shrink-0 mr-2.5 sm:mr-3 transition-transform group-hover:scale-y-110"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 12px ${accentColor}90`,
                    }}
                  />

                  {/* Title */}
                  <h3
                    className={`font-sans text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight leading-snug ${
                      isExpanded ? "line-clamp-2" : "truncate"
                    }`}
                    title={title}
                  >
                    {title}
                  </h3>
                </div>

                {/* Expanded Details Sub-line (fades in on expanded card) */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-2.5 flex flex-wrap items-center gap-2 pl-3.5 sm:pl-4 text-xs font-mono text-white/70"
                  >
                    <span className="text-white/90 font-medium">
                      {hackathon.organization}
                    </span>
                    {award && (
                      <>
                        <span className="text-white/30">·</span>
                        <span
                          className="px-2 py-0.5 rounded font-bold text-[10px]"
                          style={{
                            color: accentColor,
                            backgroundColor: `${accentColor}18`,
                          }}
                        >
                          {award}
                        </span>
                      </>
                    )}
                    <span className="text-white/30">·</span>
                    <span className="text-white/50">{hackathon.year}</span>

                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline">
                      <span>{locale === "fr" ? "Détails" : "Details"}</span>
                      <ArrowUpRight className="size-3" />
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Swipe Helper Hint */}
      <div className="flex md:hidden items-center justify-center gap-2 text-[11px] font-mono text-white/40 pt-1">
        <span>Glissez horizontalement pour naviguer</span>
        <ChevronRight className="size-3.5 animate-pulse" />
      </div>

      {/* Detail Modal / Drawer (Full multi-photo gallery & engineering dossier) */}
      <AnimatePresence>
        {activeModalItem && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/15 bg-[#0e0f14] p-6 sm:p-8 shadow-2xl text-left space-y-6 scrollbar-thin scrollbar-thumb-white/10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-5 right-5 z-20 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-mono text-xs font-semibold">
                  <span>HACKATHON & EVENT</span>
                  <span>·</span>
                  <span>{activeModalItem.year}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {locale === "fr" ? activeModalItem.title : activeModalItem.titleEn || activeModalItem.title}
                </h3>
                <p className="font-mono text-xs text-white/60">
                  {locale === "fr" ? "Organisé par :" : "Organized by:"}{" "}
                  <strong className="text-white">{activeModalItem.organization}</strong> — {activeModalItem.location}
                </p>
              </div>

              {/* Photo View / Multi-photo Instagram Carousel in Modal */}
              {activeModalItem.images && activeModalItem.images.length > 0 && (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeModalItem.images[modalPhotoIndex] || activeModalItem.images[0]}
                      alt="Photo hackathon HD"
                      decoding="async"
                      className="size-full object-contain"
                    />

                    {/* Modal Arrows */}
                    {activeModalItem.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setModalPhotoIndex(
                              (prev) => (prev - 1 + activeModalItem.images!.length) % activeModalItem.images!.length
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black"
                        >
                          <ChevronLeft className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setModalPhotoIndex((prev) => (prev + 1) % activeModalItem.images!.length)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black"
                        >
                          <ChevronRight className="size-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Modal Thumbnails Strip */}
                  {activeModalItem.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {activeModalItem.images.map((img, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => setModalPhotoIndex(tIdx)}
                          className={`relative size-16 rounded-xl border overflow-hidden shrink-0 transition-all cursor-pointer ${
                            tIdx === modalPhotoIndex
                              ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-105"
                              : "border-white/10 opacity-60 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Miniature ${tIdx + 1}`} className="size-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 48H Sprint Challenge & Shipped Prototype */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                      {locale === "fr" ? "// Défi 48H Imposé" : "// 48H Sprint Challenge"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                    {locale === "fr"
                      ? activeModalItem.challenge
                      : activeModalItem.challengeEn || activeModalItem.challenge}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {locale === "fr" ? "// Prototype Livré" : "// Shipped Prototype"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                    {locale === "fr"
                      ? activeModalItem.solution
                      : activeModalItem.solutionEn || activeModalItem.solution}
                  </p>
                </div>
              </div>

              {/* Tech Stack & Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-white/40 uppercase">Stack :</span>
                  {activeModalItem.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-white/80"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {activeModalItem.githubUrl && (
                  <a
                    href={activeModalItem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-white hover:text-black transition-all"
                  >
                    <GithubIcon className="size-4" />
                    <span>{locale === "fr" ? "Voir le Code" : "Source Code"}</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
