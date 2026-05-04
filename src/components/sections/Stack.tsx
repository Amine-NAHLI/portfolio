"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Shield, Cpu, Database, Terminal, Layers, Code2, Globe, Boxes, Search, 
  Layout, Smartphone, Server, Cloud, Github, FileCode, Braces, 
  Gamepad, Brain, Lock, Network, Cog
} from "lucide-react";
import { 
  PythonIcon, JavascriptIcon, ReactIcon, LaravelIcon, 
  NodeIcon, TypescriptIcon, GithubIcon, TailwindIcon, 
  GitIcon, MongoDBIcon, MySQLIcon, LinuxIcon, JavaIcon,
  SpringIcon, DockerIcon, KaliIcon, NmapIcon, WiresharkIcon,
  PostmanIcon, VscodeIcon, FigmaIcon, NextjsIcon, AngularIcon
} from "@/components/ui/Icons";
import { stackFilter } from "@/lib/stackFilter";
import type { PortfolioData } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;

// Comprehensive Icon Mapping
const TECH_ICONS: Record<string, React.FC<any>> = {
  PYTHON: PythonIcon,
  JAVASCRIPT: JavascriptIcon,
  REACT: ReactIcon,
  LARAVEL: LaravelIcon,
  NODE: NodeIcon,
  TYPESCRIPT: TypescriptIcon,
  GITHUB: GithubIcon,
  TAILWIND: TailwindIcon,
  GIT: GitIcon,
  MONGODB: MongoDBIcon,
  MYSQL: MySQLIcon,
  LINUX: LinuxIcon,
  JAVA: JavaIcon,
  SPRING: SpringIcon,
  DOCKER: DockerIcon,
  KALI: KaliIcon,
  NMAP: NmapIcon,
  WIRESHARK: WiresharkIcon,
  POSTMAN: PostmanIcon,
  VSCODE: VscodeIcon,
  FIGMA: FigmaIcon,
  NEXT: NextjsIcon,
  ANGULAR: AngularIcon,
  NEXTJS: NextjsIcon,
  "REACT NATIVE": ReactIcon,
  BASH: Terminal,
  CSS: Code2,
  HTML: FileCode,
  EJS: Braces,
  BLADE: Layout,
  SCSS: Code2,
  DOCKERFILE: DockerIcon,
  JS: JavascriptIcon,
  NODEJS: NodeIcon,
  VSCODE: VscodeIcon,
  REACT: ReactIcon,
  OPENCV: Brain,
  YOLO: Brain,
  METASPLOIT: Shield,
  BURP: Shield,
  VERCEL: Cloud,
};

const STATIC_TECH = [
  // CORE
  { name: "Python", cat: "core" },
  { name: "PHP", cat: "core" },
  { name: "JavaScript", cat: "core" },
  { name: "Java", cat: "core" },
  { name: "Linux", cat: "core" },
  { name: "Bash", cat: "core" },
  { name: "MySQL", cat: "core" },
  { name: "MongoDB", cat: "core" },
  { name: "Git", cat: "core" },
  
  // FRAMEWORKS
  { name: "Laravel", cat: "frameworks" },
  { name: "Spring", cat: "frameworks" },
  { name: "Nodejs", cat: "frameworks" },
  { name: "Angular", cat: "frameworks" },
  { name: "React Native", cat: "frameworks" },
  { name: "Tailwind", cat: "frameworks" },
  { name: "OpenCV", cat: "frameworks" },
  
  // TOOLS
  { name: "Kali", cat: "tools" },
  { name: "GitHub", cat: "tools" },
  { name: "Postman", cat: "tools" },
  { name: "VSCode", cat: "tools" },
  { name: "Figma", cat: "tools" },
];

export default function Stack({ orbit }: { orbit: PortfolioData["techOrbit"] }) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "core" | "frameworks" | "tools">("all");

  const categories = [
    { id: "all", label: "All Tech", icon: Boxes },
    { id: "core", label: "Core", icon: Cpu, color: "var(--accent-cyan)" },
    { id: "frameworks", label: "Frameworks", icon: Database, color: "var(--accent-indigo)" },
    { id: "tools", label: "Tools", icon: Shield, color: "var(--accent-purple)" },
  ];

  const filteredTech = useMemo(() => {
    if (activeTab === "all") return STATIC_TECH;
    return STATIC_TECH.filter(t => t.cat === activeTab);
  }, [activeTab]);

  const handleSelect = (name: string) => {
    const next = activeTech === name ? null : name;
    setActiveTech(next);
    stackFilter.emit(next);
    if (next) {
      const el = document.getElementById("projects");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="stack" className="relative py-32 bg-transparent overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03] grid-bg" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-px bg-accent-cyan/40" />
              <span className="font-mono text-accent-cyan text-[11px] uppercase tracking-[0.5em]">Inventory.load()</span>
            </motion.div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8]">
              Technical <br /> <span className="text-text-4">Arsenal.</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 p-2 rounded-[2.5rem] bg-bg-1 border border-text-1/[0.05] backdrop-blur-2xl">
             {categories.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => setActiveTab(cat.id as any)}
                 className={`relative px-8 py-4 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-700 flex items-center gap-3 overflow-hidden ${
                   activeTab === cat.id ? "text-bg-0" : "text-text-3 hover:text-text-1"
                 }`}
               >
                 {activeTab === cat.id && (
                   <motion.div
                     layoutId="activeTab"
                     className="absolute inset-0 bg-text-1 rounded-full z-0"
                     transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
                   />
                 )}
                 <cat.icon size={16} className="relative z-10" />
                 <span className="relative z-10 font-bold">{cat.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* Dynamic Masonry-like Grid */}
        <div className="relative">
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredTech.map((tech, i) => {
                  const IconComp = TECH_ICONS[tech.name.toUpperCase()] || TECH_ICONS[tech.name.split(' ')[0].toUpperCase()] || Terminal;
                  const accentColor = tech.cat === "core" ? "var(--accent-cyan)" : tech.cat === "frameworks" ? "var(--accent-indigo)" : "var(--accent-purple)";

                  return (
                    <motion.button
                      key={`${tech.cat}-${tech.name}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.8, ease: EASE }}
                      whileHover={{ y: -12, scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(tech.name)}
                      className={`group relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 flex flex-col items-center justify-center gap-4 md:gap-6 text-center overflow-hidden min-h-[160px] md:min-h-[180px] ${
                        activeTech === tech.name 
                          ? "bg-text-1 border-text-1 shadow-[0_20px_50px_rgba(0,0,0,0.4)]" 
                          : "bg-bg-1/40 backdrop-blur-md border-text-1/10 hover:border-white/20 shadow-xl"
                      }`}
                    >
                      {/* Dynamic Background Glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none blur-[40px]"
                        style={{ background: `radial-gradient(circle at center, ${accentColor}, transparent)` }}
                      />

                      {/* Moving Shine Effect */}
                      <motion.div
                        animate={{ 
                          x: ["-100%", "200%"],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "linear",
                          delay: i * 0.2
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                      />

                      {/* Breathing Icon Container */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, 0, -2, 0]
                        }}
                        transition={{ 
                          duration: 4 + (i % 2), 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-inner ${
                          activeTech === tech.name ? "bg-bg-0 text-text-1" : "bg-bg-2/50 text-text-4 group-hover:text-text-1 group-hover:bg-bg-2"
                        }`}
                      >
                        <IconComp size={24} className="relative z-10" />
                        
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 blur-md transition-opacity"
                          style={{ backgroundColor: accentColor }}
                        />
                      </motion.div>

                      <div className="space-y-1 md:space-y-2 relative z-10">
                         <p className={`text-xs md:text-base font-black tracking-tighter leading-none transition-colors ${activeTech === tech.name ? "text-bg-0" : "text-text-1 group-hover:text-accent-cyan"}`}>
                           {tech.name}
                         </p>
                         <div className="flex items-center justify-center gap-2">
                            <motion.div 
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-1 h-1 rounded-full" 
                              style={{ backgroundColor: accentColor }} 
                            />
                            <p className={`font-mono text-[8px] md:text-[9px] uppercase tracking-widest ${activeTech === tech.name ? "text-bg-0/60" : "text-text-4 group-hover:text-text-3"}`}>
                              {tech.cat}
                            </p>
                         </div>
                      </div>

                      {/* Powering-on Bar */}
                      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent w-0 group-hover:w-full transition-all duration-1000 opacity-50" />

                      {/* Active Ring */}
                      {activeTech === tech.name && (
                        <motion.div
                          layoutId="activeRing"
                          className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border-2 border-white/20 pointer-events-none"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filteredTech.length === 0 && (
            <div className="flex flex-col items-center justify-center py-48 space-y-8">
               <div className="w-24 h-24 rounded-full bg-bg-1 border border-text-1/[0.05] flex items-center justify-center text-text-4 animate-pulse">
                 <Search size={32} />
               </div>
               <p className="font-mono text-sm text-text-4 uppercase tracking-[0.5em] text-center">No dynamic records found in this sequence.</p>
            </div>
          )}
        </div>



      </div>
    </section>
  );
}
