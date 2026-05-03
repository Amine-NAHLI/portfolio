export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: "Security" | "Full-Stack" | "AI/Vision" | "Experiments";
  tags: string[];
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Shadow-Mapper",
    description: "Automated network reconnaissance and vulnerability scanning tool with AI-based service identification.",
    year: "2024",
    category: "Security",
    tags: ["Python", "Nmap", "Machine Learning", "Scapy"],
    githubUrl: "https://github.com/nahliamine/shadow-mapper",
  },
  {
    id: "2",
    title: "EcoConnect Platform",
    description: "Full-stack marketplace for sustainable products with real-time inventory tracking and carbon footprint analysis.",
    year: "2024",
    category: "Full-Stack",
    tags: ["Next.js", "Laravel", "PostgreSQL", "TailwindCSS"],
    githubUrl: "https://github.com/nahliamine/ecoconnect",
  },
  {
    id: "3",
    title: "EyeGuard AI",
    description: "Real-time computer vision system for workspace safety monitoring and ergonomic posture correction.",
    year: "2023",
    category: "AI/Vision",
    tags: ["PyTorch", "OpenCV", "FastAPI", "React"],
    githubUrl: "https://github.com/nahliamine/eyeguard-ai",
  },
  {
    id: "4",
    title: "Robo-Arm Control",
    description: "Inverse kinematics solver and 3D simulation for a 6-axis robotic arm using gesture control.",
    year: "2023",
    category: "Experiments",
    tags: ["C++", "ROS", "Three.js", "Mediapipe"],
    githubUrl: "https://github.com/nahliamine/robo-arm",
  },
  {
    id: "5",
    title: "CipherX Vault",
    description: "End-to-end encrypted password manager with biometric authentication and zero-knowledge architecture.",
    year: "2024",
    category: "Security",
    tags: ["Rust", "WASM", "AES-256", "TypeScript"],
    githubUrl: "https://github.com/nahliamine/cipherx",
  },
  {
    id: "6",
    title: "Aura CMS",
    description: "Headless CMS optimized for high-performance static sites with edge-native content delivery.",
    year: "2022",
    category: "Full-Stack",
    tags: ["Go", "Redis", "Next.js", "Docker"],
    githubUrl: "https://github.com/nahliamine/aura-cms",
  },
];
