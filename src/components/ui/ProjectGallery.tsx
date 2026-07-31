/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = {
  mediaId: string;
  url: string;
  altFr: string | null;
  altEn: string | null;
};

type ProjectGalleryProps = {
  images: GalleryImage[];
  locale: string;
};

export default function ProjectGallery({ images, locale }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) return null;

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="group relative w-full overflow-hidden rounded-2xl border border-border bg-surface-subtle shadow-lg">
        <div className="aspect-[16/9] w-full bg-surface-deep relative p-6 sm:p-10 md:p-16 flex items-center justify-center">
          <img 
            src={images[selectedIndex].url} 
            alt={locale === "fr" ? images[selectedIndex].altFr ?? "" : images[selectedIndex].altEn ?? ""} 
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Image précédente"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button 
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Image suivante"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "size-2.5 rounded-full transition-all border border-black/20",
                    index === selectedIndex ? "bg-accent scale-125" : "bg-white hover:bg-gray-200"
                  )}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && (
        <dialog 
          open
          className="fixed inset-0 z-[100] m-0 grid h-dvh w-dvw place-items-center bg-black/90 p-0 open:animate-in open:fade-in-0"
          onClose={() => setLightboxOpen(false)}
        >
          <button 
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 z-[101] grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="size-6" />
          </button>
          
          <img 
            src={images[selectedIndex].url} 
            alt={locale === "fr" ? images[selectedIndex].altFr ?? "" : images[selectedIndex].altEn ?? ""} 
            className="max-h-[90dvh] max-w-[90dvw] object-contain"
          />

          {images.length > 1 && (
            <>
              <button 
                type="button"
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-[101] grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button 
                type="button"
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-[101] grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </dialog>
      )}
    </>
  );
}
