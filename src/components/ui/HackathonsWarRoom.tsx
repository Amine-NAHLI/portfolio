"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Zap,
  Terminal,
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
  const hackathonsFiltered = baseList.some(
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

  const hackathons = hackathonsFiltered.length > 0 ? hackathonsFiltered : DEFAULT_HACKATHONS;

  // Thematic image resolver ensuring authentic HD photographs are always visible
  const getResolvedImages = (hackathon: JourneyTimelineItem, idx: number): string[] => {
    if (hackathon.images && hackathon.images.length > 0) {
      const valid = hackathon.images.filter((img) => img && img.trim() !== "");
      if (valid.length > 0) return valid;
    }

    const idLower = (hackathon.id || "").toLowerCase();
    const titleLower = (hackathon.title || "").toLowerCase();

    if (idLower.includes("cursor") || titleLower.includes("cursor")) {
      return [
        "https://vyjlvjrrtttyqaaafkub.supabase.co/storage/v1/object/public/projects/blogs/1788388400675-lygakdn1ka.png",
      ];
    }
    if (idLower.includes("gemma") || titleLower.includes("gemma") || titleLower.includes("ia")) {
      return [
        "https://vyjlvjrrtttyqaaafkub.supabase.co/storage/v1/object/public/projects/images/1787344204839-f4b0iauozgm.png",
      ];
    }
    if (idLower.includes("robot") || titleLower.includes("robot") || titleLower.includes("upf")) {
      return [
        "https://vyjlvjrrtttyqaaafkub.supabase.co/storage/v1/object/public/projects/blogs/1788388400675-lygakdn1ka.png",
      ];
    }

    const fallbacks = [
      "https://vyjlvjrrtttyqaaafkub.supabase.co/storage/v1/object/public/projects/blogs/1788388400675-lygakdn1ka.png",
      "https://vyjlvjrrtttyqaaafkub.supabase.co/storage/v1/object/public/projects/images/1787344204839-f4b0iauozgm.png",
    ];
    return [fallbacks[idx % fallbacks.length]];
  };

  // State: Modal dossier & hover kinetic expansion
  const [activeModalItem, setActiveModalItem] = useState<JourneyTimelineItem | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Conteneur Flex interactif divisé à parts égales par défaut, avec expansion cinétique au survol */}
      <div
        className="w-full flex flex-col md:flex-row gap-5 sm:gap-6 items-stretch md:min-h-[480px] lg:h-[520px]"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {hackathons.map((hackathon, idx) => {
          const images = getResolvedImages(hackathon, idx);
          const photo = images[0];
          const hTitle = locale === "fr" ? hackathon.title : hackathon.titleEn || hackathon.title;
          const hAward = locale === "fr" ? hackathon.award : hackathon.awardEn || hackathon.award;
          const hAccent = hackathon.awardColor || (hAward?.includes("1") ? "#38BDF8" : hAward?.includes("3") ? "#F59E0B" : "#A855F7");

          const isHovered = hoveredIndex === idx;
          const hasHover = hoveredIndex !== null;
          const isShrunk = hasHover && !isHovered;

          // Libellé de catégorie adaptatif : concis quand la carte est compressée pour garantir zéro encombrement
          const categoryText = isShrunk
            ? "Hackathon"
            : locale === "fr"
            ? "Hackathon & Événement"
            : "Hackathon & Event";

          // Résolveur de distinction succincte : extrait le prix pur (ex: "1ʳᵉ Place", "3ᵉ Prix")
          const getShortAward = (awardStr: string | undefined): string => {
            if (!awardStr) return "";
            const parts = awardStr.split(/\s*[-—–:]\s*/);
            const primary = (parts[0] || "").trim();
            if (primary.length > 0 && primary.length <= 16) {
              return primary;
            }
            const words = primary.split(/\s+/);
            if (words.length >= 2) {
              const twoWords = words.slice(0, 2).join(" ");
              if (twoWords.length <= 16) return twoWords;
            }
            return primary.length > 14 ? primary.slice(0, 12).trim() + "…" : primary;
          };
          const displayAward = getShortAward(hAward);

          // Flex ratio dynamique :
          // Par défaut : divisé à parts égales (50%/50% si 2, 33%/33%/33% si 3).
          // Au survol : la photo survolée s'agrandit pour prendre ses vraies dimensions et pousse les autres.
          const flexRatio = !hasHover
            ? 1
            : isHovered
            ? hackathons.length === 2
              ? 2.3
              : 2.8
            : hackathons.length === 2
            ? 1
            : 0.8;

          return (
            <motion.div
              key={hackathon.id || idx}
              layout
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => {
                setModalPhotoIndex(0);
                setActiveModalItem(hackathon);
              }}
              style={{ flex: flexRatio }}
              className={`group relative w-full h-[360px] sm:h-[420px] md:h-auto md:min-h-full rounded-[24px] sm:rounded-[32px] overflow-hidden border bg-neutral-950 cursor-pointer shadow-2xl select-none transition-colors duration-300 ${
                isHovered
                  ? "border-cyan-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* 100% Real, Natural Colors - Photo couvre 100% de la carte sans aucun cadre noir */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={hTitle}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle dark gradient overlay at bottom for clean text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 pointer-events-none" />

              {/* Top Bar: Typographie signature encre noire, plus grasse et plus lisible */}
              <div className="absolute top-0 inset-x-0 z-20 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-3 pointer-events-none">
                <span
                  className={`font-signature select-none truncate tracking-wide text-black drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] transition-all duration-300 ${
                    isShrunk
                      ? "text-xs sm:text-sm font-bold max-w-[44%]"
                      : "text-sm sm:text-base md:text-[17px] font-bold max-w-[48%]"
                  }`}
                >
                  {categoryText}
                </span>

                {displayAward ? (
                  <span
                    className={`font-signature select-none truncate text-right tracking-wide text-black drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] transition-all duration-300 ${
                      isShrunk
                        ? "text-xs sm:text-sm font-bold max-w-[50%]"
                        : "text-sm sm:text-base md:text-[17px] font-bold max-w-[48%]"
                    }`}
                  >
                    {displayAward}
                  </span>
                ) : (
                  <span className="font-signature text-sm sm:text-base md:text-[17px] font-bold text-black drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] select-none">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Bottom Caption: Vertical Accent Bar + Title & Organization */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 lg:p-7 flex flex-col justify-end pointer-events-none">
                <div className="flex items-center min-w-0">
                  <span
                    className="w-1.5 h-5 rounded-full shrink-0 mr-3 transition-transform group-hover:scale-y-110"
                    style={{
                      backgroundColor: hAccent,
                      boxShadow: `0 0 12px ${hAccent}90`,
                    }}
                  />
                  <h3
                    className="font-sans text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2"
                    title={hTitle}
                  >
                    {hTitle}
                  </h3>
                </div>

                <div className="mt-2 flex items-center gap-2 pl-4 text-xs font-mono text-white/70">
                  <span className="text-white/90 font-medium">{hackathon.organization}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/50">{hackathon.year}</span>
                  {hackathon.location && (
                    <>
                      <span className="text-white/30">·</span>
                      <span className="text-white/50">{hackathon.location}</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal / Drawer (Full photo & engineering dossier) */}
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
                <div className="flex items-center gap-2">
                  <span className="font-signature text-sm sm:text-base font-semibold text-cyan-400">
                    {locale === "fr" ? "Hackathon & Événement" : "Hackathon & Event"}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="font-mono text-xs text-white/70">
                    {activeModalItem.year}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {locale === "fr" ? activeModalItem.title : activeModalItem.titleEn || activeModalItem.title}
                </h3>
                <p className="font-mono text-xs text-white/60">
                  {locale === "fr" ? "Organisé par :" : "Organized by:"}{" "}
                  <strong className="text-white">{activeModalItem.organization}</strong> — {activeModalItem.location}
                </p>
              </div>

              {/* Photo View in Modal */}
              {(() => {
                const modalImages = getResolvedImages(activeModalItem, 0);
                return (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={modalImages[modalPhotoIndex] || modalImages[0]}
                        alt="Photo hackathon HD"
                        decoding="async"
                        className="max-h-[55vh] w-auto max-w-full rounded-xl object-contain shadow-2xl block mx-auto"
                      />

                      {/* Modal Arrows */}
                      {modalImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setModalPhotoIndex(
                                (prev) =>
                                  (prev - 1 + modalImages.length) %
                                  modalImages.length
                              )
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black"
                          >
                            <ChevronLeft className="size-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setModalPhotoIndex((prev) => (prev + 1) % modalImages.length)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black"
                          >
                            <ChevronRight className="size-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Modal Thumbnails Strip if multiple */}
                    {modalImages.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {modalImages.map((img, tIdx) => (
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
                );
              })()}

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
                  <span className="font-mono text-xs font-bold italic text-white/40 uppercase">Stack :</span>
                  <div className="font-mono text-xs italic font-normal text-white/80 flex flex-wrap items-center gap-x-2">
                    {activeModalItem.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center">
                        <span style={{ color: tag.color !== "standard" ? tag.color : undefined }}>
                          {tag.name}
                        </span>
                        {tIdx < activeModalItem.tags.length - 1 && (
                          <span className="opacity-30 ml-2 not-italic">·</span>
                        )}
                      </span>
                    ))}
                  </div>
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
