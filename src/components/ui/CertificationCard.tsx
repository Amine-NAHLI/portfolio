/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { Award, Calendar, Download, ArrowUpRight, FileText, X } from "lucide-react";

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
        className="group flex flex-col text-left overflow-hidden rounded-2xl border border-border bg-surface-raised transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent w-full"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-surface-subtle">
          {certification.hasDocument ? (
            certification.documentMimeType?.startsWith("image/") ? (
              <img
                src={`/api/certifications/${certification.id}/document`}
                alt={`Preview of ${certification.name}`}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="relative h-full w-full overflow-hidden bg-white">
                <iframe
                  src={`/api/certifications/${certification.id}/document#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="pointer-events-none absolute inset-0 h-full w-full border-0"
                  tabIndex={-1}
                  title={`Preview of ${certification.name}`}
                />
                <div className="absolute inset-0 z-10" aria-hidden="true" />
              </div>
            )
          ) : (
            <div className="grid h-full place-items-center text-text-muted">
              <Award className="size-16 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-raised/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="flex flex-1 flex-col p-6 w-full">
          <h2 className="text-lg font-semibold leading-snug text-text-primary line-clamp-2">
            {certification.name}
          </h2>
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
