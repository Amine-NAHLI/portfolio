import React from "react";
import { 
  ExternalLink, Code2, Cpu, Database, 
  Terminal, Shield, Globe, Boxes, Search, Layout, 
  Smartphone, Server, Cloud, FileCode, Braces, Brain, 
  Lock, Network, Cog, Zap, Flame, Wind, Droplets
} from "lucide-react";

interface IconProps {
  size?: number;
  className?: string;
}

// Manual SVG Exports for high-priority brand icons (Lucide can be inconsistent across versions)
export const GithubIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedinIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ExternalLinkIcon = ExternalLink;

// Languages
export const PythonIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a5 5 0 0 1 5 5v2a1 1 0 0 0 1 1h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a1 1 0 0 0-1 1v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2a1 1 0 0 0-1-1H1a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2a1 1 0 0 0 1-1V7a5 5 0 0 1 5-5h3z" />
    <path d="M9 9h.01" />
    <path d="M15 15h.01" />
  </svg>
);

export const JavascriptIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3h18v18H3z" />
    <path d="M15 9h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
    <path d="M9 9v6" />
  </svg>
);

export const TypescriptIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3h18v18H3z" />
    <path d="M13 9h4" />
    <path d="M15 9v6" />
    <path d="M7 9h4" />
    <path d="M9 9v6" />
  </svg>
);

export const JavaIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 15c0 3 3 5 6 5s6-2 6-5" />
    <path d="M9 12c0 2 1 3 3 3s3-1 3-3" />
    <path d="M12 2v6" />
    <path d="M9 3v4" />
    <path d="M15 3v4" />
  </svg>
);

// Frameworks
export const ReactIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 21.5c4.832 0 8.75-4.253 8.75-9.5S16.832 2.5 12 2.5 3.25 6.753 3.25 12s3.918 9.5 8.75 9.5z" />
    <path d="M20.22 16.75c2.416-4.184 1.458-9.06-2.14-11.138s-8.172-.078-10.588 4.106-1.458 9.06 2.14 11.138 8.172.078 10.588-4.106z" />
    <path d="M3.78 16.75c-2.416-4.184-1.458-9.06 2.14-11.138s8.172-.078 10.588 4.106 1.458 9.06-2.14 11.138-8.172.078-10.588-4.106z" />
  </svg>
);

export const LaravelIcon = Server;
export const NodeIcon = Cpu;
export const SpringIcon = Zap;
export const NextjsIcon = Globe;
export const AngularIcon = Shield;
export const TailwindIcon = Wind;

// Tools
export const GitIcon = Network;
export const MongoDBIcon = Database;
export const MySQLIcon = Database;
export const LinuxIcon = Terminal;
export const DockerIcon = Boxes;
export const KaliIcon = Shield;
export const NmapIcon = Search;
export const WiresharkIcon = Shield;
export const PostmanIcon = ExternalLink;
export const VscodeIcon = Code2;
export const FigmaIcon = Layout;
