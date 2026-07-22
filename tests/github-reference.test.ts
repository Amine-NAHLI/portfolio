import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseGitHubRepositoryUrl } from "../src/features/github/reference.ts";

describe("parseGitHubRepositoryUrl", () => {
  it("accepts a canonical public repository URL", () => {
    assert.deepEqual(parseGitHubRepositoryUrl("https://github.com/Amine-NAHLI/portfolio"), {
      owner: "Amine-NAHLI", repository: "portfolio", fullName: "Amine-NAHLI/portfolio", htmlUrl: "https://github.com/Amine-NAHLI/portfolio",
    });
  });

  it("normalizes the optional git suffix and trailing slash", () => {
    assert.equal(parseGitHubRepositoryUrl("https://github.com/owner/repo.git/")?.fullName, "owner/repo");
  });

  for (const invalid of [
    "http://github.com/owner/repo", "https://api.github.com/repos/owner/repo", "https://github.com/owner/repo/issues",
    "https://github.com/owner/repo?tab=readme", "https://github.com@evil.example/owner/repo", "https://user:pass@github.com/owner/repo",
    "https://github.com/-invalid/repo", "https://github.com/owner/repo#fragment", "not-a-url", "",
  ]) {
    it(`rejects ${invalid || "an empty value"}`, () => assert.equal(parseGitHubRepositoryUrl(invalid), null));
  }
});
