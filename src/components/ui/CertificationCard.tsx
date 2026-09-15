/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { Award, Calendar, Download, ArrowUpRight, X, LoaderCircle } from "lucide-react";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <button 
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex flex-col text-left overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface/80 backdrop-blur-xl transition-all duration-500 hover:border-accent/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent w-full h-full"
      >
        {/* Document Preview Frame */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-deep/90 border-b border-white/5 flex items-center justify-center">
          {/* Loading Skeleton */}
          {!isLoaded && !hasError && certification.hasDocument && certification.documentMimeType?.startsWith("image/") && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-raised animate-pulse">
              <LoaderCircle className="size-8 animate-spin text-accent/60" />
            </div>
          )}

          {certification.hasDocument && !hasError ? (
            certification.documentMimeType?.startsWith("image/") ? (
              <img
                src={`/api/certifications/${certification.id}/document`}
                alt={`Preview of ${certification.name}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`h-full w-full object-contain p-2 transition-all duration-700 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            ) : (
              <div className="relative h-full w-full overflow-hidden bg-white">
                <iframe
                  src={`/api/certifications/${certification.id}/document#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  loading="lazy"
                  className="pointer-events-none absolute -top-1 -left-1 w-[calc(100%+36px)] h-[calc(100%+16px)] border-0 transition-transform duration-700 group-hover:scale-105"
                  tabIndex={-1}
                  title={`Preview of ${certification.name}`}
                />
                <div className="absolute inset-0 z-10" aria-hidden="true" />
              </div>
            )
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-surface to-surface-deep p-6 text-center">
              <div className="grid size-14 place-items-center rounded-2xl border border-accent/20 bg-accent/10 text-accent mb-2 group-hover:scale-110 transition-transform">
                <Award className="size-7 text-accent" />
              </div>
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">
                {certification.issuer || "Certification"}
              </span>
            </div>
          )}

          {/* Issuer Pill Badge on top corner of preview */}
          {certification.issuer && (
            <div className="absolute top-3 right-3 z-20 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 backdrop-blur-md text-[0.68rem] font-mono font-semibold text-accent shadow-lg">
              {certification.issuer}
            </div>
          )}
        </div>
        
        {/* Dedicated Info Content Container Below Image */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 bg-surface-subtle/50">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold leading-snug text-text-primary group-hover:text-white transition-colors line-clamp-2">
              {certification.name}
            </h2>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-xs font-mono text-text-muted flex items-center gap-1.5">
              <Calendar className="size-3.5 opacity-60" />
              {certification.issuedOn 
                ? new Date(certification.issuedOn).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "short" }) 
                : "—"}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:translate-x-0.5 transition-transform">
              {locale === "fr" ? "Voir" : "View"}
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </div>
      </button>

      {/* Verification & Full Document Viewer Dialog */}
      <dialog 
        ref={dialogRef} 
        className="m-auto w-[92vw] max-w-4xl rounded-2xl border border-white/10 bg-bg-page p-0 text-text-primary backdrop:bg-black/85 backdrop:backdrop-blur-md open:animate-in open:fade-in-0 open:zoom-in-95 shadow-2xl"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                <Award className="size-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {certification.name}
                </h2>
                {certification.issuer && (
                  <p className="text-sm text-accent font-medium mt-0.5">
                    {certification.issuer}
                    {certification.issuedOn && (
                      <span className="text-text-muted font-normal ml-2">
                        · {new Date(certification.issuedOn).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long" })}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="inline-grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-surface-raised text-text-muted hover:bg-surface hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
          </div>

          {certification.description && (
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-text-secondary border-t border-white/5 pt-3">
              {certification.description}
            </p>
          )}

          {/* FULL CERTIFICATE DOCUMENT VISUALIZER */}
          {certification.hasDocument ? (
            <div className="mt-5 w-full overflow-hidden rounded-xl border border-white/10 bg-surface-deep/90 flex items-center justify-center shadow-inner">
              {certification.documentMimeType?.startsWith("image/") ? (
                <img
                  src={`/api/certifications/${certification.id}/document`}
                  alt={certification.name}
                  className="w-full max-h-[65vh] object-contain p-2 rounded-xl"
                />
              ) : (
                <div className="relative w-full h-[65vh] overflow-hidden rounded-xl bg-white">
                  <iframe
                    src={`/api/certifications/${certification.id}/document#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="absolute -top-1 -left-1 w-[calc(100%+36px)] h-[calc(100%+16px)] border-0"
                    title={`Document ${certification.name}`}
                  />
                </div>
              )}
            </div>
          ) : certification.verificationUrl ? (
            <div className="mt-5 w-full overflow-hidden rounded-xl border border-white/10 bg-surface-deep/90 p-8 text-center flex flex-col items-center justify-center">
              <Award className="size-12 text-accent mb-3 opacity-80" />
              <p className="text-sm text-text-secondary mb-4 max-w-md">
                Cette certification est enregistrée et vérifiable directement auprès de l&apos;organisme d&apos;émission.
              </p>
            </div>
          ) : null}

          {/* Footer CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
            {certification.verificationUrl && (
              <a 
                href={certification.verificationUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-text-on-accent shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {copy.verify} <ArrowUpRight className="size-4" />
              </a>
            )}
            
            {certification.hasDocument && (
              <a 
                href={`/api/certifications/${certification.id}/document`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface-raised px-5 py-2.5 text-xs font-semibold text-text-primary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Download className="size-4" />
                <span>Télécharger le Document</span>
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
