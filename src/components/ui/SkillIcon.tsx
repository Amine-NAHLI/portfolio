"use client";

import { useState } from "react";

// Mappage spécial pour les technos communes dont le nom diffère du slug de Simple Icons
const customSlugs: Record<string, string> = {
  "next.js": "nextdotjs",
  "node.js": "nodedotjs",
  "vue.js": "vuedotjs",
  "c#": "csharp",
  "c++": "cplusplus",
  "html5": "html5",
  "css3": "css3",
  "tailwind css": "tailwindcss",
  "tailwind": "tailwindcss",
  "react native": "react",
  "aws": "amazonaws",
  "gcp": "googlecloud",
  "postgres": "postgresql",
  "react.js": "react",
};

// Logos qui sont noirs ou très sombres par défaut et invisibles sur fond sombre
const forceWhiteLogos = ["nextdotjs", "vercel", "github", "express", "prisma", "socketdotio", "flask", "shadcnui", "expo"];

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

  const finalUrl = forceWhiteLogos.includes(slug) 
    ? `https://cdn.simpleicons.org/${slug}/white` 
    : `https://cdn.simpleicons.org/${slug}`;

  // eslint-disable-next-line @next/next/no-img-element
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
