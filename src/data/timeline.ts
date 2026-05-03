/**
 * Timeline / journey data — education, skills, projects, milestones.
 */

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  type: "education" | "project" | "skill" | "milestone";
  highlight?: boolean;
};

export const timeline: TimelineEvent[] = [
  {
    year: "2022",
    title: "Started Engineering at UPF Fès",
    description:
      "Began my engineering degree with a focus on computer systems.",
    type: "education",
    highlight: true,
  },
  {
    year: "2023",
    title: "First Full-Stack Projects",
    description:
      "Built my first PHP/MySQL applications. Learned the fundamentals the hard way — no frameworks.",
    type: "project",
  },
  {
    year: "2024",
    title: "Diving Into Security",
    description:
      "Discovered Kali Linux, Nmap, and the world of offensive security. Started building my own tools instead of just using existing ones.",
    type: "skill",
    highlight: true,
  },
  {
    year: "2024",
    title: "Mastered Laravel & Spring Boot",
    description:
      "Shipped 5+ production-grade full-stack apps including hospital management and stock systems.",
    type: "project",
  },
  {
    year: "2025",
    title: "Computer Vision & Robotics",
    description:
      "Built real-time CV systems with OpenCV, MediaPipe, and YOLOv8. Bridged software and hardware.",
    type: "skill",
  },
  {
    year: "2025",
    title: "Smart Network Mapper",
    description:
      "Combined security and AI in a single tool — network scanner with ML-powered vulnerability detection.",
    type: "project",
    highlight: true,
  },
  {
    year: "2026",
    title: "Open to opportunities",
    description:
      "Looking for an internship or first role in security or full-stack with security DNA.",
    type: "milestone",
    highlight: true,
  },
];