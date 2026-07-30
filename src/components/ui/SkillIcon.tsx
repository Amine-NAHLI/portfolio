/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

// Mappage spécial pour les technos communes dont le nom diffère du slug attendu par skillicons.dev
const customSlugs: Record<string, string> = {
  "next.js": "nextjs",
  "next": "nextjs",
  "node.js": "nodejs",
  "node": "nodejs",
  "vue.js": "vue",
  "c#": "cs",
  "c++": "cpp",
  "html5": "html",
  "css3": "css",
  "tailwind css": "tailwind",
  "tailwindcss": "tailwind",
  "react native": "react",
  "postgres": "postgres",
  "postgresql": "postgres",
  "react.js": "react",
  "js": "js",
  "javascript": "js",
  "ts": "ts",
  "typescript": "ts",
  "my sql": "mysql",
  "sql server": "azure", // SQL server typically maps to azure/database icon
  "c sharp": "cs",
  ".net": "dotnet",
  "golang": "go",
  "spring boot": "spring",
  "k8s": "kubernetes",
  "express.js": "express",
  "expressjs": "express",
  "amazon web services": "aws",
  "google cloud": "gcp",
  "google cloud platform": "gcp"
};


export default function SkillIcon({ name, className = "" }: { name: string; className?: string }) {
  const [error, setError] = useState(false);

  const cleanName = name.toLowerCase().trim();
  const slug = customSlugs[cleanName] || cleanName.replace(/[^a-z0-9]/g, "");
  
  // Génère des couleurs pour le fallback en fonction du texte (toujours la même couleur pour un même texte)
  const getColors = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return {
      bg: `hsl(${h}, 60%, 20%)`,
      text: `hsl(${h}, 80%, 80%)`,
    };
  };

  const firstLetter = name.charAt(0).toUpperCase();
  const colors = getColors(name);

  if (error) {
    return (
      <div 
        className={`flex shrink-0 items-center justify-center rounded-full font-sans font-bold leading-none ${className}`}
        style={{ backgroundColor: colors.bg, color: colors.text, width: '1em', height: '1em', fontSize: '1em' }}
        title={name}
      >
        <span style={{ transform: 'scale(0.65)' }}>{firstLetter}</span>
      </div>
    );
  }

  // Use skillicons.dev for a modern, colorful look. We pass the slug.
  // Skillicons uses specific short names, but handles many standard ones well.
  const finalUrl = `https://skillicons.dev/icons?i=${slug}`;

  return (
    <img 
      src={finalUrl} 
      alt={name}
      title={name}
      className={`shrink-0 object-contain ${className}`}
      onError={() => setError(true)}
      style={{ width: '1em', height: '1em', display: 'inline-block' }}
    />
  );
}
