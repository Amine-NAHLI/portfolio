export interface Tech {
  name: string;
  level: number; // 0 to 100
}

export interface StackCategory {
  title: string;
  accentColor: string;
  techs: Tech[];
}

export const techStack: StackCategory[] = [
  {
    title: "Security",
    accentColor: "cyan",
    techs: [
      { name: "Penetration Testing", level: 90 },
      { name: "Vulnerability Research", level: 85 },
      { name: "Network Security", level: 88 },
      { name: "Web App Security", level: 92 },
      { name: "Malware Analysis", level: 75 },
    ],
  },
  {
    title: "Backend",
    accentColor: "indigo",
    techs: [
      { name: "Laravel / PHP", level: 95 },
      { name: "Node.js / Express", level: 88 },
      { name: "PostgreSQL", level: 85 },
      { name: "Redis", level: 80 },
      { name: "Docker", level: 82 },
    ],
  },
  {
    title: "Frontend",
    accentColor: "purple",
    techs: [
      { name: "Next.js / React", level: 92 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 85 },
      { name: "Three.js", level: 78 },
    ],
  },
  {
    title: "Mobile",
    accentColor: "pink",
    techs: [
      { name: "React Native", level: 85 },
      { name: "Flutter", level: 70 },
      { name: "Expo", level: 88 },
      { name: "Firebase Auth", level: 82 },
    ],
  },
  {
    title: "AI",
    accentColor: "green",
    techs: [
      { name: "OpenCV", level: 80 },
      { name: "PyTorch", level: 75 },
      { name: "FastAPI", level: 88 },
      { name: "Vector Databases", level: 72 },
    ],
  },
  {
    title: "Tools",
    accentColor: "amber",
    techs: [
      { name: "Git / GitHub", level: 95 },
      { name: "Linux (Debian/Arch)", level: 92 },
      { name: "Figma", level: 80 },
      { name: "VS Code", level: 98 },
    ],
  },
];
