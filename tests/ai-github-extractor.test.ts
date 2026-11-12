import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAiJson } from "../src/lib/ai/chatbot-client.ts";
import { parseGitHubRepositoryUrl } from "../src/lib/github-url.ts";

describe("parseGitHubRepositoryUrl", () => {
  it("normalizes standard, .git, tree subpaths, and owner/repo shorthand", () => {
    assert.deepEqual(parseGitHubRepositoryUrl("https://github.com/Amine-NAHLI/portfolio"), {
      owner: "Amine-NAHLI",
      repo: "portfolio",
      canonicalUrl: "https://github.com/Amine-NAHLI/portfolio",
    });

    assert.deepEqual(parseGitHubRepositoryUrl("https://www.github.com/Amine-NAHLI/7yatk.git"), {
      owner: "Amine-NAHLI",
      repo: "7yatk",
      canonicalUrl: "https://github.com/Amine-NAHLI/7yatk",
    });

    assert.deepEqual(parseGitHubRepositoryUrl("Amine-NAHLI/smart-network-mapper"), {
      owner: "Amine-NAHLI",
      repo: "smart-network-mapper",
      canonicalUrl: "https://github.com/Amine-NAHLI/smart-network-mapper",
    });
  });

  it("rejects non-GitHub hosts, non-HTTPS protocols, and invalid repo segments", () => {
    assert.throws(() => parseGitHubRepositoryUrl(""));
    assert.throws(() => parseGitHubRepositoryUrl("http://github.com/Amine-NAHLI/portfolio"));
    assert.throws(() => parseGitHubRepositoryUrl("https://gitlab.com/Amine-NAHLI/portfolio"));
    assert.throws(() => parseGitHubRepositoryUrl("https://169.254.169.254/latest/meta-data"));
    assert.throws(() => parseGitHubRepositoryUrl("https://github.com/Amine-NAHLI"));
    assert.throws(() => parseGitHubRepositoryUrl("https://github.com/../secret"));
  });
});

describe("parseAiJson", () => {
  it("parses raw JSON, strips think blocks and markdown code fences", () => {
    const raw = `<think>reasoning about repo</think>\n\`\`\`json\n{\n  "title": "7yatk",\n  "objectives_fr": ["A", "B", "C", "D"]\n}\n\`\`\``;
    assert.deepEqual(parseAiJson<{ title: string; objectives_fr: string[] }>(raw), {
      title: "7yatk",
      objectives_fr: ["A", "B", "C", "D"],
    });
  });

  it("extracts inline JSON surrounded by explanatory text", () => {
    const raw = `Voici la réponse demandée: {"categories":["ai","software"]} Fin.`;
    assert.deepEqual(parseAiJson<{ categories: string[] }>(raw), {
      categories: ["ai", "software"],
    });
  });
});

