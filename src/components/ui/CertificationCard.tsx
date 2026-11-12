/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Award, Calendar, Download, ExternalLink, LoaderCircle, Maximize2, ShieldCheck, X } from "lucide-react";
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
        onClick={() => setOpen(true)}
        className="group relative flex flex-col text-left overflow-hidden rounded-3xl border border-white/10 bg-[#141518] transition-all duration-300 hover:border-[#C8F122]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C8F122]/10 w-full h-full cursor-pointer"
      >
        {/* Document Preview Frame: Framed presentation with subtle ambient gradient */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#181224] via-[#0f0a18] to-[#0a0710] border-b border-white/[0.06] flex items-center justify-center p-3 sm:p-3.5">
          {/* Loading Skeleton */}
          {!isLoaded && !hasError && certification.hasDocument && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#141518] animate-pulse">
              <LoaderCircle className="size-7 animate-spin text-[#C8F122]/60" />
            </div>
          )}

          {certification.hasDocument && !hasError ? (
            <div className="relative h-full w-full flex items-center justify-center rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-[#C8F122]/40 transition-colors bg-[#08050e]">
              <img
                src={previewUrl}
                alt={`Aperçu de ${certification.name}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setHasError(true);
                }}
                className={`h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03] ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#0C100E] to-[#0B0B0C] p-6 text-center">
              <div className="grid size-12 place-items-center rounded-2xl border border-[#C8F122]/30 bg-[#C8F122]/10 text-[#C8F122] mb-2 group-hover:scale-110 transition-transform">
                <Award className="size-6 text-[#C8F122]" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                {certification.issuer || "Certification Officielle"}
              </span>
            </div>
          )}

          {/* Issuer Pill Badge */}
          {certification.issuer && (
            <div className="absolute top-2.5 right-2.5 z-20 rounded-full border border-white/10 bg-[#0d0916]/85 px-2.5 py-1 backdrop-blur-md text-[10px] font-mono font-semibold text-[#C8F122] shadow-lg">
              {certification.issuer}
            </div>
          )}
        </div>

        {/* Info Content Container */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 bg-[#141518]">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold leading-snug text-[#FFFFFF] group-hover:text-[#C8F122] transition-colors line-clamp-2">
              {certification.name}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-1.5">
              <Calendar className="size-3.5 opacity-60 text-[#C8F122]" />
              {formattedDate || "—"}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8F122] group-hover:text-white transition-colors">
              {locale === "fr" ? "Inspecter" : "Inspect"}
              <Maximize2 className="size-3.5" />
            </span>
          </div>
        </div>
      </button>

      {/* Credential Inspector Modal: 2-column side-by-side layout, zero bleed-through scroll */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden select-none"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {/* Backdrop Blur Overlay: traps background scroll */}
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
                  className="absolute inset-0 bg-black/85 backdrop-blur-xl"
                />

                {/* Modal Dialog Card: Side-by-side 2-column layout */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  role="dialog"
                  aria-modal="true"
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  data-lenis-prevent-touch="true"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="relative z-10 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121316] text-[#FFFFFF] shadow-2xl overscroll-contain select-text"
                >
                  {/* Compact Header Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#120A1C] px-5 sm:px-6 py-3.5 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#C8F122]/10 border border-[#C8F122]/30 text-[#C8F122]">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                          {locale === "fr" ? "CRÉDENTIEL ACCRÉDITÉ" : "VERIFIED CREDENTIAL"}
                        </span>
                        {certification.issuer && (
                          <>
                            <span className="text-white/20">·</span>
                            <span className="text-xs font-semibold text-[#C8F122]">
                              {certification.issuer}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label={locale === "fr" ? "Fermer" : "Close"}
                      className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#A1A1AA] hover:bg-white/[0.08] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Main Content Body: 2 Columns Side-by-Side (Document on Left, Description & Details on Right) */}
                  <div
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    onWheel={(e) => e.stopPropagation()}
                    className="p-5 sm:p-6 lg:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch overflow-y-auto overscroll-contain max-h-[calc(92vh-64px)]"
                  >
                    {/* Left Column (md:col-span-7): Certificate Document completely visible in luxury frame */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                      <div className="relative w-full h-[320px] sm:h-[370px] md:h-[410px] rounded-2xl border border-white/10 bg-gradient-to-b from-[#140f20] to-[#08050e] p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-inner">
                        {certification.hasDocument ? (
                          <div className="relative h-full w-full flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                            <img
                              src={previewUrl}
                              alt={certification.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = `/api/certifications/${certification.id}/document`;
                              }}
                              className="max-h-full w-auto max-w-full object-contain rounded-lg shadow-md transition-transform hover:scale-[1.02]"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="size-14 rounded-2xl bg-[#C8F122]/10 border border-[#C8F122]/30 flex items-center justify-center text-[#C8F122] mb-3">
                              <Award className="size-7" />
                            </div>
                            <h3 className="font-display text-lg font-bold text-[#FFFFFF] mb-1">
                              {certification.name}
                            </h3>
                            <p className="text-xs text-[#A1A1AA] max-w-sm mb-1">{certification.issuer}</p>
                            {formattedDate && (
                              <span className="text-xs font-mono text-[#C8F122]">{formattedDate}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column (md:col-span-5): Description & Competencies & Action Buttons */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                      {/* Top: Title & Date */}
                      <div>
                        <h2 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] leading-snug">
                          {certification.name}
                        </h2>
                        {formattedDate && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA]">
                            <Calendar className="size-3.5 text-[#C8F122]" />
                            <span>
                              {locale === "fr" ? `Obtenu en : ${formattedDate}` : `Issued: ${formattedDate}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Verified Objectives & Skills Description */}
                      {certification.description ? (
                        <div
                          data-lenis-prevent="true"
                          data-lenis-prevent-wheel="true"
                          data-lenis-prevent-touch="true"
                          onWheel={(e) => e.stopPropagation()}
                          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex-1 overflow-y-auto max-h-[220px] overscroll-contain"
                        >
                          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#C8F122] mb-2 flex items-center gap-1.5">
                            <ShieldCheck className="size-3.5" />
                            {locale === "fr" ? "Objectifs & Compétences Validées" : "Verified Objectives & Skills"}
                          </span>
                          <p className="text-xs sm:text-sm leading-relaxed text-[#c4c0cd] whitespace-pre-line">
                            {certification.description}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 flex-1 flex items-center justify-center text-center">
                          <span className="text-xs text-[#A1A1AA] italic">
                            {locale === "fr"
                              ? "Certification officielle accréditée avec contrôle d'identité et de compétences techniques."
                              : "Official accredited certification with identity and technical competence verification."}
                          </span>
                        </div>
                      )}

                      {/* Bottom Actions: Download, Verify, and Close */}
                      <div className="pt-3 border-t border-white/[0.08] mt-auto flex flex-col gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {certification.hasDocument && (
                            <a
                              href={`/api/certifications/${certification.id}/document`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#FFFFFF] hover:bg-white/[0.08] transition-colors"
                            >
                              <Download className="size-3.5 text-[#C8F122]" />
                              <span>{locale === "fr" ? "Télécharger le PDF" : "Download PDF"}</span>
                            </a>
                          )}

                          {certification.verificationUrl && (
                            <a
                              href={certification.verificationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C8F122] px-4 py-2.5 text-xs font-semibold text-[#000000] hover:bg-[#D9FB52] transition-colors shadow-lg shadow-[#C8F122]/20"
                            >
                              <span>{copy.verify}</span>
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="w-full inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] py-2 text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-white/20 transition-colors cursor-pointer"
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
