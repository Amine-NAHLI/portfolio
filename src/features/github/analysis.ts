import type { GitHubRepositorySnapshot, RepositoryAnalysis, RepositoryDraft, RepositoryFact, RepositoryInference } from "@/features/github/types";

export type RepositoryDraftProvider = {
  id: string;
  analyze: (snapshot: GitHubRepositorySnapshot) => Promise<RepositoryAnalysis>;
};

export const manualRepositoryProvider: RepositoryDraftProvider = {
  id: "manual",
  async analyze(snapshot) {
    const facts: RepositoryFact[] = [
      { label: "Dépôt", value: snapshot.fullName, source: snapshot.htmlUrl },
      { label: "Langages déclarés", value: Object.keys(snapshot.languages), source: "GitHub Languages API" },
      { label: "Langage principal", value: snapshot.primaryLanguage, source: "GitHub Repository API" },
      { label: "Fichiers à la racine", value: snapshot.rootFiles, source: "GitHub Contents API" },
      { label: "Licence", value: snapshot.license, source: "GitHub License API" },
      { label: "Dépôt archivé", value: snapshot.archived, source: "GitHub Repository API" },
      { label: "Dépôt forké", value: snapshot.fork, source: "GitHub Repository API" },
      { label: "Releases récentes", value: snapshot.recentReleases, source: "GitHub Releases API" },
      { label: "Commits récents", value: snapshot.recentCommits, source: "GitHub Commits API" },
    ];
    if (snapshot.description) facts.push({ label: "Description du dépôt", value: snapshot.description, source: "GitHub Repository API" });
    if (snapshot.topics.length) facts.push({ label: "Topics", value: snapshot.topics, source: "GitHub Repository API" });

    const inferences: RepositoryInference[] = [];
    const manifests = snapshot.rootFiles.filter((name) => /^(package\.json|requirements\.txt|pyproject\.toml|pom\.xml|build\.gradle|composer\.json|Cargo\.toml|go\.mod)$/i.test(name));
    if (manifests.length) inferences.push({ label: "Écosystèmes probables", value: manifests, confidence: "high", basis: "Fichiers manifestes présents à la racine" });

    const missingInformation = [
      "Contexte et problème utilisateur à confirmer manuellement.",
      "Rôle personnel et responsabilités à décrire manuellement.",
      "Architecture technique à vérifier à partir du code et de la documentation.",
      "Résultats observables et métriques à fournir avec leurs preuves.",
      "Traductions française et anglaise à rédiger puis relire.",
    ];
    if (!snapshot.readme) missingInformation.push("README absent ou inaccessible.");
    if (!snapshot.license) missingInformation.push("Licence non détectée.");

    const draft: RepositoryDraft = {
      slug: createSlug(snapshot.name),
      titleFr: snapshot.name,
      titleEn: snapshot.name,
      summaryFr: "",
      summaryEn: "",
      repositoryFullName: snapshot.fullName,
      githubUrl: snapshot.htmlUrl,
      demoUrl: snapshot.homepage,
      primaryLanguage: snapshot.primaryLanguage,
      architecture: [],
      results: [],
    };
    return { snapshot, facts, inferences, missingInformation, draft };
  },
};

function createSlug(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100) || "projet";
}
