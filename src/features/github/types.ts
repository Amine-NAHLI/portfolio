import type { Json } from "@/types/database";

export type GitHubRepositoryReference = { owner: string; repository: string; fullName: string; htmlUrl: string };

export type GitHubRepositorySnapshot = GitHubRepositoryReference & {
  name: string;
  description: string | null;
  defaultBranch: string;
  primaryLanguage: string | null;
  languages: Record<string, number>;
  topics: string[];
  homepage: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
  archived: boolean;
  fork: boolean;
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  license: string | null;
  readme: string | null;
  rootFiles: string[];
  recentReleases: { tag: string; publishedAt: string | null }[];
  recentCommits: { sha: string; date: string | null }[];
  fetchedAt: string;
};

export type RepositoryFact = { label: string; value: Json; source: string };
export type RepositoryInference = { label: string; value: Json; confidence: "low" | "medium" | "high"; basis: string };

export type RepositoryDraft = {
  slug: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  repositoryFullName: string;
  githubUrl: string;
  demoUrl: string | null;
  primaryLanguage: string | null;
  architecture: string[];
  results: string[];
};

export type RepositoryAnalysis = {
  snapshot: GitHubRepositorySnapshot;
  facts: RepositoryFact[];
  inferences: RepositoryInference[];
  missingInformation: string[];
  draft: RepositoryDraft;
};
