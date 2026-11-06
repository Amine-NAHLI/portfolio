/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  X,
  CornerDownLeft,
  RefreshCw,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Code2,
  Cpu,
  Sparkles,
} from "lucide-react";
import React from "react";

type Message = {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  isHelp?: boolean;
};

const SUGGESTED_COMMANDS = [
  "help",
  "projects",
  "journey",
  "certifications",
  "contact",
  "whoami",
  "clear",
];

const SESSION_EXPIRY_MS = 10 * 60 * 1000;
const MAX_MESSAGES = 25;
const WARNING_MESSAGE_COUNT = 22;

const INITIAL_SYSTEM_BANNER = `===================================================================
* AMINE NAHLI // INTELLIGENT SYSTEM TERMINAL (AmineOS v2.4-x86_64)
* Architecture Logicielle · Cybersécurité Défensive · IA & Vision
* Tapez 'help' pour la documentation ou posez une question libre.
===================================================================`;

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "system",
  content: INITIAL_SYSTEM_BANNER,
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // Command History Navigation (ArrowUp / ArrowDown)
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Storage keys
  const storageKey = "portfolio_terminal_messages_v3";
  const activityKey = "portfolio_terminal_activity_v3";

  // Initialize from LocalStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [INITIAL_MESSAGE];

    const lastActivity = localStorage.getItem(activityKey);
    const savedMessages = localStorage.getItem(storageKey);

    if (lastActivity && savedMessages) {
      const isExpired = Date.now() - parseInt(lastActivity, 10) > SESSION_EXPIRY_MS;
      if (!isExpired) {
        try {
          return JSON.parse(savedMessages);
        } catch {
          return [INITIAL_MESSAGE];
        }
      }
    }
    return [INITIAL_MESSAGE];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(messages));
      localStorage.setItem(activityKey, Date.now().toString());
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      playBeep();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const resetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "system",
        content: `[SYS_CLEARED] Buffer réinitialisé.\nSession ID: amine-sh-${Math.floor(Math.random() * 9000 + 1000)}\nTapez 'help' pour les commandes disponibles.`,
      },
    ]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(activityKey);
    }
    setInputValue("");
    setHistoryIndex(-1);
    setIsLoading(false);
    setIsOnCooldown(false);
    playBeep();
  };

  const userMessageCount = messages.filter((m) => m.role === "user").length;

  const handleBuiltinCommand = (cmd: string): boolean => {
    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === "clear" || cleanCmd === "cls") {
      resetChat();
      return true;
    }

    if (cleanCmd === "help") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: cmd },
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: `AMINE-OS CLI COMMANDS:
  help            - Affiche ce manuel des commandes
  projects        - Liste des réalisations phares avec études détaillées
  journey         - Progression académique (UPF) et concours
  certifications  - Diplômes officiels & accréditations vérifiables
  contact         - Coordonnées directes (E-mail, LinkedIn, GitHub)
  whoami          - Fiche d'identité technique d'Amine Nahli
  clear           - Effacer l'écran de la console
  
* Vous pouvez également poser n'importe quelle question technique en langage naturel.`,
        },
      ]);
      setInputValue("");
      playBeep();
      return true;
    }

    if (cleanCmd === "whoami") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: cmd },
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: `NAME: Amine NAHLI
ROLE: Élève Ingénieur en Génie Informatique (4e année, Master's Cycle)
ACADEMY: Université Privée de Fès (UPF)
DOMAINES: Systèmes Distribués · Cybersécurité Défensive (IAM, Zero-Trust) · IA & Vision
DISTINCTION: 1ère place Google Build with Gemma 2026 (Afrique du Nord)
LOCALISATION: Fès, Maroc`,
        },
      ]);
      setInputValue("");
      playBeep();
      return true;
    }

    if (cleanCmd === "projects") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: cmd },
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `PROJETS PHARES SÉLECTIONNÉS :
1. [7YATK](/fr/projects/7yatk) - Ange gardien connecté, capteurs télémétriques & réseau Mesh
2. [Smart Network Mapper](/fr/projects/smart-network-mapper) - Audit, cartographie réseau et détection d'anomalies
3. [Transport YOLO Robot](/fr/projects/transport-yolo-robot) - Pipeline de vision par ordinateur & inférence temps réel
4. [E-UPF Portal](/fr/projects/e-upf-portail-gestion) - Plateforme universitaire avec contrôle d'accès RBAC chiffré

Consultez tous les projets : [Ouvrir l'explorateur de projets](/fr/projects)`,
        },
      ]);
      setInputValue("");
      playBeep();
      return true;
    }

    if (cleanCmd === "journey") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: cmd },
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `TRAJECTOIRE D'INGÉNIERIE :
• 2022 - 2023 : Baccalauréat Sciences Mathématiques (Fès City School)
• 2023 - En cours : Cycle d'Ingénieur d'État en Génie Informatique (UPF)
• Avril 2026 : 3ème Prix National - Concours Robotique UPF
• Juil. - Août 2026 : Stagiaire Développeur Cybersécurité & IA (IntelTrust)
• Juillet 2026 : 1ère Place - Google Build with Gemma Hackathon (Afrique du Nord)

Explorer la frise interactive : [Voir tout le parcours](/fr#journey)`,
        },
      ]);
      setInputValue("");
      playBeep();
      return true;
    }

    if (cleanCmd === "certifications") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: cmd },
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `DIPLÔMES & CRÉDENTIELS OFFICIELS :
• Pre-Security & Cyber Fundamentals (TryHackMe)
• Deep Learning & Neural Networks (DeepLearning.AI / Coursera)
• CCNA: Introduction to Networks (Cisco Networking Academy)

Inspecter les justificatifs vérifiables : [Voir les certifications](/fr#certifications)`,
        },
      ]);
      setInputValue("");
      playBeep();
      return true;
    }

    if (cleanCmd === "contact") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: cmd },
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `CANAUX DE CONTACT DIRECT :
• E-mail : nahli-ami@upf.ac.ma
• LinkedIn : [linkedin.com/in/amine-nahli](https://linkedin.com/in/amine-nahli)
• GitHub : [github.com/nahliAmine](https://github.com/nahliAmine)

Envoyer un message chiffré : [Formulaire de Contact](/fr/contact)`,
        },
      ]);
      setInputValue("");
      playBeep();
      return true;
    }

    return false;
  };

  const sendQuery = async (query: string) => {
    if (!query.trim() || isLoading || isOnCooldown) return;

    // Record command into history
    setHistory((prev) => [query.trim(), ...prev.slice(0, 30)]);
    setHistoryIndex(-1);

    if (handleBuiltinCommand(query)) return;

    playBeep();

    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), 1200);

    const currentUserMessageCount = userMessageCount + 1;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };

    const newMessagesList = [...messages, newUserMsg];
    setMessages(newMessagesList);
    setInputValue("");

    if (currentUserMessageCount >= MAX_MESSAGES) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "system",
            content:
              "[SYS_BUFFER_LIMIT] Limite de commandes atteinte pour cette session. Pour échanger plus longuement, contactez directement Amine : [Page Contact](/fr/contact)",
          },
        ]);
        setIsLoading(false);
        playBeep();
      }, 500);
      return;
    }

    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, role: "ai", content: "" }]);

    try {
      const apiMessages = newMessagesList
        .filter((m) => m.id !== "init" && m.role !== "system")
        .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));

      const locale =
        typeof window !== "undefined" && window.location.pathname.startsWith("/en") ? "en" : "fr";
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale, currentPath }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                const delta = data.choices[0]?.delta?.content || "";
                accumulatedContent += delta;

                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.id === aiMessageId) {
                    last.content = accumulatedContent;
                  }
                  return updated;
                });
              } catch (e) {}
            }
          }
        }
      }
      playBeep();

      if (currentUserMessageCount === WARNING_MESSAGE_COUNT) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "system",
              content:
                "[SYS_WARN] Attention : Il vous reste 3 commandes avant expiration du buffer mémoire.",
            },
          ]);
          playBeep();
        }, 800);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.id === aiMessageId) {
          last.content = "[SYS_TIMEOUT] Le serveur n'a pas répondu à temps. Vérifiez votre connexion.";
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIdx);
        setInputValue(history[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInputValue(history[prevIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  const renderMessageContent = (content: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textSegment = content.substring(lastIndex, match.index);
        parts.push(renderTextWithFormatting(textSegment, lastIndex));
      }

      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          className="my-1.5 inline-flex items-center gap-1.5 rounded-lg border border-[#9A71FF]/30 bg-[#9A71FF]/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#9A71FF] transition-all hover:bg-[#9A71FF] hover:text-[#000000]"
        >
          <span>{match[1]}</span>
          <ArrowUpRight className="size-3" />
        </a>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(renderTextWithFormatting(content.substring(lastIndex), lastIndex));
    }
    return parts;
  };

  const renderTextWithFormatting = (text: string, baseKey: number) => {
    return text.split("\n").map((line, lineIndex) => {
      if (!line.trim()) return <br key={`br-${baseKey}-${lineIndex}`} />;
      const boldParts = line.split(/\*\*([^*]+)\*\*/g);
      return (
        <span
          key={`line-${baseKey}-${lineIndex}`}
          className={
            line.trim().startsWith("-") || line.trim().startsWith("•")
              ? "block ml-3 pl-1 text-[#f3f1f7]/90 before:content-['›'] before:mr-1.5 before:text-[#9A71FF]"
              : "block"
          }
        >
          {boldParts.map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="font-bold text-[#f3f1f7]">
                {part}
              </strong>
            ) : (
              <React.Fragment key={i}>{part.replace(/^[-•]\s*/, "")}</React.Fragment>
            )
          )}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94, transition: { duration: 0.2 } }}
            className={`absolute bottom-16 right-0 mb-3 flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#060605] shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl font-mono text-xs transition-all duration-300 ${
              isExpanded
                ? "w-[92vw] sm:w-[680px] lg:w-[740px] h-[82vh] max-h-[82vh]"
                : "w-[360px] sm:w-[480px] lg:w-[520px] h-[560px] max-h-[80vh]"
            }`}
          >
            {/* Top Terminal Bar (Traffic Lights + Metadata + Controls) */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0B0510] px-4 py-3 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="size-3 rounded-full bg-[#ff5f56] hover:opacity-85 transition-opacity cursor-pointer"
                  title="Fermer (Exit)"
                />
                <button
                  type="button"
                  onClick={resetChat}
                  className="size-3 rounded-full bg-[#ffbd2e] hover:opacity-85 transition-opacity cursor-pointer"
                  title="Réinitialiser le terminal (Clear)"
                />
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="size-3 rounded-full bg-[#27c93f] hover:opacity-85 transition-opacity cursor-pointer"
                  title={isExpanded ? "Réduire" : "Agrandir (Fullscreen)"}
                />
              </div>

              {/* Terminal Title */}
              <div className="flex items-center gap-2 text-[11px] text-[#797681]">
                <Terminal className="size-3.5 text-[#9A71FF]" />
                <span className="font-bold text-[#f3f1f7]">guest@nahli-sys:~</span>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="hidden sm:inline text-emerald-400 text-[10px]">● ONLINE</span>
              </div>

              {/* Top Action Icons */}
              <div className="flex items-center gap-1.5 text-[#797681]">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Couper le son" : "Activer le son"}
                  className="rounded p-1 hover:bg-white/10 hover:text-[#f3f1f7] transition-colors cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Réduire la console" : "Agrandir la console"}
                  className="rounded p-1 hover:bg-white/10 hover:text-[#f3f1f7] transition-colors cursor-pointer hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={resetChat}
                  title="Effacer (Clear)"
                  className="rounded p-1 hover:bg-white/10 hover:text-[#f3f1f7] transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Fermer"
                  className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Output Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 text-[12px] leading-relaxed">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  {msg.role === "user" ? (
                    <div className="text-[#38bdf8]">
                      <span className="text-[#9A71FF] font-bold">guest@nahli-sys:~$ </span>
                      <span className="text-[#f3f1f7] font-semibold">{msg.content}</span>
                    </div>
                  ) : msg.role === "system" ? (
                    <div className="text-[#797681] whitespace-pre-line border-l-2 border-[#9A71FF]/40 pl-3 py-1 font-mono text-[11px] leading-relaxed">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="text-[#f3f1f7] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#9A71FF] text-[10px] uppercase font-bold tracking-wider">
                        <Cpu className="size-3" />
                        <span>AMINE_NEURAL_ENGINE</span>
                      </div>
                      <div className="text-[#e2e0ea] pl-3 border-l border-white/10 whitespace-pre-line leading-relaxed">
                        {msg.content ? (
                          renderMessageContent(msg.content)
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#9A71FF] animate-pulse">
                            <span className="size-1.5 rounded-full bg-[#9A71FF]" />
                            <span className="size-1.5 rounded-full bg-[#9A71FF]" />
                            <span className="size-1.5 rounded-full bg-[#9A71FF]" />
                            <span className="text-[11px] font-mono ml-1 text-[#797681]">traitement en cours...</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Command Suggestions Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/[0.08] bg-[#0B0510]/90 px-3.5 py-2 text-[10px]">
              <span className="text-[#797681] uppercase tracking-wider shrink-0 mr-1 font-bold">CLI RUN:</span>
              {SUGGESTED_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => sendQuery(cmd)}
                  disabled={isLoading}
                  className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[#9A71FF] hover:border-[#9A71FF] hover:bg-[#9A71FF]/15 transition-all cursor-pointer font-medium"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuery(inputValue);
              }}
              className="flex items-center gap-2 border-t border-white/15 bg-[#060605] px-4 py-3"
            >
              <span className="shrink-0 text-[#9A71FF] font-bold text-xs select-none">
                guest@nahli-sys:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  userMessageCount >= MAX_MESSAGES
                    ? "Session pleine..."
                    : "commande ou question... (↑/↓ pour l'historique)"
                }
                disabled={isLoading || isOnCooldown || userMessageCount >= MAX_MESSAGES}
                className="flex-1 bg-transparent text-[#f3f1f7] text-xs placeholder:text-[#797681]/60 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={
                  !inputValue.trim() ||
                  isLoading ||
                  isOnCooldown ||
                  userMessageCount >= MAX_MESSAGES
                }
                aria-label="Exécuter"
                className="inline-flex items-center gap-1 rounded-lg bg-[#9A71FF] px-3 py-1.5 text-[11px] font-bold text-[#000000] hover:bg-[#b08dff] transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-[#9A71FF]/20"
              >
                <span>RUN</span>
                <CornerDownLeft className="size-3" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Launcher Pill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-13 items-center gap-2.5 rounded-full border border-white/15 bg-[#0B0510]/95 px-4 text-[#f3f1f7] shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all hover:border-[#9A71FF]/60 hover:shadow-[0_0_30px_rgba(154,113,255,0.3)] cursor-pointer"
        aria-label="Ouvrir le terminal interactif"
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>

        <Terminal className="size-4 text-[#9A71FF] transition-transform group-hover:rotate-6" />

        <span className="font-mono text-xs font-semibold tracking-wider text-[#f3f1f7] hidden sm:inline">
          {isOpen ? "TERMINAL" : "CLI · AMINE"}
        </span>
      </motion.button>
    </div>
  );
}
