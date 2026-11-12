"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent, DragEvent } from "react";
import { FileText, UploadCloud, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

type CVInfo = {
  exists: boolean;
  size: number;
  updatedAt: string | null;
  url: string;
  filename: string;
};

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Ko";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Octets", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "Non documenté";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function SingleCVCard({
  locale,
  title,
  subtitle,
  defaultFilename,
}: {
  locale: "fr" | "en";
  title: string;
  subtitle: string;
  defaultFilename: string;
}) {
  const [cvInfo, setCvInfo] = useState<CVInfo>({
    exists: true,
    size: 0,
    updatedAt: null,
    url: `/cv?locale=${locale}&disposition=inline`,
    filename: defaultFilename,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStatus = useCallback(() => {
    fetch(`/api/admin/cv?locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.exists !== undefined) setCvInfo(data);
      })
      .catch(() => {});
  }, [locale]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Format non supporté. Veuillez sélectionner un fichier PDF (.pdf).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Le fichier est trop lourd (maximum 5 Mo).");
      return;
    }

    setSelectedFile(file);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("locale", locale);

      const res = await fetch("/api/admin/cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erreur lors du téléchargement.");
      }

      setSuccessMessage(`Le CV (${locale.toUpperCase()}) a été mis à jour avec succès et est en ligne !`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchStatus();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0B0B0C] overflow-hidden p-6 gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 rounded-lg bg-[#C8F122]/10 text-[#C8F122] border border-[#C8F122]/30 place-items-center text-xs font-bold font-mono">
            {locale.toUpperCase()}
          </span>
          <div>
            <h3 className="text-base font-bold text-[#FFFFFF]">{title}</h3>
            <p className="text-xs text-[#A1A1AA]">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Current file status */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#121316] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#C8F122]/10 border border-[#C8F122]/20 text-[#C8F122]">
            <FileText className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#FFFFFF]">
                {cvInfo.filename}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {cvInfo.exists ? "EN LIGNE" : "NON DISPONIBLE"}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#A1A1AA] mt-0.5">
              {cvInfo.size > 0 ? formatBytes(cvInfo.size) : "Fichier actif"} · Mis à jour : {formatDate(cvInfo.updatedAt)}
            </p>
          </div>
        </div>

        <a
          href={cvInfo.updatedAt ? `${cvInfo.url}${cvInfo.url.includes("?") ? "&" : "?"}v=${encodeURIComponent(cvInfo.updatedAt)}` : cvInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-[#FFFFFF] hover:border-[#C8F122] hover:text-[#C8F122] transition-colors shrink-0"
        >
          <span>Consulter le PDF</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Error & Success Feedback */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
          <AlertCircle className="size-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="size-4 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-[#C8F122] bg-[#C8F122]/10"
            : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={onFileInputChange}
        />

        <div className="p-3 rounded-full bg-white/5 border border-white/10 text-[#A1A1AA]">
          <UploadCloud className="size-6 text-[#C8F122]" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#FFFFFF]">
            Glissez-déposez le fichier PDF ici, ou <span className="text-[#C8F122] underline underline-offset-2">parcourez vos fichiers</span>
          </p>
          <p className="text-[11px] text-[#A1A1AA]">
            Format PDF uniquement · Taille max 5 Mo
          </p>
        </div>

        {selectedFile && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C8F122]/15 border border-[#C8F122]/30 text-xs text-[#C8F122] font-mono">
            <FileText className="size-3.5" />
            <span className="font-semibold">{selectedFile.name}</span>
            <span className="text-[#A1A1AA]">({formatBytes(selectedFile.size)})</span>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8F122] px-5 py-3 font-mono text-xs font-bold text-[#000000] hover:bg-[#D9FB52] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C8F122]/20"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Téléversement en cours...</span>
            </>
          ) : (
            <>
              <UploadCloud className="size-4" />
              <span>Publier ce CV ({locale.toUpperCase()})</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function CVManager() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SingleCVCard
          locale="fr"
          title="Curriculum Vitae (Français)"
          subtitle="Version officielle servie sur /fr et /cv"
          defaultFilename="Amine_Nahli_CV.pdf"
        />
        <SingleCVCard
          locale="en"
          title="Resume / CV (English)"
          subtitle="Version officielle servie sur /en et /cv?locale=en"
          defaultFilename="Amine_Nahli_CV_EN.pdf"
        />
      </div>
    </div>
  );
}