"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content: "Bonjour ! Je suis l'assistant virtuel d'Amine. Posez-moi vos questions sur son parcours, ses projets ou ses compétences.",
    },
  ]);

  // Scroll to bottom when a new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageContent = inputValue.trim();
    setInputValue("");

    // Add user message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageContent,
    };
    
    // Create new array with all previous messages + the new user message
    const newMessagesList = [...messages, newUserMsg];
    setMessages(newMessagesList);
    setIsLoading(true);

    try {
      // Send the entire conversation history (excluding init message if we want to save tokens, but keeping it is fine)
      const apiMessages = newMessagesList
        .filter(m => m.id !== "init") // Optionally filter out init greeting
        .map(m => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content
        }));

      // Fallback for current locale (can be passed dynamically if needed)
      const locale = typeof window !== "undefined" && window.location.pathname.startsWith("/en") ? "en" : "fr";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.reply || "Une erreur est survenue.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Désolé, je rencontre des difficultés techniques.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render markdown links as buttons
  const renderMessageContent = (content: string) => {
    const parts = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        // Splitting by \n to preserve basic line breaks
        const textSegment = content.substring(lastIndex, match.index);
        const lines = textSegment.split('\n');
        lines.forEach((line, i) => {
          parts.push(<span key={`${lastIndex}-${i}`}>{line}</span>);
          if (i < lines.length - 1) parts.push(<br key={`br-${lastIndex}-${i}`} />);
        });
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          className="mt-3 flex w-fit items-center justify-center rounded-lg bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground border border-accent/20"
        >
          {match[1]}
        </a>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      const textSegment = content.substring(lastIndex);
      const lines = textSegment.split('\n');
      lines.forEach((line, i) => {
        parts.push(<span key={`end-${i}`}>{line}</span>);
        if (i < lines.length - 1) parts.push(<br key={`brend-${i}`} />);
      });
    }

    return parts;
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
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
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
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-accent text-accent-foreground"
                          : "rounded-bl-sm bg-surface-raised text-text-secondary border border-white/5"
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-end gap-2 flex-row">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex h-10 w-16 items-center justify-center rounded-2xl rounded-bl-sm bg-surface-raised border border-white/5">
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-white/5 bg-surface/50 p-4"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={isLoading}
                  className="w-full rounded-full border border-border/50 bg-bg-page/50 py-3 pl-5 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4 -ml-0.5" />
                </button>
              </div>
            </form>
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
