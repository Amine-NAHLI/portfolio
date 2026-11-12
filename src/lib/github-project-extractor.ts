import fs from "node:fs/promises";
import path from "node:path";
import { CANONICAL_CATEGORIES, normalizeProjectCategories } from "@/lib/project-categories";
import { parseAiJson, requestChatbotCompletion, type ChatbotProvider } from "@/lib/ai/chatbot-client";
import { parseGitHubRepositoryUrl } from "@/lib/github-url";
export type { ParsedGitHubRepo } from "@/lib/github-url";
export { parseGitHubRepositoryUrl } from "@/lib/github-url";

export interface GeneratedProjectDraft {
  title: string;
  subtitle_fr: string;
  subtitle_en: string;
  description_fr: string;
  description_en: string;
  problem_fr: string;
  problem_en: string;
  objectives_fr: string[];
  objectives_en: string[];
  solution_fr: string;
  solution_en: string;
  architecture_fr: string[];
  architecture_en: string[];
  results_fr: string[];
  results_en: string[];
  categories: string[];
  technologies: string[];
  github_url: string;
  demo_url: string;
}

export interface GitHubProjectExtractionResult {
  draft: GeneratedProjectDraft;
  meta: {
    repoFullName: string;
    defaultBranch: string;
    provider: ChatbotProvider;
    model: string;
    readmeChars: number;
    treeEntries: number;
    inspectedManifests: string[];
  };
}

const CANONICAL_CATEGORY_IDS = new Set<string>(CANONICAL_CATEGORIES.map((category) => category.id));

const PRIORITY_MANIFEST_PATHS = [
  "package.json",
  "frontend/package.json",
  "backend/package.json",
  "client/package.json",
  "server/package.json",
  "web/package.json",
  "app/package.json",
  "requirements.txt",
  "pyproject.toml",
  "composer.json",
  "Cargo.toml",
  "pom.xml",
  "pubspec.yaml",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "vercel.json",
  "supabase/config.toml",
];

const FALLBACK_SKILL_INSTRUCTIONS = `You are a Senior Software Architect generating bilingual (FR & EN) portfolio case studies from GitHub repositories.
Follow strict grounding (never invent metrics, percentages, users, or features not present in the repository).
Output strict JSON matching:
- title, subtitle_fr, subtitle_en, description_fr, description_en, problem_fr, problem_en, solution_fr, solution_en
- objectives_fr & objectives_en: exactly 4 concise strings each
- architecture_fr & architecture_en: 4 to 5 high-level architectural layers ("Layer Name: concise role")
- results_fr & results_en: exactly 4 concise verified outcomes
- categories: subset of ['ai','cybersecurity','software','dev-web','dev-mobile','dev-desktop','embedded','data-science','e-commerce']
- technologies: 6 to 12 core technologies
- demo_url: live https URL if available else ""`;

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "Amine-Nahli-Portfolio-Extractor",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGitHubJson<T>(url: string, timeoutMs = 15_000): Promise<{ ok: boolean; status: number; data: T | null }> {
  const response = await fetch(url, {
    headers: githubHeaders(),
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false, status: response.status, data: null };
  }

  const data = (await response.json()) as T;
  return { ok: true, status: response.status, data };
}

function decodeGitHubBase64(encoded?: string | null): string {
  if (!encoded) return "";
  return Buffer.from(encoded.replace(/\s+/g, ""), "base64").toString("utf8");
}

function formatManifestSummary(filePath: string, rawContent: string): string {
  if (filePath.endsWith("package.json")) {
    try {
      const pkg = JSON.parse(rawContent) as {
        name?: string;
        description?: string;
        scripts?: Record<string, string>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      return JSON.stringify(
        {
          name: pkg.name,
          description: pkg.description,
          scripts: pkg.scripts ? Object.keys(pkg.scripts).slice(0, 12) : [],
          dependencies: pkg.dependencies ? Object.keys(pkg.dependencies).slice(0, 30) : [],
          devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies).slice(0, 20) : [],
        },
        null,
        2
      );
    } catch {
      return rawContent.slice(0, 1_500);
    }
  }

  return rawContent.slice(0, 1_800);
}

function selectRelevantTreePaths(paths: Array<{ path?: string; type?: string }>): string[] {
  const ignoredPrefixes = ["node_modules/", ".git/", ".next/", "dist/", "build/", "vendor/", "__pycache__/", ".venv/"];
  const ignoredExtensions = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|eot|mp4|pdf|zip|lock)$/i;

  const filtered = paths
    .filter((entry) => {
      const filePath = entry.path ?? "";
      if (!filePath) return false;
      if (ignoredPrefixes.some((prefix) => filePath.startsWith(prefix) || filePath.includes(`/${prefix}`))) return false;
      if (ignoredExtensions.test(filePath)) return false;
      const depth = filePath.split("/").length;
      return entry.type === "tree" ? depth <= 3 : depth <= 3;
    })
    .map((entry) => (entry.type === "tree" ? `${entry.path}/` : entry.path!));

  return filtered.slice(0, 140);
}

async function loadCaseStudySkillPrompt(): Promise<string> {
  const skillPath = path.join(process.cwd(), "skills", "project-case-study", "SKILL.md");
  try {
    const content = await fs.readFile(skillPath, "utf8");
    if (content.trim()) return content;
  } catch {
    // Fallback if runtime filesystem doesn't expose skills folder
  }
  return FALLBACK_SKILL_INSTRUCTIONS;
}

function cleanString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanStringArray(value: unknown, minDesired: number, maxDesired: number, itemMaxLen = 180): string[] {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n/)
      : [];

  const cleaned = list
    .map((item) => (typeof item === "string" ? item.replace(/^[-*•\d.)\s]+/, "").replace(/\s+/g, " ").trim() : ""))
    .filter((item) => Boolean(item) && !/\b(non applicable|not applicable|n\/a)\b/i.test(item))
    .map((item) => item.slice(0, itemMaxLen));

  const deduplicated = Array.from(new Set(cleaned));
  if (deduplicated.length > maxDesired) {
    return deduplicated.slice(0, maxDesired);
  }
  return deduplicated.length >= minDesired ? deduplicated : deduplicated;
}

function normalizeDemoUrl(candidate: unknown, repoHomepage: string | null | undefined, canonicalGithubUrl: string): string {
  const raw = typeof candidate === "string" && candidate.trim() ? candidate.trim() : (repoHomepage ?? "").trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return "";
  if (raw.toLowerCase().startsWith(canonicalGithubUrl.toLowerCase())) return "";
  return raw.slice(0, 300);
}

export async function extractAndGenerateProjectFromGitHub(githubUrl: string): Promise<GitHubProjectExtractionResult> {
  const parsedRepo = parseGitHubRepositoryUrl(githubUrl);
  const repoApiBase = `https://api.github.com/repos/${parsedRepo.owner}/${parsedRepo.repo}`;

  const [repoRes, languagesRes, readmeRes] = await Promise.all([
    fetchGitHubJson<{
      name: string;
      full_name: string;
      description: string | null;
      homepage: string | null;
      topics?: string[];
      language: string | null;
      default_branch?: string;
      stargazers_count?: number;
      forks_count?: number;
      private?: boolean;
    }>(repoApiBase),
    fetchGitHubJson<Record<string, number>>(`${repoApiBase}/languages`),
    fetchGitHubJson<{ content?: string; name?: string; size?: number }>(`${repoApiBase}/readme`),
  ]);

  if (!repoRes.ok || !repoRes.data) {
    if (repoRes.status === 404) {
      throw new Error("Dépôt GitHub introuvable ou privé. Vérifiez le lien (ou le token GitHub configuré).");
    }
    throw new Error(`Impossible de récupérer le dépôt GitHub (HTTP ${repoRes.status}).`);
  }

  const repoMeta = repoRes.data;
  const defaultBranch = repoMeta.default_branch || "main";

  const treeRes = await fetchGitHubJson<{ tree?: Array<{ path?: string; type?: string }> }>(
    `${repoApiBase}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`
  );

  const treeItems = treeRes.data?.tree ?? [];
  const treeFileSet = new Set(treeItems.filter((item) => item.type === "blob" && item.path).map((item) => item.path!));
  const workflowFiles = Array.from(treeFileSet).filter((p) => /^\.github\/workflows\/.+\.ya?ml$/i.test(p)).slice(0, 2);
  const manifestCandidates = [
    ...PRIORITY_MANIFEST_PATHS.filter((candidate) => treeFileSet.has(candidate)),
    ...workflowFiles,
  ].slice(0, 8);

  const manifestPayloads = await Promise.all(
    manifestCandidates.map(async (filePath) => {
      const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
      const res = await fetchGitHubJson<{ content?: string }>(`${repoApiBase}/contents/${encodedPath}`);
      if (!res.ok || !res.data?.content) return null;
      return {
        path: filePath,
        summary: formatManifestSummary(filePath, decodeGitHubBase64(res.data.content)),
      };
    })
  );

  const inspectedManifests = manifestPayloads.filter((item): item is { path: string; summary: string } => Boolean(item));
  const rawReadme = readmeRes.ok && readmeRes.data?.content ? decodeGitHubBase64(readmeRes.data.content) : "";
  const cappedReadme =
    rawReadme.length > 14_000
      ? `${rawReadme.slice(0, 10_500)}\n\n...[README truncated for context budget]...\n\n${rawReadme.slice(-3_000)}`
      : rawReadme;

  const languagesData = languagesRes.data ?? {};
  const totalBytes = Object.values(languagesData).reduce((sum, bytes) => sum + bytes, 0);
  const languageBreakdown =
    totalBytes > 0
      ? Object.entries(languagesData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([lang, bytes]) => `${lang} (${((bytes / totalBytes) * 100).toFixed(1)}%)`)
          .join(", ")
      : repoMeta.language || "Not specified";

  const condensedTree = selectRelevantTreePaths(treeItems);

  const repoContextDocument = [
    `# Repository Metadata`,
    `- Full Name: ${repoMeta.full_name}`,
    `- GitHub URL: ${parsedRepo.canonicalUrl}`,
    `- GitHub Description: ${repoMeta.description || "(none)"}`,
    `- Homepage / Demo URL: ${repoMeta.homepage || "(none)"}`,
    `- Topics: ${(repoMeta.topics ?? []).join(", ") || "(none)"}`,
    `- Languages: ${languageBreakdown}`,
    `- Stars: ${repoMeta.stargazers_count ?? 0}, Forks: ${repoMeta.forks_count ?? 0}`,
    "",
    `# Repository Structure (${treeItems.length} total entries; showing key paths)`,
    condensedTree.length ? condensedTree.join("\n") : "(tree unavailable)",
    "",
    `# Detected Technical Manifests & Configs`,
    inspectedManifests.length
      ? inspectedManifests.map((m) => `## ${m.path}\n\`\`\`\n${m.summary}\n\`\`\``).join("\n\n")
      : "(no manifest files found)",
    "",
    `# README Content (${rawReadme.length} characters)`,
    cappedReadme || "(no README found in repository — rely strictly on metadata, file tree, and manifests)",
  ].join("\n");

  const skillPrompt = await loadCaseStudySkillPrompt();
  const completion = await requestChatbotCompletion({
    temperature: 0.15,
    maxTokens: 3200,
    timeoutMs: 85_000,
    jsonMode: true,
    messages: [
      {
        role: "system",
        content: skillPrompt,
      },
      {
        role: "user",
        content: `Analyze the following GitHub repository and output the structured bilingual case-study JSON following every rule of the project-case-study skill.\n\n${repoContextDocument}`,
      },
    ],
  });

  const rawDraft = parseAiJson<Record<string, unknown>>(completion.content);

  const canonicalCategories = normalizeProjectCategories(
    Array.isArray(rawDraft.categories)
      ? rawDraft.categories.filter((c): c is string => typeof c === "string")
      : []
  ).filter((id) => CANONICAL_CATEGORY_IDS.has(id));

  const technologies = cleanStringArray(rawDraft.technologies, 1, 14, 50);

  const objectivesFr = cleanStringArray(rawDraft.objectives_fr, 1, 4, 180);
  const objectivesEn = cleanStringArray(rawDraft.objectives_en, 1, 4, 180);
  const architectureFr = cleanStringArray(rawDraft.architecture_fr, 1, 5, 220);
  const architectureEn = cleanStringArray(rawDraft.architecture_en, 1, 5, 220);
  const resultsFr = cleanStringArray(rawDraft.results_fr, 1, 4, 180);
  const resultsEn = cleanStringArray(rawDraft.results_en, 1, 4, 180);

  const draft: GeneratedProjectDraft = {
    title: cleanString(rawDraft.title, 120) || repoMeta.name,
    subtitle_fr: cleanString(rawDraft.subtitle_fr, 140),
    subtitle_en: cleanString(rawDraft.subtitle_en, 140),
    description_fr: cleanString(rawDraft.description_fr, 500),
    description_en: cleanString(rawDraft.description_en, 500),
    problem_fr: cleanString(rawDraft.problem_fr, 700),
    problem_en: cleanString(rawDraft.problem_en, 700),
    objectives_fr: objectivesFr,
    objectives_en: objectivesEn,
    solution_fr: cleanString(rawDraft.solution_fr, 700),
    solution_en: cleanString(rawDraft.solution_en, 700),
    architecture_fr: architectureFr,
    architecture_en: architectureEn,
    results_fr: resultsFr,
    results_en: resultsEn,
    categories: canonicalCategories.length ? canonicalCategories : ["software"],
    technologies,
    github_url: parsedRepo.canonicalUrl,
    demo_url: normalizeDemoUrl(rawDraft.demo_url, repoMeta.homepage, parsedRepo.canonicalUrl),
  };

  if (!draft.description_fr || !draft.description_en || !draft.problem_fr || !draft.solution_fr) {
    throw new Error("La génération IA est incomplète. Veuillez réessayer ou compléter manuellement.");
  }

  return {
    draft,
    meta: {
      repoFullName: repoMeta.full_name,
      defaultBranch,
      provider: completion.provider,
      model: completion.model,
      readmeChars: rawReadme.length,
      treeEntries: treeItems.length,
      inspectedManifests: inspectedManifests.map((m) => m.path),
    },
  };
}
