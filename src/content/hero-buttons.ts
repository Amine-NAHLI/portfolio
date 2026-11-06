export type HeroActionButton = {
  id: string;
  labelFr: string;
  labelEn: string;
  url: string;
  style: "primary" | "secondary";
  enabled: boolean;
};

export const DEFAULT_HERO_BUTTONS: HeroActionButton[] = [
  { id: "projects", labelFr: "Explorer les projets", labelEn: "Explore Selected Work", url: "#work", style: "primary", enabled: true },
  { id: "cv", labelFr: "Consulter le CV", labelEn: "View CV", url: "/cv", style: "secondary", enabled: true },
  { id: "contact", labelFr: "Me contacter", labelEn: "Contact Me", url: "#contact", style: "secondary", enabled: false },
  { id: "journey", labelFr: "Mon parcours", labelEn: "My Journey", url: "#journey", style: "secondary", enabled: false },
  { id: "certifications", labelFr: "Certifications", labelEn: "Certifications", url: "#certifications", style: "secondary", enabled: false },
];

