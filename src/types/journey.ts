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
  challenge?: string;
  challengeEn?: string;
  solution?: string;
  solutionEn?: string;
  githubUrl?: string;
  demoUrl?: string;
  images?: string[];
  imageFit?: "cover" | "contain";
  imagePosition?: "center" | "top" | "bottom" | string;
  enabled?: boolean;
  tags: JourneyTag[];
};

export const DEFAULT_HACKATHONS: JourneyTimelineItem[] = [
  {
    id: "gemma-hackathon",
    year: "Juillet 2026",
    title: "Google Build with Gemma Hackathon — 1ʳᵉ Place Régionale",
    titleEn: "Google Build with Gemma Hackathon — 1st Place Regional Champion",
    organization: "AI Crafters & GDG on Campus ENSA Berrechid",
    location: "Afrique du Nord",
    type: "experience",
    categoryLabel: "COMPÉTITION IA",
    categoryLabelEn: "AI COMPETITION",
    award: "1ʳᵉ Place — Champion Régional",
    awardEn: "1st Place — Regional Champion",
    awardColor: "#A855F7",
    status: "completed",
    challenge: "Concevoir et déployer en 48 heures une application à fort impact sociétal exploitant les modèles Google Gemma 2 avec inférence locale optimisée.",
    challengeEn: "Design and ship within 48 hours a high-impact applied solution leveraging Google Gemma 2 models with low-latency local inference.",
    solution: "SignBridge : Pipeline de vision par ordinateur temps réel extrayant les 21 repères articulaires des mains (MediaPipe) connecté à un modèle Gemma 2 fine-tuné (LoRA) pour la transcription fluide de la langue des signes.",
    solutionEn: "SignBridge: Real-time computer vision pipeline extracting 21 skeletal hand landmarks (MediaPipe) coupled with a fine-tuned Gemma 2 model (LoRA) for fluent sign language translation.",
    githubUrl: "https://github.com/Amine-NAHLI/signbridge",
    images: [],
    tags: [
      { name: "Google Gemma 2", color: "#A855F7" },
      { name: "MediaPipe Vision", color: "#38BDF8" },
      { name: "PyTorch & LoRA", color: "#C8F122" },
      { name: "FastAPI", color: "standard" },
    ],
  },
  {
    id: "robotics-upf",
    year: "Avril 2026",
    title: "National UPF Robotics Competition – 9ᵉ édition — 3ᵉ Prix National",
    titleEn: "National UPF Robotics Competition – 9th Edition — 3rd National Prize",
    organization: "Université Privée de Fès (UPF)",
    location: "Fès, Maroc",
    type: "experience",
    categoryLabel: "ROBOTIQUE EMBARQUÉE",
    categoryLabelEn: "EMBEDDED ROBOTICS",
    award: "3ᵉ Prix National — Podium",
    awardEn: "3rd National Prize — Podium",
    awardColor: "#F59E0B",
    status: "completed",
    challenge: "Concevoir, fabriquer et programmer un robot autonome capable de franchir un circuit d'obstacles complexe en temps record avec contraintes d'arène en direct.",
    challengeEn: "Design, build, and program an autonomous robot capable of navigating a complex obstacle arena in record time under live competitive constraints.",
    solution: "Architecture mécatronique complète : asservissement de trajectoire PID en C++, traitement de télémétrie capteurs ultrasons/IR à haute fréquence (100Hz) et gestion de puissance embarquée.",
    solutionEn: "Complete mechatronic architecture: embedded C++ closed-loop PID trajectory tracking, high-frequency ultrasonic/IR sensor telemetry (100Hz), and embedded power distribution.",
    githubUrl: "https://github.com/Amine-NAHLI",
    images: [],
    tags: [
      { name: "C++ Embarqué", color: "#F59E0B" },
      { name: "Asservissement PID", color: "#10B981" },
      { name: "Microcontrôleurs", color: "#38BDF8" },
      { name: "Capteurs IR & Ultrasons", color: "standard" },
    ],
  },
  {
    id: "upcoming-hackathons",
    year: "2026 — 2027",
    title: "Prochains Sprints & Compétitions d'Ingénierie",
    titleEn: "Upcoming Competitive Sprints & Hackathons",
    organization: "Arènes Internationales & Nationales",
    location: "Maroc & International",
    type: "experience",
    categoryLabel: "SÉLECTION ACTIVE",
    categoryLabelEn: "ACTIVE PIPELINE",
    award: "Inscriptions Validées",
    awardEn: "Registration Confirmed",
    awardColor: "#C8F122",
    status: "in_progress",
    challenge: "Participation continue aux défis technologiques majeurs : CTF cybersécurité (Defensive & Offensive), Hackathons d'IA générative et hackathons robotique/IoT.",
    challengeEn: "Continuous participation in premier technical challenges: cybersecurity CTFs, generative AI buildathons, and autonomous embedded IoT hackathons.",
    solution: "Préparation active des briques logicielles, templates de déploiement instantané et outillage d'audit pour des livraisons de prototypes en moins de 36 heures.",
    solutionEn: "Active preparation of reusable software modules, rapid-deployment templates, and telemetry pipelines for sub-36h prototype execution.",
    githubUrl: "https://github.com/Amine-NAHLI",
    images: [],
    tags: [
      { name: "CTF Cyber Defense", color: "#10B981" },
      { name: "Agents IA Autonomes", color: "#C8F122" },
      { name: "IoT & Zero-Trust", color: "#38BDF8" },
    ],
  },
];

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

