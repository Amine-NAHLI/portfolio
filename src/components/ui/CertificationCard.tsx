/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Award, Calendar, ExternalLink, LoaderCircle, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Certification = {
  id: string;
  name: string;
  description?: string | null;
  issuer: string | null;
  issuedOn: string | null;
  verificationUrl: string | null;
  hasDocument: boolean;
  documentMimeType: string | null;
};

type CertificationCardProps = {
  certification: Certification;
  locale: string;
  copy: {
    verify: string;
    close?: string;
  };
};

export default function CertificationCard({ certification, locale, copy }: CertificationCardProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [modalDocError, setModalDocError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Strictly lock both body and html scroll on modal open, stop Lenis, and prevent bleed-through
  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    // Compensate for scrollbar shift to prevent layout jumping
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.__lenis?.start();
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const formattedDate = certification.issuedOn
    ? new Date(certification.issuedOn).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  // Primary preview source: static high-res pre-rendered thumbnail, fallback to document stream
  const previewUrl = `/images/certifications/${certification.id}.png`;

  return (
    <>
      {/* Interactive Trigger Card */}
      <button
        type="button"
        onClick={() => {
          setModalDocError(false);
          setOpen(true);
        }}
        className="group relative flex flex-col text-left overflow-hidden rounded-3xl border border-border-strong bg-surface transition-all duration-300 hover:border-accent/55 hover:-translate-y-1 hover:shadow-2xl w-full h-full cursor-pointer"
      >
        {/* Document Preview Frame (Affichage complet direct sans cadre épais ni tag sur l'image) */}
        <div className="relative w-full aspect-[16/11] overflow-hidden bg-white dark:bg-[#121316] border-b border-border flex items-center justify-center">
          {/* Loading Skeleton */}
          {!isLoaded && !hasError && certification.hasDocument && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/90">
              <LoaderCircle className="size-6 animate-spin text-text-muted" />
            </div>
          )}

          {certification.hasDocument && !hasError ? (
            <div className="relative size-full flex items-center justify-center bg-white">
              <img
                src={previewUrl}
                alt={`Aperçu de ${certification.name}`}
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setHasError(true);
                }}
                className={`size-full object-contain bg-white transition-transform duration-500 group-hover:scale-[1.02] ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full h-full bg-surface-subtle p-6 text-center">
              <div className="grid size-11 place-items-center rounded-xl border border-border bg-surface-raised text-text-secondary mb-2 group-hover:scale-105 transition-transform">
                <Award className="size-5 text-text-primary" />
              </div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {certification.issuer || "Certification Officielle"}
              </span>
            </div>
          )}

          {/* Indicateur discret de consultation / clic pour détails */}
          <div className="absolute top-3 right-3 z-10 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium text-white/90 bg-black/75 backdrop-blur-md border border-white/20 shadow-sm group-hover:border-accent/60 group-hover:text-accent transition-colors">
              <Maximize2 className="size-3 text-accent" />
              <span>{locale === "fr" ? "Détails" : "Details"}</span>
            </span>
          </div>
        </div>

        {/* Info Content Container */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 bg-surface">
          <div>
            {certification.issuer && (
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-1.5 block">
                {certification.issuer}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-display font-bold leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-2">
              {certification.name}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
              <Calendar className="size-3.5 opacity-75 text-accent" />
              {formattedDate || "—"}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:text-text-primary transition-colors">
              {locale === "fr" ? "Inspecter" : "Inspect"}
              <Maximize2 className="size-3.5" />
            </span>
          </div>
        </div>
      </button>

      {/* Credential Inspector Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden select-none"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Backdrop Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  onWheel={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute inset-0 bg-surface-deep/80 backdrop-blur-xl"
                />

                {/* Modal Dialog Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  role="dialog"
                  aria-modal="true"
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  data-lenis-prevent-touch="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="relative z-10 w-full max-w-5xl max-h-[92dvh] flex flex-col overflow-hidden rounded-3xl border border-border-strong bg-surface text-text-primary shadow-2xl overscroll-contain select-text"
                >
                  {/* Compact Header Bar */}
                  <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-5 sm:px-6 py-3 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-raised border border-border text-text-secondary">
                        <Award className="size-4 text-text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-primary">
                          {certification.issuer || (locale === "fr" ? "Certification" : "Certificate")}
                        </span>
                        <span className="text-text-muted/40">·</span>
                        <span className="text-xs text-text-muted">
                          {locale === "fr" ? "Document officiel" : "Official document"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label={locale === "fr" ? "Fermer" : "Close"}
                      className="flex size-7 items-center justify-center rounded-full border border-border bg-text-primary/[0.04] text-text-secondary hover:bg-text-primary/[0.1] hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* Main Content Body */}
                  <div
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    onWheel={(e) => e.stopPropagation()}
                    className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch overflow-y-auto overscroll-contain max-h-[calc(92dvh-58px)]"
                  >
                    {/* Left Column: Authentic Framed Document Presentation */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] rounded-2xl border border-border/80 bg-[#141418] dark:bg-[#0B0B0E] p-3 sm:p-5 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                        {/* Subtle Exhibition Frame Matting Glass Sheen */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05]"
                        />

                        {certification.hasDocument && !modalDocError ? (
                          <div className="relative max-h-full max-w-full flex items-center justify-center">
                            {/* The Real Paper Document Sheet */}
                            <div className="relative max-h-full max-w-full rounded-xs bg-white shadow-[0_12px_36px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/15 overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
                              <img
                                src={previewUrl}
                                alt={certification.name}
                                onError={(e) => {
                                  const currentSrc = (e.currentTarget as HTMLImageElement).src;
                                  const fallbackUrl = `/api/certifications/${certification.id}/document`;
                                  if (!currentSrc.includes(fallbackUrl)) {
                                    (e.currentTarget as HTMLImageElement).src = fallbackUrl;
                                  } else {
                                    setModalDocError(true);
                                  }
                                }}
                                className="max-h-[190px] sm:max-h-[260px] md:max-h-[360px] w-auto max-w-full object-contain"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="size-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-text-primary mb-3">
                              <Award className="size-6" />
                            </div>
                            <h3 className="font-display text-base font-bold text-text-primary mb-1">
                              {certification.name}
                            </h3>
                            <p className="text-xs text-text-secondary max-w-sm mb-1">{certification.issuer}</p>
                            {formattedDate && (
                              <span className="text-xs font-mono text-text-muted">{formattedDate}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                      <div>
                        <h2 className="font-display text-lg sm:text-xl font-bold text-text-primary leading-snug">
                          {certification.name}
                        </h2>
                        {formattedDate && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-text-secondary">
                            <Calendar className="size-3.5 text-accent" />
                            <span>
                              {locale === "fr" ? `Obtenu en : ${formattedDate}` : `Issued: ${formattedDate}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {certification.description ? (
                        <div
                          className="rounded-2xl border border-border bg-surface-subtle p-4 flex-1 md:overflow-y-auto md:max-h-[220px] overscroll-contain"
                        >
                          <h3 className="text-xs font-semibold text-text-primary mb-2">
                            {locale === "fr" ? "Compétences & domaines évalués" : "Assessed skills & domains"}
                          </h3>
                          <p className="text-xs sm:text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                            {certification.description}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-border bg-surface-subtle p-4 flex-1 flex items-center justify-center text-center">
                          <span className="text-xs text-text-muted italic">
                            {locale === "fr"
                              ? "Document officiel délivré après évaluation et contrôle des compétences."
                              : "Official document issued after skill assessment and identity verification."}
                          </span>
                        </div>
                      )}

                      {/* Bottom Actions */}
                      <div className="pt-3 border-t border-border mt-auto flex flex-col gap-2.5">
                        {certification.verificationUrl ? (
                          <a
                            href={certification.verificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs sm:text-sm font-bold text-text-on-accent hover:opacity-95 transition-all duration-200 shadow-sm hover:scale-[1.01]"
                          >
                            <ExternalLink className="size-3.5" />
                            <span>{copy.verify || (locale === "fr" ? "Vérifier sur le site officiel" : "Verify on official site")}</span>
                          </a>
                        ) : (
                          <div className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2.5 text-xs font-medium text-text-secondary select-none">
                            <span>{locale === "fr" ? "Document original vérifié" : "Verified original document"}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="w-full inline-flex items-center justify-center rounded-full border border-border bg-text-primary/[0.03] py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-text-primary/[0.06] transition-colors cursor-pointer"
                        >
                          {copy.close || (locale === "fr" ? "Fermer" : "Close")}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
