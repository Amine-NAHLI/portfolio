export type PublicSearchEntry = {
  id: string;
  type: "page" | "project" | "skill" | "certification" | "journey" | "article";
  title: string;
  description: string;
  href: string;
  keywords: string[];
};
