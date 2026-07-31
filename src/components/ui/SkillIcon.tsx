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

  // Use our internal smart proxy API which handles fallbacks perfectly.
  const finalUrl = `/api/icon/${slug}`;

  return (
    <img 
      src={finalUrl} 
      alt={name}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: '1em', height: '1em', display: 'inline-block' }}
    />
  );
}
