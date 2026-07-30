-- Ajout de la colonne featured pour les certifications et les témoignages
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
