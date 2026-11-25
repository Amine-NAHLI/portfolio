"use client";

import { useState, useEffect } from "react";
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

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

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

          // Flex ratio dynamique fluide :
          // Par défaut : divisé à parts égales (50%/50% si 2, 33%/33%/33% si 3).
          // Au survol : la photo survolée s'agrandit avec transition fluide sans saut brusque.
          const flexRatio = !hasHover
            ? 1
            : isHovered
            ? hackathons.length === 2
              ? 2
              : 2.2
            : hackathons.length === 2
            ? 1
            : 0.85;

          return (
            <div
              key={hackathon.id || idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              style={
                isDesktop
                  ? {
                      flex: flexRatio,
                      transition: "flex 650ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }
                  : { minHeight: "360px", height: "360px" }
              }
              className={`hackathon-card group relative w-full shrink-0 min-h-[360px] h-[360px] sm:h-[420px] md:h-auto md:min-h-full rounded-[24px] sm:rounded-[32px] overflow-hidden border bg-neutral-950 shadow-2xl select-none will-change-[flex] transition-[border-color,box-shadow] duration-500 ease-out ${
                isHovered
                  ? "border-cyan-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-20"
                  : "border-white/10 hover:border-white/25 z-10"
              }`}
            >
              {/* 100% Real, Natural Colors - Photo couvre 100% de la carte avec cadrage dynamique */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={hTitle}
                loading="lazy"
                decoding="async"
                style={{
                  objectFit: hackathon.imageFit || "cover",
                  objectPosition: hackathon.imagePosition || "center",
                }}
                className="absolute inset-0 size-full block transition-transform duration-700 ease-out group-hover:scale-105"
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

              {/* Bottom Caption: Title, Organization, Year & Tags (FR & EN) - Zero Modal Details */}
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

                <div className="mt-1.5 flex items-center gap-2 pl-4 text-xs font-mono text-white/70">
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

                {/* Event Tags (Bilingual FR/EN, styled in clean italic typography without boxy badges) */}
                {hackathon.tags && hackathon.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-4">
                    {hackathon.tags.slice(0, 4).map((tag, tIdx) => {
                      const tagName = locale === "fr" ? tag.name : (tag.nameEn || tag.name);
                      const isCustom = tag.color && tag.color !== "standard" && tag.color.startsWith("#");
                      return (
                        <span
                          key={tIdx}
                          style={isCustom ? { color: tag.color } : undefined}
                          className={`font-mono text-[11px] sm:text-xs font-semibold italic ${
                            !isCustom ? "text-white/80" : ""
                          }`}
                        >
                          #{tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
