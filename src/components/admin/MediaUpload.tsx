"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);

export function MediaUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.has(file.type) || file.size <= 0 || file.size > MAX_SIZE) {
      window.alert("Fichier refusé. Utilisez JPEG, PNG, WebP, AVIF ou PDF, avec une taille maximale de 5 Mo.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body, headers: { Accept: "application/json" } });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Téléversement impossible.");
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Téléversement impossible.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" onChange={upload} disabled={uploading} />
      <button type="button" className="button-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload aria-hidden="true" className="size-4" /> {uploading ? "Téléversement…" : "Téléverser"}
      </button>
    </>
  );
}
