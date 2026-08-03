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
        className="group relative flex flex-col text-left overflow-hidden rounded-[2rem] border border-border/50 bg-surface transition-all duration-500 hover:border-accent/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_10px_40px_-15px_rgba(var(--color-accent-rgb),0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent w-full aspect-[4/3]"
      >
        {/* Loading Skeleton (Only for images, iframes show their own loading state) */}
        {!isLoaded && certification.hasDocument && certification.documentMimeType?.startsWith("image/") && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-raised animate-pulse">
            <LoaderCircle className="size-8 animate-spin text-text-muted/50" />
          </div>
        )}

        {/* Full Bleed Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-bg-page">
          {certification.hasDocument ? (
            certification.documentMimeType?.startsWith("image/") ? (
              <img
                src={`/api/certifications/${certification.id}/document`}
                alt={`Preview of ${certification.name}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`pointer-events-none h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            ) : (
              <div className="relative h-full w-full overflow-hidden bg-white">
                <iframe
                  src={`/api/certifications/${certification.id}/document#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full border-0 transition-transform duration-700 group-hover:scale-105"
                  tabIndex={-1}
                  title={`Preview of ${certification.name}`}
                />
                <div className="absolute inset-0 z-10" aria-hidden="true" />
              </div>
            )
          ) : (
            <div className="grid h-full place-items-center bg-surface-raised text-text-muted">
              <Award className="size-24 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500" />
            </div>
          )}
        </div>
        
        {/* Glassmorphic Overlay for Text */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-6 sm:p-8 pt-24 bg-gradient-to-t from-bg-page via-bg-page/90 to-transparent backdrop-blur-[2px] translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-1.5 mb-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
             <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
               {locale === "fr" ? "Ouvrir" : "Open"}
             </span>
             <ArrowUpRight className="size-3.5 text-accent" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold leading-tight text-text-primary drop-shadow-sm line-clamp-2">
            {certification.name}
          </h2>
          {certification.issuer && (
            <p className="mt-2 text-sm font-mono text-text-secondary truncate drop-shadow-sm">
              {certification.issuer}
            </p>
          )}
        </div>
      </button>

      <dialog 
        ref={dialogRef} 
        className="m-auto w-full max-w-lg rounded-2xl border border-border bg-bg-page p-0 text-text-primary backdrop:bg-black/80 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-full border border-border-strong bg-surface text-accent">
              <Award className="size-6" />
            </div>
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="inline-grid size-10 shrink-0 place-items-center rounded-full bg-surface-raised text-text-muted hover:bg-surface hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              {certification.name}
            </h2>
            {certification.issuer && (
              <p className="mt-2 text-lg text-accent font-medium">
                {certification.issuer}
              </p>
            )}
            {certification.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {certification.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-y border-border py-6">
            <div className="flex items-center gap-3 text-text-secondary">
              <Calendar className="size-5 opacity-70" />
              <span>
                {certification.issuedOn 
                  ? new Date(certification.issuedOn).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" }) 
                  : "—"}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            {certification.verificationUrl && (
              <a 
                href={certification.verificationUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {copy.verify} <ArrowUpRight className="size-4" />
              </a>
            )}
            
            {certification.hasDocument && (
              <a 
                href={`/api/certifications/${certification.id}/document`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Download className="size-4" />
                <span>Document</span>
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
