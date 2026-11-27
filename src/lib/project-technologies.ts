/**
 * Utility to filter and prioritize project technologies so card tags
 * reflect authentic, high-impact stacks (languages, frameworks, databases)
 * instead of trivial noise (HTML, SCSS, sub-packages, tooling).
 */

const NOISE_TAGS = new Set([
  "html",
  "html5",
  "css",
  "css3",
  "scss",
  "sass",
  "less",
  "npm",
  "yarn",
  "pnpm",
  "pip",
  "git",
  "github",
  "json",
  "yaml",
  "xml",
  "markdown",
  "mdx",
  "eslint",
  "prettier",
  "babel",
  "webpack",
  "dotenv",
  "cors",
  "axios",
  "expo go",
  "expo-go",
  "expo router",
  "expo-router",
]);

const TECH_WEIGHT: Record<string, number> = {
  // Core Languages
  python: 100,
  typescript: 95,
  java: 90,
  c: 85,
  "c++": 85,
  go: 85,
  rust: 85,
  sql: 80,
  javascript: 68,

  // Frameworks & Major Engines
  "next.js": 95,
  nextjs: 95,
  react: 92,
  "react 19": 92,
  "react native": 95,
  fastapi: 90,
  "spring boot": 90,
  express: 85,
  "node.js": 85,
  nodejs: 85,
  pytorch: 92,
  tensorflow: 90,
  opencv: 88,
  mediapipe: 85,
  yolo: 88,
  nmap: 88,
  scapy: 85,

  // Databases & Backend & Cloud
  postgresql: 86,
  postgres: 86,
  supabase: 83,
  docker: 85,
  mongodb: 80,
  redis: 80,
  graphql: 80,
  prisma: 78,
  firebase: 75,
  sqlite: 75,

  // Specialized UI / Tools
  "tailwind css": 78,
  tailwind: 78,
  expo: 82,
  "maplibre gl": 80,
  maplibre: 80,
  "socket.io": 80,
};

export function getRealisticTechTags(
  technologies: string[],
  coreTechnologies?: string[]
): string[] {
  const source =
    coreTechnologies && coreTechnologies.length > 0
      ? coreTechnologies
      : technologies;

  if (!source || !Array.isArray(source) || source.length === 0) return [];

  // Filter out noise tags
  let cleaned = source
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0 && !NOISE_TAGS.has(t.toLowerCase()));

  // Deduplicate case-insensitively
  const seen = new Set<string>();
  cleaned = cleaned.filter((t) => {
    const lower = t.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });

  // If TypeScript is present, omit redundant JavaScript
  if (cleaned.some((t) => t.toLowerCase() === "typescript")) {
    cleaned = cleaned.filter((t) => t.toLowerCase() !== "javascript");
  }

  // Normalize common naming variations
  cleaned = cleaned.map((t) => {
    const lower = t.toLowerCase();
    if (lower === "react 19") return "React";
    if (lower === "nextjs") return "Next.js";
    if (lower === "nodejs") return "Node.js";
    return t;
  });

  // Sort by technical significance / weight
  cleaned.sort((a, b) => {
    const weightA = TECH_WEIGHT[a.toLowerCase()] ?? 50;
    const weightB = TECH_WEIGHT[b.toLowerCase()] ?? 50;
    return weightB - weightA;
  });

  return cleaned.slice(0, 4);
}
