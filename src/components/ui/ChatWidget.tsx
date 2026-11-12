"use client";

import React, { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, RotateCcw, Terminal, Volume2, VolumeX, X } from "lucide-react";

type EntryRole = "banner" | "input" | "stdout" | "error" | "muted" | "ai";

interface TerminalEntry {
  id: string;
  role: EntryRole;
  content: string;
  cwd?: string;
}

interface PageShellContext {
  title: string;
  summary: string;
  welcome: string;
  entries: string[];
  files: Record<string, string>;
}

const MAX_QUERIES = 25;
const WARNING_QUERY_COUNT = 22;
const SESSION_EXPIRY_MS = 10 * 60 * 1000;
const STORAGE_KEY = "portfolio_tty_buffer_v2";
const ACTIVITY_KEY = "portfolio_tty_activity_v2";

const PROJECT_SLUGS = [
  "7yatk",
  "smart-network-mapper",
  "stockly-gestion-de-stock-et-commerce-de-proximite",
  "asl-real-time-detection",
  "transport-yolo-robot",
  "e-upf-portail-gestion",
];

const ROUTE_ALIASES: Record<string, string> = {
  home: "/",
  root: "/",
  "~": "/",
  project: "/projects",
  projects: "/projects",
  work: "/projects",
  journey: "/journey",
  parcours: "/journey",
  cert: "/certifications",
  certs: "/certifications",
  certification: "/certifications",
  certifications: "/certifications",
  contact: "/contact",
  skill: "/skills",
  skills: "/skills",
  testimonial: "/testimonials",
  testimonials: "/testimonials",
};

const AVAILABLE_COMMANDS = [
  "help",
  "man",
  "ls",
  "ll",
  "cd",
  "pwd",
  "cat",
  "tree",
  "info",
  "neofetch",
  "whoami",
  "id",
  "uname",
  "projects",
  "journey",
  "skills",
  "certifications",
  "contact",
  "cv",
  "open",
  "ask",
  "echo",
  "date",
  "history",
  "clear",
  "exit",
];

function extractLocale(pathname: string): "fr" | "en" {
  return pathname.startsWith("/en") ? "en" : "fr";
}

function toVirtualPath(pathname: string): string {
  const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, "");
  return stripped || "/";
}

function getPageShellContext(virtualPath: string, locale: "fr" | "en"): PageShellContext {
  const isFr = locale === "fr";

  if (virtualPath === "/projects") {
    return {
      title: isFr ? "Projets" : "Projects",
      summary: isFr
        ? "Index des réalisations d'ingénierie (Cybersécurité, IA, Full-Stack)"
        : "Engineering project portfolio (Cybersecurity, AI, Full-Stack)",
      welcome: isFr
        ? [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Bienvenue dans /projects — Explorateur des réalisations d'Amine NAHLI.",
            "Commandes locales : 'ls', 'cd <slug>', 'cat README.md', 'cd ..' ou posez une question sur un projet.",
          ].join("\n")
        : [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Welcome to /projects — Engineering Showcase Explorer.",
            "Local commands: 'ls', 'cd <slug>', 'cat README.md', 'cd ..' or ask anything about the projects.",
          ].join("\n"),
      entries: [...PROJECT_SLUGS.map((s) => `${s}/`), "README.md"],
      files: {
        "readme.md": [
          "# /projects",
          "01. 7yatk                                              — Offline mesh rescue & telemetry",
          "02. smart-network-mapper                               — AI network audit & anomaly detection",
          "03. stockly-gestion-de-stock-et-commerce-de-proximite  — SaaS retail POS & inventory ledger",
          "04. asl-real-time-detection                            — MediaPipe + PyTorch sign translation",
          "05. transport-yolo-robot                               — Real-time YOLOv8 robotics pipeline",
          "06. e-upf-portail-gestion                              — Encrypted RBAC academic portal",
          "",
          "Tip: run 'cd smart-network-mapper' to open that project's case study.",
        ].join("\n"),
      },
    };
  }

  if (virtualPath.startsWith("/projects/")) {
    const slug = virtualPath.replace("/projects/", "").split("/")[0];
    return {
      title: slug,
      summary: isFr ? `Étude de cas active : ${slug}` : `Active case study: ${slug}`,
      welcome: isFr
        ? [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            `Bienvenue sur l'étude de cas '${slug}'.`,
            "Commandes locales : 'ls', 'cat README.md', 'cd ..' (retour à /projects) ou posez une question sur ce projet.",
          ].join("\n")
        : [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            `Welcome to case study '${slug}'.`,
            "Local commands: 'ls', 'cat README.md', 'cd ..' (back to /projects) or ask any question about this project.",
          ].join("\n"),
      entries: ["README.md", "architecture.note", "case-study.url"],
      files: {
        "readme.md": [
          `# Project: ${slug}`,
          `Path   : ${virtualPath}`,
          `Prompt : Ask anything directly (e.g. architecture, stack, security design, metrics).`,
        ].join("\n"),
        "architecture.note": isFr
          ? `Posez directement une question sur l'architecture de '${slug}' pour interroger la base de connaissances.`
          : `Ask directly about '${slug}' architecture to query the portfolio AI daemon.`,
      },
    };
  }

  if (virtualPath === "/journey") {
    return {
      title: isFr ? "Parcours" : "Journey",
      summary: isFr
        ? "Trajectoire académique (UPF), stages & distinctions"
        : "Academic path (UPF), internships & honors",
      welcome: isFr
        ? [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Bienvenue dans /journey — Itinéraire académique, stages & compétitions.",
            "Commandes locales : 'ls', 'cat timeline.log', 'cat awards.txt', 'cd /' ou posez une question.",
          ].join("\n")
        : [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Welcome to /journey — Academic roadmap, internships & competitions.",
            "Local commands: 'ls', 'cat timeline.log', 'cat awards.txt', 'cd /' or ask any question.",
          ].join("\n"),
      entries: ["timeline.log", "awards.txt", "education.md"],
      files: {
        "timeline.log": [
          "[2022 - 2023]  Baccalaureate in Mathematical Sciences — Fes City School",
          "[2023 - NOW ]  State Engineering Degree in Computer Science — UPF Fes",
          "[Apr 2026   ]  3rd Prize — National UPF Robotics Competition (9th Ed.)",
          "[Jul-Aug 26 ]  Cybersecurity & AI Intern — IntelTrust",
          "[Jul 2026   ]  1st Place — Google Build with Gemma Hackathon (North Africa)",
        ].join("\n"),
        "awards.txt": [
          "* 1st Place — Google Build with Gemma Hackathon (North Africa, Jul 2026)",
          "* 3rd Prize — National UPF Robotics Competition 9th Edition (Apr 2026)",
        ].join("\n"),
        "education.md": [
          "Institution : Universite Privee de Fes (UPF)",
          "Program     : Computer Engineering (4th Year, Cybersecurity & AI track)",
        ].join("\n"),
      },
    };
  }

  if (virtualPath === "/certifications") {
    return {
      title: "Certifications",
      summary: isFr
        ? "Accréditations officielles & certificats vérifiables"
        : "Verified credentials & technical certifications",
      welcome: isFr
        ? [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Bienvenue dans /certifications — Diplômes et accréditations vérifiables.",
            "Commandes locales : 'ls', 'cat certs.json', 'cd /' ou posez une question.",
          ].join("\n")
        : [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Welcome to /certifications — Verified credentials and technical certificates.",
            "Local commands: 'ls', 'cat certs.json', 'cd /' or ask any question.",
          ].join("\n"),
      entries: ["certs.json", "tryhackme.cert", "datacamp.cert", "cisco.cert"],
      files: {
        "certs.json": [
          "{",
          '  "verified": [',
          '    { "issuer": "TryHackMe", "title": "Pre-Security Learning Path" },',
          '    { "issuer": "DataCamp", "title": "AI Engineer for Developers Associate" },',
          '    { "issuer": "DeepLearning.AI", "title": "Deep Learning & Neural Networks" },',
          '    { "issuer": "Cisco", "title": "CCNA: Introduction to Networks" }',
          "  ]",
          "}",
        ].join("\n"),
      },
    };
  }

  if (virtualPath === "/contact") {
    return {
      title: "Contact",
      summary: isFr ? "Canaux directs & téléchargement du CV" : "Direct contact channels & resume",
      welcome: isFr
        ? [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Bienvenue dans /contact — Coordonnées directes et transmission de messages.",
            "Commandes locales : 'ls', 'cat channels.txt', 'cv', 'cd /' ou posez une question.",
          ].join("\n")
        : [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Welcome to /contact — Direct reachability channels & resume access.",
            "Local commands: 'ls', 'cat channels.txt', 'cv', 'cd /' or ask any question.",
          ].join("\n"),
      entries: ["channels.txt", "resume.pdf"],
      files: {
        "channels.txt": [
          "email    : nahli-ami@upf.ac.ma",
          "linkedin : [linkedin.com/in/amine-nahli](https://linkedin.com/in/amine-nahli)",
          "github   : [github.com/nahliAmine](https://github.com/nahliAmine)",
          `resume   : [Download CV (/cv?locale=${locale})](/cv?locale=${locale})`,
        ].join("\n"),
      },
    };
  }

  if (virtualPath === "/skills") {
    return {
      title: isFr ? "Compétences" : "Skills",
      summary: isFr ? "Matrice technique & domaines d'ingénierie" : "Technical stack & engineering domains",
      welcome: isFr
        ? [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Bienvenue dans /skills — Pile technique Cybersécurité, IA & Développement.",
            "Commandes locales : 'ls', 'cat skills.yml', 'cd /' ou posez une question.",
          ].join("\n")
        : [
            `AmineOS 2.4 LTS — tty1  [${virtualPath}]`,
            "Welcome to /skills — Cybersecurity, AI & Software Engineering matrix.",
            "Local commands: 'ls', 'cat skills.yml', 'cd /' or ask any question.",
          ].join("\n"),
      entries: ["skills.yml", "about.md"],
      files: {
        "skills.yml": [
          "security: [IAM, Zero-Trust, Network Auditing, TryHackMe, OWASP]",
          "ai_ml:    [PyTorch, YOLOv8, MediaPipe, Random Forest, LLM Pipelines]",
          "systems:  [Next.js, TypeScript, Node.js, Python, PostgreSQL, Supabase, Docker]",
        ].join("\n"),
      },
    };
  }

  return {
    title: isFr ? "Accueil" : "Home",
    summary: isFr ? "Racine du portfolio d'Amine NAHLI" : "Amine NAHLI portfolio root",
    welcome: isFr
      ? [
          "AmineOS 2.4 LTS — tty1  [/]",
          "Bienvenue à la racine du portfolio d'Amine NAHLI (Cyber · IA · Génie Logiciel).",
          "Tapez 'ls', 'cd projects', 'help' (Tab pour compléter) ou posez n'importe quelle question.",
        ].join("\n")
      : [
          "AmineOS 2.4 LTS — tty1  [/]",
          "Welcome to Amine NAHLI's Engineering Portfolio Root (Cyber · AI · Software).",
          "Type 'ls', 'cd projects', 'help' (Tab to autocomplete) or ask anything directly.",
        ].join("\n"),
    entries: [
      "projects/",
      "journey/",
      "certifications/",
      "skills/",
      "contact/",
      "about.md",
      "resume.pdf",
    ],
    files: {
      "about.md": [
        "# Amine NAHLI",
        "Role      : 4th-year Computer Engineering Student (UPF Fes)",
        "Focus     : Defensive Cybersecurity (IAM, Zero-Trust) · Applied AI · Full-Stack",
        "Highlight : 1st Place — Google Build with Gemma Hackathon 2026 (North Africa)",
        "Location  : Fes, Morocco",
      ].join("\n"),
    },
  };
}

export default function ChatWidget() {
  const pathname = usePathname() || "/fr";
  const router = useRouter();
  const locale = extractLocale(pathname);
  const virtualPath = toVirtualPath(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [entries, setEntries] = useState<TerminalEntry[]>(() => {
    const initBanner: TerminalEntry = {
      id: `boot-${virtualPath}`,
      role: "banner",
      content: getPageShellContext(virtualPath, locale).welcome,
    };

    if (typeof window === "undefined") return [initBanner];

    const lastActivity = localStorage.getItem(ACTIVITY_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (lastActivity && saved) {
      const expired = Date.now() - parseInt(lastActivity, 10) > SESSION_EXPIRY_MS;
      if (!expired) {
        try {
          const parsed = JSON.parse(saved) as TerminalEntry[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstIsSameRoute = parsed[0]?.id === `boot-${virtualPath}`;
            if (firstIsSameRoute) return parsed;
            return [...parsed, initBanner];
          }
        } catch {
          return [initBanner];
        }
      }
    }
    return [initBanner];
  });

  const lastPathRef = useRef<string>(virtualPath);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const focusTerminalInput = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  const setInputAndCursor = (val: string) => {
    setInputValue(val);
    setCursorPos(val.length);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(val.length, val.length);
      }
    });
  };

  const playBeep = (freq = 760) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio context blocked by browser policy
    }
  };

  // Emit contextual welcome message whenever navigating to a different page
  useEffect(() => {
    if (lastPathRef.current === virtualPath) return;
    lastPathRef.current = virtualPath;
    const ctx = getPageShellContext(virtualPath, locale);
    setEntries((prev) => [
      ...prev,
      {
        id: `route-${Date.now()}-${virtualPath}`,
        role: "banner",
        content: ctx.welcome,
      },
    ]);
  }, [virtualPath, locale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-80)));
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
    }
  }, [entries]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [entries, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => focusTerminalInput(), 60);
    }
  }, [isOpen]);

  const appendEntry = (role: EntryRole, content: string, entryCwd?: string) => {
    setEntries((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, content, cwd: entryCwd },
    ]);
  };

  const clearTerminal = () => {
    const ctx = getPageShellContext(virtualPath, locale);
    setEntries([
      {
        id: `boot-${virtualPath}-${Date.now()}`,
        role: "banner",
        content: ctx.welcome,
      },
    ]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
    }
    setInputAndCursor("");
    setHistoryIndex(-1);
    playBeep(640);
  };

  const resolveCdTarget = (arg: string): string | null => {
    const clean = arg.trim().replace(/\/+$/, "").toLowerCase();
    if (!clean || clean === "~" || clean === "/") return "/";

    if (clean === "..") {
      if (virtualPath === "/") return "/";
      const segments = virtualPath.split("/").filter(Boolean);
      segments.pop();
      return segments.length === 0 ? "/" : `/${segments.join("/")}`;
    }

    if (clean === ".") return virtualPath;

    const withoutLeadingSlash = clean.replace(/^\/+/, "");

    if (ROUTE_ALIASES[withoutLeadingSlash]) {
      return ROUTE_ALIASES[withoutLeadingSlash];
    }

    if (withoutLeadingSlash.startsWith("projects/") || withoutLeadingSlash.startsWith("project/")) {
      const slug = withoutLeadingSlash.split("/")[1];
      if (slug && PROJECT_SLUGS.includes(slug)) {
        return `/projects/${slug}`;
      }
    }

    if (PROJECT_SLUGS.includes(withoutLeadingSlash)) {
      return `/projects/${withoutLeadingSlash}`;
    }

    return null;
  };

  const navigateVirtualPath = (targetVirtualPath: string) => {
    const nextUrl = targetVirtualPath === "/" ? `/${locale}` : `/${locale}${targetVirtualPath}`;
    if (nextUrl === pathname) return;
    router.push(nextUrl);
  };

  const runShellBuiltin = (rawInput: string): boolean => {
    const trimmed = rawInput.trim();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const argStr = args.join(" ");
    const pageCtx = getPageShellContext(virtualPath, locale);

    if (cmd === "clear" || cmd === "cls") {
      clearTerminal();
      return true;
    }

    if (cmd === "exit" || cmd === "quit") {
      appendEntry("input", trimmed, virtualPath);
      appendEntry("muted", "logout");
      setInputAndCursor("");
      setTimeout(() => setIsOpen(false), 160);
      return true;
    }

    if (cmd === "help" || cmd === "man") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry(
        "stdout",
        [
          `NAHLISH(1)             Context: ${virtualPath}             NAHLISH(1)`,
          "",
          "ROUTE-SYNCED NAVIGATION",
          "  ls / ll           list contents of current page",
          "  cd <dir>          navigate (/, .., projects, journey, certifications, contact)",
          "  pwd               print current route path",
          "  cat <file>        inspect page file in current directory",
          "  info              show active page summary",
          "  tree              display full site directory tree",
          "",
          "SYSTEM & PORTFOLIO",
          "  neofetch          display Amine NAHLI system profile",
          "  whoami / id       show visitor & target engineer identity",
          "  open <target>     open external/page link (github, linkedin, cv)",
          "  history / clear   inspect shell history or reset buffer (Ctrl+L)",
          "",
          "AI SHELL",
          `  Type any question in FR/EN/AR — answered with context of '${virtualPath}'.`,
        ].join("\n")
      );
      playBeep();
      return true;
    }

    if (cmd === "pwd") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", virtualPath);
      return true;
    }

    if (cmd === "info") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", `[${pageCtx.title}] ${pageCtx.summary}\npath: ${virtualPath}`);
      return true;
    }

    if (cmd === "cd") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      const resolved = resolveCdTarget(argStr || "/");
      if (!resolved) {
        appendEntry("error", `nahli-sh: cd: ${argStr}: No such route or directory`);
        return true;
      }
      if (resolved === virtualPath) {
        appendEntry("muted", `already at ${virtualPath}`);
        return true;
      }
      appendEntry("muted", `cd -> ${resolved}`);
      navigateVirtualPath(resolved);
      playBeep(820);
      return true;
    }

    if (cmd === "ls" || cmd === "ll" || cmd === "dir") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      const longMode = cmd === "ll" || args.some((a) => a.includes("l"));
      const targetArg = args.find((a) => !a.startsWith("-"));
      const targetPath = targetArg ? resolveCdTarget(targetArg) : virtualPath;

      if (!targetPath) {
        appendEntry("error", `ls: cannot access '${targetArg}': No such directory`);
        return true;
      }

      const targetCtx = getPageShellContext(targetPath, locale);
      if (longMode) {
        appendEntry(
          "stdout",
          [
            `total ${targetCtx.entries.length}`,
            ...targetCtx.entries.map((entry) => {
              const isDir = entry.endsWith("/");
              const perms = isDir ? "drwxr-xr-x" : entry === "resume.pdf" ? "-rwxr-xr-x" : "-rw-r--r--";
              return `${perms}  1 amine  staff   4.0K  ${entry}`;
            }),
          ].join("\n")
        );
      } else {
        appendEntry("stdout", targetCtx.entries.join("   "));
      }
      return true;
    }

    if (cmd === "tree") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry(
        "stdout",
        [
          "/",
          "├── about.md",
          "├── resume.pdf",
          "├── projects/",
          ...PROJECT_SLUGS.map((slug, idx) =>
            `│   ${idx === PROJECT_SLUGS.length - 1 ? "└──" : "├──"} ${slug}`
          ),
          "├── journey/",
          "├── certifications/",
          "├── skills/",
          "└── contact/",
        ].join("\n")
      );
      return true;
    }

    if (cmd === "cat") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      if (!argStr) {
        appendEntry("error", `cat: missing operand (available: ${Object.keys(pageCtx.files).join(", ")})`);
        return true;
      }
      const key = argStr.replace(/^\.\//, "").toLowerCase();
      if (pageCtx.files[key]) {
        appendEntry("stdout", pageCtx.files[key]);
      } else if (key === "resume.pdf") {
        appendEntry("stdout", `Resume PDF: [Download Amine_Nahli_CV.pdf](/cv?locale=${locale})`);
      } else {
        appendEntry("error", `cat: ${argStr}: No such file in ${virtualPath}`);
      }
      return true;
    }

    if (cmd === "whoami") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", `visitor (${virtualPath})\nEngineer: Amine NAHLI · Cyber / AI / Full-Stack (UPF Fes)`);
      return true;
    }

    if (cmd === "id") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", "uid=1000(visitor) gid=1000(guest) groups=1000(guest),27(portfolio-ro)");
      return true;
    }

    if (cmd === "uname") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", "AmineOS 6.8.0-nahli #1 SMP PREEMPT_DYNAMIC x86_64 Cyber/AI GNU/Linux");
      return true;
    }

    if (cmd === "neofetch") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry(
        "stdout",
        [
          "   ▄▀█ █▄░█    visitor@nahli.dev",
          "  █▀█ █░▀█    -----------------",
          `  Path:       ${virtualPath}`,
          "  OS:         AmineOS 2.4 LTS (x86_64)",
          "  Role:       Computer Engineering Student (4th Year)",
          "  School:     Universite Privee de Fes (UPF)",
          "  Focus:      Cybersecurity · AI / Vision · Full-Stack",
          "  Honor:      1st Place Google Build with Gemma 2026",
          "  Shell:      nahli-sh 2.4 (route-synced)",
          "  Repo:       [github.com/nahliAmine](https://github.com/nahliAmine)",
        ].join("\n")
      );
      return true;
    }

    if (cmd === "projects" || cmd === "journey" || cmd === "skills" || cmd === "certifications" || cmd === "certs" || cmd === "contact") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      const resolved = resolveCdTarget(cmd);
      if (resolved) {
        const targetCtx = getPageShellContext(resolved, locale);
        const firstFile = Object.values(targetCtx.files)[0];
        appendEntry("stdout", firstFile || `${targetCtx.title}: ${targetCtx.summary}`);
      }
      return true;
    }

    if (cmd === "cv" || cmd === "resume") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", `Resume PDF: [Download Amine_Nahli_CV.pdf](/cv?locale=${locale})`);
      return true;
    }

    if (cmd === "open") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      const target = argStr.toLowerCase();
      if (!target) {
        appendEntry("error", "usage: open <github|linkedin|cv|projects|journey|certifications|contact>");
        return true;
      }
      if (target === "github") {
        window.open("https://github.com/nahliAmine", "_blank", "noopener,noreferrer");
        appendEntry("muted", "opened https://github.com/nahliAmine");
        return true;
      }
      if (target === "linkedin") {
        window.open("https://linkedin.com/in/amine-nahli", "_blank", "noopener,noreferrer");
        appendEntry("muted", "opened https://linkedin.com/in/amine-nahli");
        return true;
      }
      if (target === "cv" || target === "resume" || target === "resume.pdf") {
        window.location.href = `/cv?locale=${locale}`;
        appendEntry("muted", `downloading /cv?locale=${locale}`);
        return true;
      }
      const routeTarget = resolveCdTarget(target);
      if (routeTarget) {
        navigateVirtualPath(routeTarget);
        appendEntry("muted", `opened ${routeTarget}`);
      } else {
        appendEntry("error", `open: cannot resolve '${argStr}'`);
      }
      return true;
    }

    if (cmd === "echo") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", argStr);
      return true;
    }

    if (cmd === "date") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("stdout", new Date().toUTCString());
      return true;
    }

    if (cmd === "history") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      if (history.length === 0) {
        appendEntry("muted", "(history empty)");
      } else {
        const ordered = [...history].reverse();
        appendEntry(
          "stdout",
          ordered.map((item, i) => `${String(i + 1).padStart(4, " ")}  ${item}`).join("\n")
        );
      }
      return true;
    }

    if (cmd === "sudo") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("error", "visitor is not in the sudoers file. This incident will be reported.");
      return true;
    }

    if (cmd === "rm") {
      appendEntry("input", trimmed, virtualPath);
      setInputAndCursor("");
      appendEntry("error", "rm: cannot remove '/': Read-only portfolio filesystem");
      return true;
    }

    return false;
  };

  const executeInput = async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query || isLoading) return;

    setHistory((prev) => [query, ...prev.filter((h) => h !== query).slice(0, 39)]);
    setHistoryIndex(-1);

    if (runShellBuiltin(query)) return;

    const aiPrompt = query.toLowerCase().startsWith("ask ") ? query.slice(4).trim() : query;
    if (!aiPrompt) {
      appendEntry("input", query, virtualPath);
      appendEntry("error", "usage: ask <question>");
      setInputAndCursor("");
      return;
    }

    playBeep(820);

    const userCount = entries.filter((e) => e.role === "input").length + 1;
    const inputEntry: TerminalEntry = {
      id: `${Date.now()}-in`,
      role: "input",
      content: query,
      cwd: virtualPath,
    };

    if (userCount >= MAX_QUERIES) {
      setEntries((prev) => [
        ...prev,
        inputEntry,
        {
          id: `${Date.now()}-lim`,
          role: "error",
          content: `[E_LIMIT] Session command cap reached. Contact directly: [/${locale}/contact](/${locale}/contact)`,
        },
      ]);
      setInputAndCursor("");
      return;
    }

    const aiEntryId = `${Date.now()}-ai`;
    setEntries((prev) => [...prev, inputEntry, { id: aiEntryId, role: "ai", content: "" }]);
    setInputAndCursor("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const conversationHistory = [...entries, inputEntry]
        .filter((e) => e.role === "input" || e.role === "ai")
        .slice(-12)
        .map((e) => ({
          role: e.role === "ai" ? "assistant" : "user",
          content: e.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          locale,
          currentPath: pathname,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const payload = JSON.parse(line.slice(6)) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const delta = payload.choices?.[0]?.delta?.content;
                if (delta) {
                  accumulated += delta;
                  setEntries((prev) =>
                    prev.map((item) =>
                      item.id === aiEntryId ? { ...item, content: accumulated } : item
                    )
                  );
                }
              } catch {
                // Ignore partial SSE chunk parse
              }
            }
          }
        }
      }

      if (userCount === WARNING_QUERY_COUNT) {
        appendEntry("muted", "[warn] 3 queries remaining before tty session cap.");
      }
      playBeep(920);
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === "AbortError";
      setEntries((prev) =>
        prev.map((item) =>
          item.id === aiEntryId
            ? {
                ...item,
                role: isAbort ? "muted" : "error",
                content: isAbort
                  ? "^C"
                  : "[E_TIMEOUT] Upstream AI daemon did not respond. Try a built-in command ('help').",
              }
            : item
        )
      );
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
      setTimeout(() => focusTerminalInput(), 40);
    }
  };

  const handleTabComplete = () => {
    const val = inputValue;
    const trimmed = val.trimStart();
    if (!trimmed) return;

    const pageCtx = getPageShellContext(virtualPath, locale);
    const parts = trimmed.split(/\s+/);

    if (parts.length === 1 && !val.endsWith(" ")) {
      const prefix = parts[0].toLowerCase();
      const matches = AVAILABLE_COMMANDS.filter((c) => c.startsWith(prefix));
      if (matches.length === 1) {
        setInputAndCursor(`${matches[0]} `);
      } else if (matches.length > 1) {
        appendEntry("input", val, virtualPath);
        appendEntry("muted", matches.join("   "));
      }
      return;
    }

    const cmd = parts[0].toLowerCase();
    const argPrefix = val.endsWith(" ") ? "" : parts[parts.length - 1].toLowerCase();

    let candidates: string[] = [];
    if (cmd === "cat") {
      candidates = Object.keys(pageCtx.files);
    } else if (cmd === "cd") {
      candidates =
        virtualPath === "/projects"
          ? ["..", "/", ...PROJECT_SLUGS]
          : ["/", "..", "projects", "journey", "certifications", "skills", "contact", ...PROJECT_SLUGS];
    } else if (cmd === "open") {
      candidates = ["github", "linkedin", "cv", "projects", "journey", "certifications", "contact"];
    } else if (cmd === "ls" || cmd === "ll") {
      candidates = ["projects", "journey", "certifications", "skills", "contact"];
    }

    const matches = candidates.filter((c) => c.startsWith(argPrefix));
    if (matches.length === 1) {
      const head = parts.slice(0, val.endsWith(" ") ? parts.length : -1).join(" ");
      setInputAndCursor(`${head} ${matches[0]}`);
    } else if (matches.length > 1) {
      appendEntry("input", val, virtualPath);
      appendEntry("muted", matches.join("   "));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      clearTerminal();
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      } else {
        appendEntry("input", `${inputValue}^C`, virtualPath);
        setInputAndCursor("");
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIdx);
        setInputAndCursor(history[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInputAndCursor(history[prevIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputAndCursor("");
      }
    }
  };

  const renderTerminalLineContent = (content: string) => {
    const parts: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldSegments(content.slice(lastIndex, match.index), lastIndex));
      }
      const isExternal = match[2].startsWith("http");
      parts.push(
        <a
          key={`tty-link-${match.index}`}
          href={match[2]}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={(e) => e.stopPropagation()}
          className="text-[#b698ff] underline decoration-[#9A71FF]/60 underline-offset-2 hover:text-white hover:decoration-white transition-colors"
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(renderBoldSegments(content.slice(lastIndex), lastIndex));
    }
    return parts;
  };

  const renderBoldSegments = (text: string, baseKey: number) => {
    const chunks = text.split(/\*\*([^*]+)\*\*/g);
    return chunks.map((chunk, i) =>
      i % 2 === 1 ? (
        <strong key={`b-${baseKey}-${i}`} className="font-semibold text-white">
          {chunk}
        </strong>
      ) : (
        <React.Fragment key={`t-${baseKey}-${i}`}>{chunk}</React.Fragment>
      )
    );
  };

  const safeCursor = Math.max(0, Math.min(cursorPos, inputValue.length));

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96, transition: { duration: 0.16 } }}
            id="terminal-chat"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className={`absolute bottom-14 right-0 mb-2 flex flex-col overflow-hidden rounded-lg border border-white/20 bg-[#050507] shadow-[0_28px_80px_rgba(0,0,0,0.95)] font-mono text-[12px] transition-all duration-200 overscroll-contain ${
              isExpanded
                ? "w-[94vw] sm:w-[720px] lg:w-[820px] h-[82vh] max-h-[82vh]"
                : "w-[92vw] max-w-[440px] sm:w-[560px] sm:max-w-none h-[460px] max-h-[78vh]"
            }`}
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0C0B10] px-3.5 py-2 select-none">
              <div className="flex items-center gap-2 text-[11px] text-[#a29fb0]">
                <span className="inline-block size-2 rounded-sm bg-[#9A71FF]" />
                <span className="font-semibold text-[#e6e4ee]">
                  visitor@nahli.dev:{virtualPath}
                </span>
                <span className="hidden sm:inline text-white/25">—</span>
                <span className="hidden sm:inline text-[#797681]">zsh (tty1)</span>
              </div>

              <div className="flex items-center gap-1 text-[#797681]">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Mute bell" : "Enable bell"}
                  className="rounded p-1 hover:bg-white/10 hover:text-[#e6e4ee] transition-colors cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={clearTerminal}
                  title="Clear buffer (Ctrl+L)"
                  className="rounded p-1 hover:bg-white/10 hover:text-[#e6e4ee] transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Restore window" : "Maximize window"}
                  className="hidden sm:inline-flex rounded p-1 hover:bg-white/10 hover:text-[#e6e4ee] transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close terminal"
                  className="rounded p-1 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Pure TTY Output & Direct Block-Cursor Input Canvas (No Visible Input Field) */}
            <div
              onClick={focusTerminalInput}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="relative flex-1 overflow-y-auto px-4 py-3.5 space-y-1.5 leading-[1.55] cursor-text overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
            >
              {entries.map((entry) => {
                if (entry.role === "banner") {
                  return (
                    <pre
                      key={entry.id}
                      className="whitespace-pre-wrap font-mono text-[11px] text-[#9c99a8] pb-2 border-b border-white/[0.06] mb-2"
                    >
                      {entry.content}
                    </pre>
                  );
                }

                if (entry.role === "input") {
                  return (
                    <div key={entry.id} className="flex flex-wrap items-baseline gap-x-1.5 pt-1">
                      <span className="shrink-0 select-none">
                        <span className="text-emerald-400">visitor@nahli.dev</span>
                        <span className="text-[#797681]">:</span>
                        <span className="text-[#9A71FF]">{entry.cwd || "/"}</span>
                        <span className="text-[#797681]">$</span>
                      </span>
                      <span className="text-[#f3f1f7] break-all">{entry.content}</span>
                    </div>
                  );
                }

                if (entry.role === "error") {
                  return (
                    <pre
                      key={entry.id}
                      className="whitespace-pre-wrap font-mono text-[12px] text-rose-400/95"
                    >
                      {renderTerminalLineContent(entry.content)}
                    </pre>
                  );
                }

                if (entry.role === "muted") {
                  return (
                    <pre
                      key={entry.id}
                      className="whitespace-pre-wrap font-mono text-[11px] text-[#797681]"
                    >
                      {entry.content}
                    </pre>
                  );
                }

                return (
                  <pre
                    key={entry.id}
                    className="whitespace-pre-wrap font-mono text-[12px] text-[#d8d5e3] pb-1"
                  >
                    {entry.content ? (
                      <>
                        {renderTerminalLineContent(entry.content)}
                        {isLoading && entry.id === entries[entries.length - 1]?.id && (
                          <span className="inline-block w-2 h-3.5 bg-[#9A71FF] align-middle ml-0.5 animate-pulse" />
                        )}
                      </>
                    ) : (
                      <span className="inline-block w-2 h-3.5 bg-[#9A71FF] align-middle animate-pulse" />
                    )}
                  </pre>
                );
              })}

              {/* Authentic TTY Inline Prompt with Inverted Block Cursor & Hidden Native Input */}
              {!isLoading && (
                <div className="relative flex flex-wrap items-baseline gap-x-1.5 pt-1">
                  <span className="shrink-0 select-none">
                    <span className="text-emerald-400">visitor@nahli.dev</span>
                    <span className="text-[#797681]">:</span>
                    <span className="text-[#9A71FF]">{virtualPath}</span>
                    <span className="text-[#797681]">$</span>
                  </span>

                  <span className="text-[#f3f1f7] whitespace-pre-wrap break-all font-mono text-[12px]">
                    {inputValue.slice(0, safeCursor)}
                    <span
                      aria-hidden="true"
                      className={`inline-block min-w-[7px] px-[0.5px] leading-[1.3] align-baseline ${
                        isFocused
                          ? "bg-[#9A71FF] text-[#050507] animate-[pulse_1.1s_steps(2,start)_infinite]"
                          : "border border-[#9A71FF]/65 text-[#f3f1f7]"
                      }`}
                    >
                      {inputValue[safeCursor] ?? "\u00A0"}
                    </span>
                    {inputValue.slice(safeCursor + 1)}
                  </span>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      executeInput(inputValue);
                    }}
                    className="absolute left-0 top-0 opacity-0 pointer-events-none w-px h-px overflow-hidden"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setCursorPos(e.target.selectionStart ?? e.target.value.length);
                      }}
                      onSelect={(e) => {
                        const t = e.currentTarget;
                        setCursorPos(t.selectionStart ?? t.value.length);
                      }}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      aria-label="Terminal stdin"
                    />
                  </form>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Minimal tmux-style TTY Statusline */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#0A090E] px-3.5 py-1.5 text-[10px] text-[#797681] select-none">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#9A71FF] font-semibold">[tty1:{virtualPath}]</span>
                <span className="truncate">Tab: complete · ↑↓: history · Ctrl+L: clear · Ctrl+C: abort</span>
              </div>
              <span className={`shrink-0 font-semibold ${isLoading ? "text-amber-300" : "text-emerald-400/90"}`}>
                {isLoading ? "STREAMING" : "READY"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Floating CLI Launcher */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-11 w-11 hover:w-auto items-center justify-center rounded-full border border-white/15 bg-[#0B0510]/95 px-3 text-[#f3f1f7] shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#9A71FF]/60 hover:shadow-[0_0_30px_rgba(154,113,255,0.3)] cursor-pointer overflow-hidden"
        aria-label="Ouvrir le terminal CLI"
      >
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>

        <Terminal className="size-4 text-[#9A71FF] shrink-0 ml-1.5 transition-transform duration-300 group-hover:rotate-6" />

        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 font-mono text-xs font-semibold tracking-wider text-[#f3f1f7]">
          {isOpen ? "EXIT" : "tty1 · CLI"}
        </span>
      </motion.button>
    </div>
  );
}
