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

  // Lock body scroll on modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const formattedDate = certification.issuedOn
    ? new Date(certification.issuedOn).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <>
      {/* Interactive Trigger Card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex flex-col text-left overflow-hidden rounded-3xl border border-white/10 bg-[#17161e] transition-all duration-300 hover:border-[#9A71FF]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#9A71FF]/10 w-full h-full cursor-pointer"
      >
        {/* Document Preview Frame */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#101015] border-b border-white/[0.06] flex items-center justify-center">
          {/* Loading Skeleton */}
          {!isLoaded && !hasError && certification.hasDocument && certification.documentMimeType?.startsWith("image/") && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#17161e] animate-pulse">
              <LoaderCircle className="size-7 animate-spin text-[#9A71FF]/60" />
            </div>
          )}

          {certification.hasDocument && !hasError ? (
            certification.documentMimeType?.startsWith("image/") ? (
              <img
                src={`/api/certifications/${certification.id}/document`}
                alt={`Aperçu de ${certification.name}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`h-full w-full object-contain p-2.5 transition-all duration-700 group-hover:scale-105 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#1b1528] to-[#0d0b14] p-6 text-center border-b border-white/[0.06] group-hover:from-[#221a33] transition-colors">
                <div className="relative mb-3 flex size-14 items-center justify-center rounded-2xl border border-[#9A71FF]/40 bg-[#9A71FF]/10 text-[#9A71FF] shadow-[0_0_20px_rgba(154,113,255,0.2)] transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheck className="size-7 text-[#9A71FF]" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-1">
                  Document PDF Vérifié
                </span>
                <span className="text-[11px] font-medium text-[#797681]">
                  {locale === "fr" ? "Cliquer pour examiner" : "Click to inspect document"}
                </span>
              </div>
            )
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#17161e] to-[#101015] p-6 text-center">
              <div className="grid size-12 place-items-center rounded-2xl border border-[#9A71FF]/30 bg-[#9A71FF]/10 text-[#9A71FF] mb-2 group-hover:scale-110 transition-transform">
                <Award className="size-6 text-[#9A71FF]" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#797681]">
                {certification.issuer || "Certification Officielle"}
              </span>
            </div>
          )}

          {/* Issuer Pill Badge */}
          {certification.issuer && (
            <div className="absolute top-3 right-3 z-20 rounded-full border border-white/10 bg-[#101015]/80 px-2.5 py-1 backdrop-blur-md text-[11px] font-semibold text-[#9A71FF] shadow-lg">
              {certification.issuer}
            </div>
          )}
        </div>

        {/* Info Content Container */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 bg-[#17161e]">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold leading-snug text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors line-clamp-2">
              {certification.name}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <span className="text-xs font-mono text-[#797681] flex items-center gap-1.5">
              <Calendar className="size-3.5 opacity-60 text-[#9A71FF]" />
              {formattedDate || "—"}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A71FF] group-hover:text-white transition-colors">
              {locale === "fr" ? "Inspecter" : "Inspect"}
              <Maximize2 className="size-3.5" />
            </span>
          </div>
        </div>
      </button>

      {/* High-End Credential Dossier Inspector Modal rendered via Portal to escape any transformed container */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-10">
                {/* Backdrop Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 bg-black/85 backdrop-blur-xl"
                />

                {/* Modal Dialog Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] text-[#f3f1f7] shadow-2xl"
                >
                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#120A1C] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#9A71FF]/10 border border-[#9A71FF]/30 text-[#9A71FF]">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                            {locale === "fr" ? "CRÉDENTIEL ACCRÉDITÉ" : "VERIFIED CREDENTIAL"}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="text-xs font-medium text-[#797681]">
                            {certification.issuer || "Organisme Agréé"}
                          </span>
                        </div>
                        <h2 className="font-display text-lg sm:text-xl font-bold text-[#f3f1f7] truncate max-w-md sm:max-w-xl">
                          {certification.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Fermer"
                        className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#797681] hover:bg-white/[0.08] hover:text-[#f3f1f7] transition-colors cursor-pointer"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Content Body (Scrollable if necessary) */}
                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                    {/* Full Document Viewer Container */}
                    <div className="relative w-full rounded-2xl border border-white/10 bg-[#060605] p-2 flex items-center justify-center min-h-[340px] max-h-[62vh] overflow-hidden shadow-inner">
                      {certification.hasDocument ? (
                        certification.documentMimeType?.startsWith("image/") ? (
                          <img
                            src={`/api/certifications/${certification.id}/document`}
                            alt={certification.name}
                            className="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                          />
                        ) : (
                          <div className="relative w-full h-[58vh] overflow-hidden rounded-xl bg-white">
                            <iframe
                              src={`/api/certifications/${certification.id}/document#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                              className="size-full border-0"
                              title={certification.name}
                            />
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                          <div className="size-16 rounded-2xl bg-[#9A71FF]/10 border border-[#9A71FF]/30 flex items-center justify-center text-[#9A71FF] mb-4">
                            <Award className="size-8" />
                          </div>
                          <h3 className="font-display text-xl font-bold text-[#f3f1f7] mb-2">
                            {certification.name}
                          </h3>
                          <p className="text-xs text-[#797681] max-w-md mb-2">
                            {certification.issuer}
                          </p>
                          {formattedDate && (
                            <span className="text-xs font-mono text-[#9A71FF]">
                              {locale === "fr" ? `Délivré en ${formattedDate}` : `Issued ${formattedDate}`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description & Competencies Verified */}
                    {certification.description && (
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9A71FF] mb-2 block">
                          {locale === "fr" ? "Objectifs & Compétences Validées" : "Verified Objectives & Skills"}
                        </span>
                        <p className="text-xs sm:text-sm leading-relaxed text-[#797681]">
                          {certification.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#120A1C] px-6 py-4 text-xs">
                    <div className="text-[#797681] font-mono">
                      {formattedDate ? `${locale === "fr" ? "Date d'obtention :" : "Issue Date:"} ${formattedDate}` : ""}
                    </div>

                    <div className="flex items-center gap-3">
                      {certification.hasDocument && (
                        <a
                          href={`/api/certifications/${certification.id}/document`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-semibold text-[#f3f1f7] hover:bg-white/[0.08] transition-colors"
                        >
                          <Download className="size-3.5 text-[#9A71FF]" />
                          <span>{locale === "fr" ? "Télécharger le document" : "Download Document"}</span>
                        </a>
                      )}

                      {certification.verificationUrl && (
                        <a
                          href={certification.verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#9A71FF] px-4 py-2 font-semibold text-[#000000] hover:bg-[#b08dff] transition-colors shadow-lg shadow-[#9A71FF]/20"
                        >
                          <span>{copy.verify}</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 font-semibold text-[#797681] hover:text-[#f3f1f7] hover:border-white/20 transition-colors cursor-pointer"
                      >
                        {copy.close || (locale === "fr" ? "Fermer" : "Close")}
                      </button>
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
