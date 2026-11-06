"use client";

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { FileText, UploadCloud, CheckCircle2, AlertCircle, ExternalLink, Loader2, RefreshCw } from "lucide-react";

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

export function CVManager({ initialInfo }: { initialInfo?: CVInfo }) {
  const [cvInfo, setCvInfo] = useState<CVInfo>(
    initialInfo || {
      exists: true,
      size: 0,
      updatedAt: null,
      url: "/Amine_Nahli_CV.pdf",
      filename: "Amine_Nahli_CV.pdf",
    }
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial info if not provided
  useEffect(() => {
    if (!initialInfo?.size) {
      fetch("/api/admin/cv")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.exists !== undefined) setCvInfo(data);
        })
        .catch(() => {});
    }
  }, [initialInfo]);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Format non supporté. Veuillez sélectionner un fichier PDF (.pdf).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Le fichier est trop lourd (maximum 15 Mo).");
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

      const res = await fetch("/api/admin/cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erreur lors du téléchargement.");
      }

      setSuccessMessage("Votre CV PDF officiel a été mis à jour avec succès et est en ligne !");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh CV status
      const updatedRes = await fetch("/api/admin/cv");
      const updatedData = await updatedRes.json();
      if (updatedData) setCvInfo(updatedData);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current CV status */}
      <div className="p-4 rounded-sm border border-border/60 bg-surface-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <FileText className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-text-primary">
                {cvInfo.filename}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                EN LIGNE
              </span>
            </div>
            <p className="font-mono text-xs text-text-muted mt-0.5">
              {cvInfo.size > 0 ? formatBytes(cvInfo.size) : "Fichier actif"} · Mis à jour le {formatDate(cvInfo.updatedAt)}
            </p>
          </div>
        </div>

        <a
          href={cvInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border text-xs font-mono text-text-secondary hover:text-text-primary hover:border-accent transition-colors shrink-0"
        >
          <span>Consulter le PDF</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Error & Success Feedback */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400 text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-accent bg-accent/5 scale-[0.99]"
            : "border-border/60 hover:border-accent/60 bg-surface-subtle/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={onFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-full bg-surface border border-border text-accent mb-1">
            <UploadCloud className="size-6" />
          </div>

          <p className="font-display text-sm font-medium text-text-primary">
            {selectedFile ? (
              <span className="text-accent font-semibold">{selectedFile.name}</span>
            ) : (
              "Glissez-déposez votre nouveau CV PDF ici, ou cliquez pour parcourir"
            )}
          </p>

          <p className="font-mono text-xs text-text-muted">
            {selectedFile
              ? `Taille : ${formatBytes(selectedFile.size)} · Prêt à être déployé`
              : "Format PDF uniquement (.pdf) · Max 15 Mo"}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {selectedFile && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            disabled={isUploading}
            className="px-4 py-2 rounded-sm border border-border text-xs font-mono text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-accent text-white font-mono text-xs font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Remplacement en cours...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" />
                <span>Remplacer le CV Officiel</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

