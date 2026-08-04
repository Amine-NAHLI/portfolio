/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Trash2 } from "lucide-react";
import React from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "Parle-moi de tes projets",
  "Quelles sont tes compétences ?",
  "Comment te contacter ?"
];

const SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_MESSAGES = 15;
const WARNING_MESSAGE_COUNT = 13;

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "ai",
  content: "Bonjour ! Je suis l'assistant virtuel d'Amine. Posez-moi vos questions sur son parcours, ses projets ou ses compétences.",
};

const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  
  // Storage keys
  const storageKey = "portfolio_chat_messages";
  const activityKey = "portfolio_chat_last_activity";

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

  // Sync to local storage
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
    if (isOpen) playPopSound();
  }, [isOpen]);

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(activityKey);
    }
    setInputValue("");
    setIsLoading(false);
    setIsOnCooldown(false);
    playPopSound();
  };

  const userMessageCount = messages.filter(m => m.role === "user").length;

  const sendQuery = async (query: string) => {
    if (!query.trim() || isLoading || isOnCooldown) return;

    playPopSound();
    
    // Cooldown logic (2 seconds)
    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), 2000);

    const currentUserMessageCount = userMessageCount + 1;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };
    
    const newMessagesList = [...messages, newUserMsg];
    setMessages(newMessagesList);
    setInputValue("");

    // --- Hard Limit Check ---
    if (currentUserMessageCount >= MAX_MESSAGES) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "Vous avez posé beaucoup de questions, c'est super ! Cependant, pour des questions aussi approfondies, le mieux est de discuter directement avec Amine. [Aller à la page Contact](/fr/contact)"
          }
        ]);
        setIsLoading(false);
        playPopSound();
      }, 800); // Small fake delay
      return;
    }

    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: "ai", content: "" }
    ]);

    try {
      const apiMessages = newMessagesList
        .filter(m => m.id !== "init") 
        .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));

      const locale = typeof window !== "undefined" && window.location.pathname.startsWith("/en") ? "en" : "fr";
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
              } catch(e) {}
            }
          }
        }
      }
      playPopSound();

      // --- Progressive Warning Check ---
      if (currentUserMessageCount === WARNING_MESSAGE_COUNT) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "ai",
              content: "Nous avons déjà beaucoup échangé ! Il me reste de l'énergie pour 2 questions maximum, que voulez-vous savoir d'autre ?"
            }
          ]);
          playPopSound();
        }, 1000);
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.id === aiMessageId) {
          last.content = "Désolé, je rencontre des difficultés techniques.";
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputValue);
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
          className="mt-3 flex w-fit items-center justify-center rounded-lg bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground border border-accent/20"
        >
          {match[1]}
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
    return text.split('\n').map((line, lineIndex) => {
      if (!line.trim()) return <br key={`br-${baseKey}-${lineIndex}`} />;
      const boldParts = line.split(/\*\*([^*]+)\*\*/g);
      return (
        <span key={`line-${baseKey}-${lineIndex}`} className={line.trim().startsWith('-') ? "block ml-4 relative before:content-['•'] before:absolute before:-left-4 before:text-accent" : "block"}>
          {boldParts.map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="font-bold text-text-primary">{part}</strong> : <React.Fragment key={i}>{part.replace(/^- /g, '')}</React.Fragment>
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
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className="absolute bottom-16 right-0 mb-4 flex h-[500px] max-h-[70vh] w-[350px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-subtle/70 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-surface/50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 border border-accent/30 text-accent">
                  <Bot className="h-5 w-5" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-surface shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Amine AI</h3>
                  <p className="text-xs text-text-muted">Assistant Virtuel</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Effacer la conversation"
                  className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        msg.role === "user"
                          ? "bg-surface-raised text-text-secondary"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-accent text-accent-foreground"
                          : "rounded-bl-sm bg-surface-raised text-text-secondary border border-white/5"
                      }`}
                    >
                      {msg.content ? renderMessageContent(msg.content) : (
                        <div className="flex gap-1 h-2 items-center px-1">
                          <span className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1 h-1 bg-text-muted rounded-full animate-bounce"></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="flex flex-col border-t border-white/5 bg-surface/50 p-4 pt-3">
              {messages.length === 1 && !isLoading && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendQuery(q)}
                      className="whitespace-nowrap rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={userMessageCount >= MAX_MESSAGES ? "Limite atteinte..." : "Posez votre question..."}
                  disabled={isLoading || isOnCooldown || userMessageCount >= MAX_MESSAGES}
                  className="w-full rounded-full border border-border/50 bg-bg-page/50 py-3 pl-5 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || isOnCooldown || userMessageCount >= MAX_MESSAGES}
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--color-accent),0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(var(--color-accent),0.6)]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
