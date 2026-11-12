/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  mediaId: string;
  url: string;
  altFr: string | null;
  altEn: string | null;
};

type ProjectGalleryProps = {
  images: GalleryImage[];
  locale: string;
  projectTitle?: string;
};

export default function ProjectGallery({ images, locale, projectTitle }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);

  const safeIndex = images.length > 0 ? Math.min(selectedIndex, images.length - 1) : 0;

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (lightboxOpen) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      } else if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "ArrowLeft") {
        prevImage();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  useEffect(() => {
    const activeThumb = thumbRefs.current[safeIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [safeIndex]);

  if (images.length === 0) return null;

  const activeImage = images[safeIndex];
  const getAlt = (img: GalleryImage, idx: number) => {
    const localized = locale === "fr" ? img.altFr : img.altEn;
    if (localized && localized.trim()) return localized;
    if (projectTitle) return `${projectTitle} — ${idx + 1}`;
    return `Capture ${idx + 1}`;
  };

  const formattedIndex = String(safeIndex + 1).padStart(2, "0");
  const formattedTotal = String(images.length).padStart(2, "0");

  return (
    <>
      <div
        className="w-full max-w-4xl"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            nextImage();
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            prevImage();
          }
        }}
      >
        {/* Frameless tight image wrapper — hugs image aspect ratio with zero filler box */}
        <div
          className="group relative inline-flex max-w-full items-center justify-center overflow-hidden rounded-xl ring-1 ring-border-strong shadow-[0_18px_48px_rgba(0,0,0,0.28)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(deltaX) > 45) {
              if (deltaX < 0) nextImage();
              else prevImage();
            }
          }}
        >
          <img
            src={activeImage.url}
            alt={getAlt(activeImage, safeIndex)}
            onClick={() => setLightboxOpen(true)}
            className="block max-h-[340px] w-auto max-w-full cursor-zoom-in object-contain sm:max-h-[420px] lg:max-h-[480px]"
          />

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute right-2.5 top-2.5 z-20 grid size-9 place-items-center rounded-full border border-border-strong bg-surface/85 text-text-primary backdrop-blur-md transition-all hover:border-accent/60 hover:bg-surface-raised hover:text-accent sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
            aria-label={locale === "fr" ? "Agrandir l'image" : "Expand image"}
          >
            <Maximize2 className="size-4" />
          </button>

          {/* Compact edge navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2.5 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-surface/85 text-text-primary backdrop-blur-md transition-all hover:border-accent/60 hover:bg-surface-raised hover:text-accent sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={locale === "fr" ? "Image précédente" : "Previous image"}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2.5 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-surface/85 text-text-primary backdrop-blur-md transition-all hover:border-accent/60 hover:bg-surface-raised hover:text-accent sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={locale === "fr" ? "Image suivante" : "Next image"}
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
        </div>

        {/* Minimal frameless thumbnail strip & counter */}
        {images.length > 1 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
              {images.map((img, index) => {
                const isActive = index === safeIndex;
                return (
                  <button
                    key={img.mediaId}
                    ref={(el) => {
                      thumbRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`${locale === "fr" ? "Afficher l'image" : "Show image"} ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group/thumb relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-14 sm:w-24",
                      isActive
                        ? "border-accent ring-2 ring-accent/30 opacity-100"
                        : "border-border-strong opacity-60 hover:border-accent/50 hover:opacity-95"
                    )}
                  >
                    <img
                      src={img.url}
                      alt={getAlt(img, index)}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
            <span className="shrink-0 font-mono text-xs font-medium text-accent">
              {formattedIndex} / {formattedTotal}
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <dialog
          open
          data-lenis-prevent="true"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
          className="fixed inset-0 z-[100] m-0 flex h-dvh w-dvw flex-col justify-between bg-surface-deep/92 p-4 backdrop-blur-xl sm:p-6 open:animate-in open:fade-in-0"
          onClose={() => setLightboxOpen(false)}
        >
          {/* Lightbox header */}
          <div className="flex items-center justify-between gap-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="rounded-md border border-accent/40 bg-accent px-2.5 py-1 font-mono text-xs font-semibold text-text-on-accent">
                {formattedIndex} / {formattedTotal}
              </span>
              <span className="truncate text-sm text-white/90">{getAlt(activeImage, safeIndex)}</span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={locale === "fr" ? "Fermer" : "Close"}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Lightbox center stage */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center py-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) setLightboxOpen(false);
            }}
          >
            <img
              src={activeImage.url}
              alt={getAlt(activeImage, safeIndex)}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/15"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-colors hover:border-accent/60 hover:text-white sm:left-4 sm:size-12"
                  aria-label={locale === "fr" ? "Image précédente" : "Previous image"}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-colors hover:border-accent/60 hover:text-white sm:right-4 sm:size-12"
                  aria-label={locale === "fr" ? "Image suivante" : "Next image"}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox thumbnail strip */}
          {images.length > 1 && (
            <div className="mx-auto flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border border-white/15 bg-black/60 p-2 no-scrollbar">
              {images.map((img, index) => (
                <button
                  key={img.mediaId}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`${locale === "fr" ? "Aller à l'image" : "Go to image"} ${index + 1}`}
                  className={cn(
                    "relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition-all",
                    index === safeIndex
                      ? "border-accent ring-2 ring-accent/40 opacity-100"
                      : "border-white/15 opacity-55 hover:opacity-90"
                  )}
                >
                  <img
                    src={img.url}
                    alt={getAlt(img, index)}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </dialog>
      )}
    </>
  );
}
