export interface ParsedGitHubRepo {
  owner: string;
  repo: string;
  canonicalUrl: string;
}

const VALID_SEGMENT_RE = /^[A-Za-z0-9_.-]{1,100}$/;

export function parseGitHubRepositoryUrl(rawUrl: string): ParsedGitHubRepo {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error("Veuillez saisir un lien GitHub valide.");
  }

  let candidate = trimmed;
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(candidate)) {
    candidate = `https://github.com/${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("Format d'URL GitHub invalide (ex: https://github.com/Amine-NAHLI/projet).");
  }

  if (parsed.protocol !== "https:" || (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com")) {
    throw new Error("Seuls les liens https://github.com/<owner>/<repo> sont autorisés.");
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error("Le lien GitHub doit contenir le propriétaire et le nom du dépôt.");
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, "");
  if (
    !VALID_SEGMENT_RE.test(owner) ||
    !VALID_SEGMENT_RE.test(repo) ||
    owner === "." ||
    owner === ".." ||
    repo === "." ||
    repo === ".."
  ) {
    throw new Error("Nom de dépôt GitHub invalide.");
  }

  return {
    owner,
    repo,
    canonicalUrl: `https://github.com/${owner}/${repo}`,
  };
}

