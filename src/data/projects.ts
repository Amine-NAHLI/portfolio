/**
 * Projects data — NO static data.
 * Everything is fetched dynamically from GitHub API via src/lib/github.ts.
 * This file only re-exports the Project type for convenience.
 */

export type { Project } from "@/lib/github";
