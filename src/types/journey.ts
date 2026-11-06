export type JourneyTag = {
  name: string;
  nameEn?: string;
  color: "standard" | string;
};

export type JourneyTimelineItem = {
  id: string;
  year: string;
  title: string;
  titleEn: string;
  organization: string;
  location: string;
  type: "education" | "experience";
  categoryLabel: string;
  categoryLabelEn: string;
  award?: string;
  awardEn?: string;
  awardColor?: string;
  status?: "completed" | "in_progress";
  tags: JourneyTag[];
};

export const DEFAULT_JOURNEY_TIMELINE: JourneyTimelineItem[] = [
  {
    id: "bac-sm",
    year: "2022 — 2023",
    title: "Baccalauréat Sciences Mathématiques",
    titleEn: "Baccalaureate in Pure Mathematical Sciences",
    organization: "Fès City School",
    location: "Fès, Maroc",
    type: "education",
    categoryLabel: "FORMATION",
    categoryLabelEn: "EDUCATION",
    tags: [
      { name: "Sciences Mathématiques", color: "standard" },
      { name: "Algèbre & Analyse", color: "standard" },
      { name: "Physique", color: "standard" },
    ],
  },
  {
    id: "upf-cycle-ing",
    year: "2023 — EN COURS",
    title: "Cycle d'Ingénieur en Génie Informatique",
    titleEn: "Master's Degree Cycle in Computer Engineering",
    organization: "Université Privée de Fès (UPF)",
    location: "Fès, Maroc",
    type: "education",
    categoryLabel: "FORMATION",
    categoryLabelEn: "EDUCATION",
    tags: [
      { name: "Cycle Ingénieur d'État", color: "standard" },
      { name: "Architectures Distribuées", color: "standard" },
      { name: "Cybersécurité", color: "standard" },
    ],
  },
  {
    id: "robotics-upf",
    year: "Avril 2026",
    title: "National UPF Robotics Competition – 9ème édition — 3ème prix",
    titleEn: "National UPF Robotics Competition – 9th Edition — 3rd Prize",
    organization: "Université Privée de Fès (UPF)",
    location: "Fès, Maroc",
    type: "experience",
    categoryLabel: "COMPÉTITION",
    categoryLabelEn: "COMPETITION",
    award: "3ème Prix National",
    awardColor: "#F59E0B",
    tags: [
      { name: "Robotique", color: "standard" },
      { name: "Systèmes Embarqués", color: "standard" },
      { name: "Algorithmique Temps Réel", color: "standard" },
    ],
  },
  {
    id: "inteltrust-stage",
    year: "Juil. – Août 2026",
    title: "Stagiaire Développeur Cybersécurité & Intelligence Artificielle",
    titleEn: "Cybersecurity & AI Engineering Intern",
    organization: "IntelTrust",
    location: "Fès, Maroc",
    type: "experience",
    status: "completed",
    categoryLabel: "EXPÉRIENCE",
    categoryLabelEn: "EXPERIENCE",
    tags: [
      { name: "Cybersécurité", color: "standard" },
      { name: "IAM & Zero-Trust", color: "standard" },
      { name: "Python & Go", color: "standard" },
      { name: "Audit Réseau", color: "standard" },
    ],
  },
  {
    id: "gemma-hackathon",
    year: "Juillet 2026",
    title: "1ʳᵉ place – Google Build with Gemma Hackathon (Afrique du Nord)",
    titleEn: "1st Place – Google Build with Gemma Hackathon (North Africa)",
    organization: "AI Crafters & GDG on Campus ENSA Berrechid",
    location: "Afrique du Nord",
    type: "experience",
    categoryLabel: "DISTINCTION & HACKATHON",
    categoryLabelEn: "HONOR & HACKATHON",
    award: "1ère Place Régionale",
    awardColor: "#F59E0B",
    tags: [
      { name: "Google Gemma 2", color: "standard" },
      { name: "Fine-Tuning", color: "standard" },
      { name: "Intelligence Artificielle", color: "standard" },
    ],
  },
];

