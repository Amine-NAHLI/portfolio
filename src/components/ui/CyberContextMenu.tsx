"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ShieldAlert, Briefcase, Pizza, X, Siren } from "lucide-react";

type MenuPosition = {
  x: number;
  y: number;
};

export default function CyberContextMenu() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [fbiAlertActive, setFbiAlertActive] = useState(false);
  const [pizzaToast, setPizzaToast] = useState(false);

  const fbiAudioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Don't intercept if user is right-clicking inside an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();

      // Clamp position within window bounds
      const menuWidth = 260;
      const menuHeight = 230;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

      setPosition({ x, y });
      setIsOpen(true);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScrollOrKey = () => {
      setIsOpen(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrKey, { passive: true });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setIsOpen(false);
    });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrKey);
    };
  }, []);

  // Action 1: FBI Open Up / SQL Injection
  const handleSqlInjection = () => {
    setIsOpen(false);
    setFbiAlertActive(true);

    try {
      if (!fbiAudioRef.current) {
        fbiAudioRef.current = new Audio("/fbi-open-up-sfx.mp3");
        fbiAudioRef.current.volume = 0.9;
      }
      fbiAudioRef.current.currentTime = 0;
      fbiAudioRef.current.play().catch(() => {});
    } catch {
      // audio fallback
    }

    // Auto dismiss FBI alert after 4 seconds
    setTimeout(() => {
      setFbiAlertActive(false);
    }, 4000);
  };

  // Action 2: Hire Amine Immediately
  const handleHireAmine = () => {
    setIsOpen(false);

    const contactEl = document.getElementById("contact");
    if (contactEl) {
      if (window.__lenis) {
        window.__lenis.scrollTo(contactEl, { offset: -70, duration: 1.5 });
      } else {
        contactEl.scrollIntoView({ behavior: "smooth" });
      }
    }

    setTimeout(() => {
      const subjectInput = document.querySelector<HTMLInputElement>(
        'input[name="subject"]'
      );
      const messageInput = document.querySelector<HTMLTextAreaElement>(
        'textarea[name="message"]'
      );

      if (subjectInput) {
        subjectInput.value = isEn
          ? "IMMEDIATE JOB OFFER // AMINE NAHLI"
          : "OFFRE D'EMBAUCHE IMMÉDIATE // AMINE NAHLI";
        subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (messageInput) {
        messageInput.value = isEn
          ? "Hello Amine, we just explored your portfolio and we are blown away! When do you start with a high salary?"
          : "Bonjour Amine, nous venons d'explorer votre portfolio et nous sommes bluffés ! Quand commencez-vous avec un gros salaire ?";
        messageInput.dispatchEvent(new Event("input", { bubbles: true }));
        messageInput.focus();
      }
    }, 600);
  };

  // Action 3: Pizza order
  const handlePizza = () => {
    setIsOpen(false);
    setPizzaToast(true);
    setTimeout(() => setPizzaToast(false), 3800);
  };

  return (
    <>
      {/* FBI Open Up Flash Screen Alert */}
      {fbiAlertActive && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in pointer-events-none"
        >
          <div className="flex flex-col items-center text-center max-w-lg p-6 sm:p-7 rounded-3xl bg-neutral-950 border-2 border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.7)] text-white">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/50 mb-3 animate-ping">
              <Siren className="size-8 text-red-500" />
            </div>

            <div className="font-mono text-xs font-bold text-red-400 tracking-widest uppercase mb-1">
              🚨 ZERO-TRUST INTRUSION DEFENSE // FBI INTERCEPT 🚨
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              FBI OPEN UP ! 🚪💥
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
              {isEn
                ? "[ALERT] SQL Injection attempt detected and repelled in 0.02ms. Architecture Zero-Trust intact!"
                : "[ALERTE] Tentative d'injection SQL détectée et repoussée en 0.02ms. L'architecture Zero-Trust d'Amine est impénétrable !"}
            </p>
          </div>
        </div>
      )}

      {/* Pizza Order Toast */}
      {pizzaToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[95] flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-neutral-950/90 px-4 py-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-xl text-white animate-fade-in"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-lg">
            🍕
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isEn ? "Pizza Order Validated!" : "Pizza Validée !"}
            </div>
            <div className="text-xs text-neutral-300">
              {isEn
                ? "1 Pepperoni Pizza is en route to Amine's desk!"
                : "1 Pizza Pepperoni en route pour le bureau d'Amine !"}
            </div>
          </div>
        </div>
      )}

      {/* Floating Custom Cyber Context Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
          className="fixed z-[90] w-64 overflow-hidden rounded-2xl border border-accent/40 bg-surface-deep/95 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-fade-in text-text-primary"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60 text-[10px] font-mono text-accent uppercase tracking-wider">
            <span>NAHLI.DEV // CTF_MENU</span>
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          </div>

          <div className="py-1">
            {/* Option 1: SQL Injection (FBI Open Up) */}
            <button
              type="button"
              onClick={handleSqlInjection}
              className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer text-left"
            >
              <ShieldAlert className="size-4 shrink-0 text-red-400 group-hover:scale-110 transition-transform" />
              <span>{isEn ? "Try SQL Injection 🚨" : "Tenter une injection SQL 🚨"}</span>
            </button>

            {/* Option 2: Hire Amine */}
            <button
              type="button"
              onClick={handleHireAmine}
              className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-accent/15 hover:text-accent transition-colors cursor-pointer text-left"
            >
              <Briefcase className="size-4 shrink-0 text-accent group-hover:scale-110 transition-transform" />
              <span>{isEn ? "Hire Amine now 💼" : "Embaucher Amine direct 💼"}</span>
            </button>

            {/* Option 3: Order Pizza */}
            <button
              type="button"
              onClick={handlePizza}
              className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-amber-500/15 hover:text-amber-400 transition-colors cursor-pointer text-left"
            >
              <Pizza className="size-4 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{isEn ? "Order a pizza for Amine 🍕" : "Offrir une pizza à Amine 🍕"}</span>
            </button>
          </div>

          {/* Footer close */}
          <div className="border-t border-border/60 pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-[11px] text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-colors cursor-pointer"
            >
              <span>{isEn ? "Close menu" : "Fermer le menu"}</span>
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
