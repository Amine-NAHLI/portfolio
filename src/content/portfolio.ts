import type {
  Certification,
  PortfolioProject,
  SkillGroup,
  TimelineEntry,
} from "@/types/content";

export const projects: PortfolioProject[] = [
  {
    slug: "stockly",
    title: "Stockly",
    subtitle: {
      fr: "ERP full-stack pour la gestion et le commerce",
      en: "Full-stack ERP for business and inventory management",
    },
    summary: {
      fr: "Une application de gestion articulée autour d'une API REST sécurisée, de rôles métier, d'un tableau de bord analytique et d'exports Excel.",
      en: "A management application built around a secured REST API, business roles, an analytics dashboard and Excel exports.",
    },
    problem: {
      fr: "Réunir dans une même application la gestion métier, le contrôle des accès, le suivi analytique et l'export des données.",
      en: "Bring business management, access control, analytics and data exports together in one application.",
    },
    objectives: [
      { fr: "Structurer les fonctions métier autour d'une API REST", en: "Structure business capabilities around a REST API" },
      { fr: "Distinguer les droits administrateur, gérant et employé", en: "Separate administrator, manager and employee permissions" },
      { fr: "Fournir un suivi analytique et des exports Excel", en: "Provide analytics and Excel exports" },
    ],
    solution: {
      fr: "L'interface Angular consomme une API Spring Boot protégée par JWT. Les droits distinguent administrateur, gérant et employé, tandis qu'Apache POI assure les exports Excel.",
      en: "The Angular interface consumes a JWT-protected Spring Boot API. Permissions distinguish administrator, manager and employee roles, while Apache POI handles Excel exports.",
    },
    architecture: [
      { fr: "Interface Angular 21 avec détection zoneless", en: "Angular 21 interface with zoneless change detection" },
      { fr: "API REST Spring Boot 3.5", en: "Spring Boot 3.5 REST API" },
      { fr: "Authentification JWT et trois rôles métier", en: "JWT authentication and three business roles" },
      { fr: "Exports Excel avec Apache POI", en: "Excel exports with Apache POI" },
    ],
    results: [
      { fr: "60 endpoints REST documentés", en: "60 documented REST endpoints" },
      { fr: "Tableau de bord analytique en temps réel", en: "Real-time analytics dashboard" },
      { fr: "Assistant intelligent intégré avec Groq AI (Llama 3)", en: "Integrated intelligent assistant using Groq AI (Llama 3)" },
    ],
    technologies: ["Angular 21", "Spring Boot 3.5", "JWT", "Apache POI", "Groq AI"],
    categories: ["software", "artificial-intelligence"],
    featured: true,
  },
  {
    slug: "transport-robot",
    title: "Transport Robot",
    subtitle: {
      fr: "Robot autonome guidé par vision artificielle",
      en: "Autonomous robot guided by computer vision",
    },
    summary: {
      fr: "Une architecture distribuée relie un PC de calcul IA à un Raspberry Pi embarqué pour piloter un robot à partir d'un flux vidéo analysé en temps réel.",
      en: "A distributed architecture connects an AI compute PC to an embedded Raspberry Pi to control a robot from a video stream analyzed in real time.",
    },
    problem: {
      fr: "Répartir la perception par vision artificielle et le contrôle embarqué tout en coordonnant les états du robot en temps réel.",
      en: "Distribute computer-vision perception and embedded control while coordinating the robot's states in real time.",
    },
    objectives: [
      { fr: "Analyser le flux vidéo avec un modèle YOLOv8 affiné", en: "Analyze the video stream with a fine-tuned YOLOv8 model" },
      { fr: "Coordonner le PC de calcul et le Raspberry Pi", en: "Coordinate the compute PC and Raspberry Pi" },
      { fr: "Intégrer la lecture de QR codes et les interactions vocales", en: "Integrate QR-code scanning and voice interactions" },
    ],
    solution: {
      fr: "Une machine à états asynchrone et multithread orchestre le flux vidéo, la détection YOLOv8, la lecture de QR codes et les interactions vocales.",
      en: "An asynchronous multithreaded state machine orchestrates the video stream, YOLOv8 detection, QR-code scanning and voice interactions.",
    },
    architecture: [
      { fr: "PC dédié au calcul d'intelligence artificielle", en: "Dedicated PC for AI computation" },
      { fr: "Raspberry Pi pour le contrôle embarqué", en: "Raspberry Pi for embedded control" },
      { fr: "Machine à états asynchrone multithread", en: "Asynchronous multithreaded state machine" },
      { fr: "Communication entre calcul et embarqué", en: "Communication between compute and embedded layers" },
    ],
    results: [
      { fr: "Dataset sur mesure et fine-tuning YOLOv8", en: "Custom dataset and YOLOv8 fine-tuning" },
      { fr: "Scan de QR codes intégré", en: "Integrated QR-code scanning" },
      { fr: "Synthèse vocale avec gTTS", en: "Speech synthesis with gTTS" },
    ],
    technologies: ["YOLOv8", "OpenCV", "Python", "Raspberry Pi", "gTTS"],
    categories: ["artificial-intelligence", "embedded"],
    featured: true,
  },
  {
    slug: "e-upf",
    title: "E-UPF",
    subtitle: {
      fr: "Écosystème universitaire ERP & SIS",
      en: "University ERP & SIS ecosystem",
    },
    summary: {
      fr: "Un écosystème universitaire composé de quatre portails séparés, avec sécurité applicative, réservation d'infrastructures et scellement cryptographique de documents.",
      en: "A university ecosystem composed of four separate portals, with application security, facility booking and cryptographic document sealing.",
    },
    problem: {
      fr: "Séparer les usages de quatre profils universitaires tout en protégeant les accès, les réservations et l'authenticité des documents.",
      en: "Separate the needs of four university profiles while protecting access, bookings and document authenticity.",
    },
    objectives: [
      { fr: "Appliquer des droits distincts à quatre portails", en: "Apply distinct permissions across four portals" },
      { fr: "Prévenir les accès IDOR, les requêtes CSRF et les conflits de réservation", en: "Prevent IDOR access, CSRF requests and booking conflicts" },
      { fr: "Garantir l'intégrité des documents avec une signature RSA", en: "Protect document integrity with RSA signatures" },
    ],
    solution: {
      fr: "L'application Laravel sépare quatre profils, protège les accès sensibles contre les IDOR et le CSRF, puis signe les documents avec une infrastructure RSA.",
      en: "The Laravel application separates four profiles, protects sensitive access against IDOR and CSRF, and signs documents through an RSA infrastructure.",
    },
    architecture: [
      { fr: "Quatre portails aux droits distincts", en: "Four portals with distinct permissions" },
      { fr: "Authentification Laravel Sanctum", en: "Laravel Sanctum authentication" },
      { fr: "Signature asymétrique RSA pour les documents", en: "RSA asymmetric signatures for documents" },
      { fr: "Assistant parental contextuel fondé sur une approche RAG", en: "Contextual parent assistant based on a RAG approach" },
    ],
    results: [
      { fr: "Protection anti-IDOR et CSRF", en: "IDOR and CSRF protections" },
      { fr: "Algorithme anti-collision pour les réservations", en: "Collision-prevention algorithm for bookings" },
      { fr: "Couverture fonctionnelle avec PHPUnit", en: "Functional coverage with PHPUnit" },
    ],
    technologies: ["Laravel 12", "PHPUnit", "Sanctum", "RSA", "RAG"],
    categories: ["software", "cybersecurity", "artificial-intelligence"],
    featured: true,
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "cybersecurity",
    title: { fr: "Cybersécurité & réseau", en: "Cybersecurity & networking" },
    description: {
      fr: "Audit réseau, supervision de sécurité et analyse de vulnérabilités.",
      en: "Network auditing, security monitoring and vulnerability analysis.",
    },
    skills: ["Network pentesting", "Wazuh", "TheHive", "Scapy", "Sockets", "Nmap", "Wireshark", "PKI", "RSA-2048"],
    evidence: ["e-upf"],
  },
  {
    id: "ai-data",
    title: { fr: "Intelligence artificielle & données", en: "Artificial intelligence & data" },
    description: {
      fr: "Machine learning, vision artificielle et intégration de modèles génératifs.",
      en: "Machine learning, computer vision and generative model integration.",
    },
    skills: ["Python", "Scikit-learn", "YOLOv8", "OpenCV", "RAG", "LangChain", "Hugging Face"],
    evidence: ["transport-robot", "stockly", "e-upf"],
  },
  {
    id: "software-engineering",
    title: { fr: "Ingénierie logicielle", en: "Software engineering" },
    description: {
      fr: "Applications web full-stack, APIs, bases de données et qualité logicielle.",
      en: "Full-stack web applications, APIs, databases and software quality.",
    },
    skills: ["React", "Next.js", "Angular", "Spring Boot", "Laravel", "TypeScript", "Supabase", "SQL", "Docker", "PHPUnit"],
    evidence: ["stockly", "e-upf"],
  },
];

export const certifications: Certification[] = [
  {
    id: "tryhackme-offensive-security",
    name: { fr: "Offensive Security & Pre Security Path", en: "Offensive Security & Pre Security Path" },
    issuer: "TryHackMe",
    status: "completed",
    relatedSkills: ["Cybersecurity", "Offensive security"],
    verificationUrl: "https://tryhackme.com/p/nahliAmine",
  },
  {
    id: "security-foundations",
    name: { fr: "Fondements de la sécurité informatique", en: "Foundations of Information Security" },
    issuer: null,
    status: "completed",
    relatedSkills: ["Cybersecurity"],
  },
  {
    id: "n8n-automation",
    name: { fr: "Automatisation avancée n8n", en: "Advanced n8n Automation" },
    issuer: "LinkedIn Learning",
    status: "completed",
    relatedSkills: ["Automation", "n8n"],
  },
];

export const timelineEntries: TimelineEntry[] = [
  {
    id: "inteltrust-2026",
    period: { fr: "Juil. 2026 — aujourd'hui", en: "Jul. 2026 — present" },
    title: { fr: "Ingénieur cybersécurité & IA — Stage PFA", en: "Cybersecurity & AI Engineer — PFA internship" },
    organization: "IntelTrust",
    location: { fr: "Rabat, Maroc", en: "Rabat, Morocco" },
    type: "experience",
    description: {
      fr: "Développement d'outils d'audit réseau et d'un pipeline de données CVE pour l'apprentissage automatique.",
      en: "Development of network-auditing tools and a CVE data pipeline for machine learning.",
    },
    details: [
      { fr: "Smart Network Mapper multithread avec 300 workers", en: "Multithreaded Smart Network Mapper with 300 workers" },
      { fr: "Pipeline NVD/NIST structurant 2,3 millions d'entrées", en: "NVD/NIST pipeline structuring 2.3 million entries" },
      { fr: "Modèle Random Forest de 500 arbres", en: "500-tree Random Forest model" },
    ],
  },
  {
    id: "humanone-2024",
    period: { fr: "Juil. — août 2024", en: "Jul. — Aug. 2024" },
    title: { fr: "Analyste SOC — Stage cybersécurité", en: "SOC Analyst — Cybersecurity internship" },
    organization: "HumanOne",
    location: { fr: "Casablanca, Maroc", en: "Casablanca, Morocco" },
    type: "experience",
    description: {
      fr: "Déploiement d'un environnement de supervision et simulation d'attaques pour tester sa résilience.",
      en: "Deployment of a monitoring environment and attack simulations to test its resilience.",
    },
    details: [
      { fr: "Configuration du SIEM Wazuh", en: "Wazuh SIEM configuration" },
      { fr: "Centralisation des alertes avec TheHive", en: "Alert centralization with TheHive" },
      { fr: "Simulations avec Nmap, Hydra et Wireshark", en: "Simulations using Nmap, Hydra and Wireshark" },
    ],
  },
  {
    id: "upf-2023",
    period: { fr: "2023 — aujourd'hui", en: "2023 — present" },
    title: { fr: "Ingénieur d'État — Génie informatique", en: "State Engineering Degree — Computer Engineering" },
    organization: "Université Privée de Fès",
    location: { fr: "Fès, Maroc", en: "Fez, Morocco" },
    type: "education",
    description: {
      fr: "Formation d'ingénieur en génie informatique, actuellement en troisième année.",
      en: "Computer engineering programme, currently in the third year.",
    },
    details: [],
  },
  {
    id: "baccalaureate-2023",
    period: { fr: "2022 — 2023", en: "2022 — 2023" },
    title: { fr: "Baccalauréat scientifique — Mathématiques", en: "Scientific Baccalaureate — Mathematics" },
    organization: "Lycée Fes City School",
    type: "education",
    description: { fr: "Formation secondaire scientifique.", en: "Scientific secondary education." },
    details: [],
  },
];

export const currentFocus = {
  updatedAt: "2026-07",
  project: {
    fr: "Stage PFA en cybersécurité et intelligence artificielle chez IntelTrust.",
    en: "PFA internship in cybersecurity and artificial intelligence at IntelTrust.",
  },
  work: {
    fr: "Suite d'audit réseau Smart Network Mapper et pipeline de données CVE pour l'apprentissage automatique.",
    en: "Smart Network Mapper auditing suite and CVE data pipeline for machine learning.",
  },
  objective: {
    fr: "Relier ingénierie logicielle, sécurité et intelligence artificielle dans des systèmes concrets.",
    en: "Connect software engineering, security and artificial intelligence in practical systems.",
  },
} as const;

export function getProject(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}
