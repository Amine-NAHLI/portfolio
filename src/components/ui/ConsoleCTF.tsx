"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, X, Sparkles, Volume2, VolumeX, PartyPopper } from "lucide-react";

declare global {
  interface Window {
    flag?: (answer: string) => string;
    override?: () => string;
    hack?: () => string;
    solve?: (answer: string) => string;
    resetCTF?: () => string;
  }
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const colors = ["#C8F122", "#FF007F", "#00F0FF", "#FFE600", "#A855F7", "#FFFFFF", "#38BDF8"];
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2.5,
      speedX: Math.random() * 3 - 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y / 25) * p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
    />
  );
}

export default function ConsoleCTF() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);
  const imageBase64Ref = useRef<string | null>(null);

  // Sound played when a question is solved (Level 1 & Level 2) - stops after exactly 8 seconds
  const playSuccessAudio = () => {
    try {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      if (!successAudioRef.current) {
        successAudioRef.current = new Audio("/m_fixed_9asHrPg.mp3");
        successAudioRef.current.volume = 0.8;
      }
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch(() => {});

      // Stop after exactly 8 seconds
      successTimeoutRef.current = setTimeout(() => {
        if (successAudioRef.current) {
          successAudioRef.current.pause();
          successAudioRef.current.currentTime = 0;
        }
      }, 8000);
    } catch {
      // Audio playback fallback
    }
  };

  // Sound played on final victory when the meme photo appears - loops in bg until modal is closed
  const playVictoryAudio = () => {
    try {
      // Stop question audio if still active
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      if (!victoryAudioRef.current) {
        victoryAudioRef.current = new Audio("/untitled_Bh5UcZG.mp3");
        victoryAudioRef.current.volume = 0.85;
        victoryAudioRef.current.loop = true; // Stays playing in background until modal is closed
      }
      victoryAudioRef.current.currentTime = 0;
      victoryAudioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          setIsPlayingAudio(false);
        });
    } catch {
      // Audio playback fallback
    }
  };

  const closeModal = () => {
    setIsVictoryModalOpen(false);
    if (victoryAudioRef.current) {
      victoryAudioRef.current.pause();
      victoryAudioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  // Pre-load and convert image to Base64 Data URL so Chrome DevTools console renders it inline
  useEffect(() => {
    if (typeof window === "undefined") return;

    fetch("/images/ctf-risitas.jpg")
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            imageBase64Ref.current = reader.result;
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detects whether the current execution is caused by a hard reload (F5 / browser refresh)
    const isPageReload = (): boolean => {
      try {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
        }
        return (performance as unknown as { navigation?: { type?: number } }).navigation?.type === 1;
      } catch {
        return false;
      }
    };

    // Retrieve saved progress or start at Level 1
    const getStoredLevel = (): number => {
      try {
        const val = sessionStorage.getItem("nahli_ctf_level");
        return val ? parseInt(val, 10) : 1;
      } catch {
        return 1;
      }
    };

    const saveLevel = (level: number) => {
      try {
        sessionStorage.setItem("nahli_ctf_level", level.toString());
      } catch {
        // storage disabled fallback
      }
    };

    const printHeader = () => {
      console.log(
        "%c" +
          "  █████╗ ███╗   ███╗██╗███╗   ██╗███████╗   ██████╗████████╗███████╗\n" +
          " ██╔══██╗████╗ ████║██║████╗  ██║██╔════╝  ██╔════╝╚══██╔══╝██╔════╝\n" +
          " ███████║██╔████╔██║██║██╔██╗ ██║█████╗    ██║        ██║   █████╗  \n" +
          " ██╔══██║██║╚██╔╝██║██║██║╚██╗██║██╔══╝    ██║        ██║   ██╔══╝  \n" +
          " ██║  ██║██║ ╚═╝ ██║██║██║ ╚████║███████╗  ╚██████╗   ██║   ██║     ",
        "color: #C8F122; font-weight: bold; font-family: monospace; font-size: 11px;"
      );

      if (isEn) {
        console.log(
          "%c[!] SECURITY ALERT : SOURCE CODE INSPECTION DETECTED.\n" +
            "You opened DevTools to audit Amine NAHLI's portfolio?\n" +
            "Before going any further, prove your engineering skills in this 3-level CTF challenge!\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 LEVEL 1 / 3 — OSINT RECONNAISSANCE\n" +
            "🎯 Question : What is the AI model Amine used to win 1st place in the Google Hackathon?\n" +
            "💡 Clue : Check the Hackathons or Projects section of this portfolio!\n" +
            "⌨️  To submit, run in this console:\n" +
            "    flag(\"your-answer\")\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #00d2ff; font-family: monospace; font-size: 12px; line-height: 1.5;"
        );
      } else {
        console.log(
          "%c[!] ALERTE SÉCURITÉ : TENTATIVE D'INSPECTION DÉTECTÉE.\n" +
            "Tu as ouvert la console pour inspecter le code source d'Amine NAHLI ?\n" +
            "Prouve d'abord ton niveau d'ingénieur en résolvant ce mini-CTF en 3 étapes !\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 NIVEAU 1 / 3 — RECONNAISSANCE OSINT\n" +
            "🎯 Énigme : Quel est le modèle d'IA avec lequel Amine a remporté la 1ère place du Hackathon Google ?\n" +
            "💡 Indice : Regarde dans la section Hackathons ou Projets du portfolio !\n" +
            "⌨️  Pour répondre, tape directement dans cette console :\n" +
            "    flag(\"ta-réponse\")\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #C8F122; font-family: monospace; font-size: 12px; line-height: 1.5;"
        );
      }
    };

    const printLevel2 = () => {
      if (isEn) {
        console.log(
          "%c✅ [LEVEL 1 SOLVED!] Google Gemma was the right answer.\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 LEVEL 2 / 3 — EASY CRYPTOGRAPHY\n" +
            "🎯 Challenge : Decode this secret Base64 cipher to find the key:\n" +
            "    \"TkFITElfQ1lCRVI=\"\n" +
            "💡 Pro tip : It's Base64! You can run this command right here in console:\n" +
            "    atob(\"TkFITElfQ1lCRVI=\")\n" +
            "⌨️  Then submit with:\n" +
            "    flag(\"the-result\")\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #38bdf8; font-family: monospace; font-size: 12px; line-height: 1.5;"
        );
      } else {
        console.log(
          "%c✅ [NIVEAU 1 RÉUSSI !] Google Gemma était bien la bonne réponse.\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 NIVEAU 2 / 3 — CRYPTOGRAPHIE FACILE\n" +
            "🎯 Énigme : Déchiffre ce secret encodé pour obtenir le 2ème flag :\n" +
            "    \"TkFITElfQ1lCRVI=\"\n" +
            "💡 Astuce de hacker : C'est du Base64 ! Tape directement dans cette console :\n" +
            "    atob(\"TkFITElfQ1lCRVI=\")\n" +
            "⌨️  Puis soumets le résultat avec :\n" +
            "    flag(\"le-résultat\")\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #38bdf8; font-family: monospace; font-size: 12px; line-height: 1.5;"
        );
      }
    };

    const printLevel3 = () => {
      if (isEn) {
        console.log(
          "%c✅ [LEVEL 2 SOLVED!] \"NAHLI_CYBER\" successfully decoded!\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 LEVEL 3 / 3 — FINAL OVERRIDE\n" +
            "🎯 Final Step : You have reached the core mainframe gate.\n" +
            "⌨️  Trigger the final override command:\n" +
            "    override()\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #f59e0b; font-family: monospace; font-size: 12px; line-height: 1.5;"
        );
      } else {
        console.log(
          "%c✅ [NIVEAU 2 RÉUSSI !] \"NAHLI_CYBER\" décodé avec succès !\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 NIVEAU 3 / 3 — L'OVERRIDE FINAL\n" +
            "🎯 Étape Finale : Tu es à la porte du système central.\n" +
            "⌨️  Exécute la commande d'autorisation ultime :\n" +
            "    override()\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #f59e0b; font-family: monospace; font-size: 12px; line-height: 1.5;"
        );
      }
    };

    const triggerVictory = () => {
      saveLevel(3);
      setIsVictoryModalOpen(true);
      playVictoryAudio();

      const victoryText = isEn
        ? "╔══════════════════════════════════════════════════════════════════════════════════╗\n" +
          "║   🎉 CONGRATULATIONS! YOU SOLVED THE CTF 100%!                                   ║\n" +
          "║                                                                                  ║\n" +
          "║   BUT... YOU WON'T INSPECT ANYTHING HERE! 😂                                     ║\n" +
          "║   Everything in Amine NAHLI's systems is locked down with Zero-Trust!            ║\n" +
          "╚══════════════════════════════════════════════════════════════════════════════════╝"
        : "╔══════════════════════════════════════════════════════════════════════════════════╗\n" +
          "║   🎉 FÉLICITATIONS ! TU AS RÉUSSI LE CTF À 100% !                                ║\n" +
          "║                                                                                  ║\n" +
          "║   MAIS... TU NE VAS RIEN INSPECTER DU TOUT ICI ! 😂                              ║\n" +
          "║   Ici tout est sécurisé en Zero-Trust, aucun bug à exploiter !                   ║\n" +
          "╚══════════════════════════════════════════════════════════════════════════════════╝";

      console.log(
        `%c${victoryText}`,
        "color: #C8F122; font-family: monospace; font-weight: bold; font-size: 13px; line-height: 1.4;"
      );

      // Render the funny El Risitas AMINE meme directly in console via Base64 Data URL!
      const logMeme = (dataUrl: string) => {
        console.log(
          "%c ",
          `font-size: 1px; line-height: 0; padding: 130px 240px; background-image: url('${dataUrl}'); background-size: contain; background-repeat: no-repeat; background-position: center; border-radius: 12px; margin: 12px 0; border: 2px solid #C8F122; display: inline-block;`
        );
      };

      if (imageBase64Ref.current) {
        logMeme(imageBase64Ref.current);
      } else {
        fetch("/images/ctf-risitas.jpg")
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === "string") {
                imageBase64Ref.current = reader.result;
                logMeme(reader.result);
              }
            };
            reader.readAsDataURL(blob);
          })
          .catch(() => {});
      }

      return isEn
        ? "Access granted! But nothing to inspect here. Check the pop-up on your screen!"
        : "Accès accordé ! Mais tu ne vas rien inspecter ici. Regarde la pop-up sur ton écran !";
    };

    // Flag validation function exposed in window
    const handleFlag = (rawAnswer: unknown): string => {
      if (typeof rawAnswer !== "string") {
        return isEn
          ? "❌ Please pass a string, e.g.: flag(\"answer\")"
          : "❌ Veuillez passer une chaîne de caractères, ex: flag(\"réponse\")";
      }

      const answer = rawAnswer.trim().toLowerCase().replace(/^flag\{?|\}$/gi, "");
      const currentLevel = getStoredLevel();

      if (currentLevel === 1) {
        if (
          answer.includes("gemma") ||
          answer.includes("google gemma") ||
          answer.includes("gemma 2") ||
          answer.includes("gemma2")
        ) {
          saveLevel(2);
          playSuccessAudio();
          printLevel2();
          return isEn
            ? "✨ Correct! Moving to Level 2."
            : "✨ Correct ! Passage au Niveau 2.";
        }
        return isEn
          ? "❌ Incorrect for Level 1. Hint: It's an open Google AI model mentioned in the Hackathons section."
          : "❌ Mauvaise réponse pour le Niveau 1. Indice : C'est un modèle d'IA ouvert de Google mentionné dans les Hackathons.";
      }

      if (currentLevel === 2) {
        if (
          answer.includes("nahli_cyber") ||
          answer.includes("nahli cyber") ||
          answer === "nahlicyber"
        ) {
          saveLevel(3);
          playSuccessAudio();
          printLevel3();
          return isEn
            ? "✨ Level 2 unlocked! Now run override() to finish!"
            : "✨ Niveau 2 validé ! Exécute maintenant override() pour finir !";
        }
        return isEn
          ? "❌ Incorrect. Try running atob(\"TkFITElfQ1lCRVI=\") in this console to decode the Base64!"
          : "❌ Incorrect. Essaie de taper atob(\"TkFITElfQ1lCRVI=\") dans cette console pour décoder le Base64 !";
      }

      if (currentLevel >= 3) {
        triggerVictory();
        return isEn
          ? "🏆 Already completed! Run resetCTF() to play again."
          : "🏆 Déjà complété ! Tape resetCTF() pour rejouer.";
      }

      return "";
    };

    const printFinalPayloadInstructions = () => {
      if (isEn) {
        console.log(
          "%c🔥 [ROOT AUTHORIZATION & SOURCE CODE REQUEST UNLOCKED!]\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 FINAL STEP — REQUEST FULL SOURCE CODE ACCESS\n" +
            "🎯 Want root credentials to inspect Amine NAHLI's complete source code?\n" +
            "    1. Scroll down to the Contact Form on this page (#contact)\n" +
            "    2. Fill in the fields with:\n" +
            "       • Subject : SOURCE_CODE_ACCESS\n" +
            "       • Message : I request full access to inspect Amine NAHLI's source code.\n" +
            "    3. Enter your email and click \"Send message\" to receive your credentials!\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #ff007f; font-family: monospace; font-weight: bold; font-size: 12px; line-height: 1.6;"
        );
      } else {
        console.log(
          "%c🔥 [CODE D'AUTORISATION & ACCÈS SOURCE DÉVERROUILLÉ !]\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚩 DERNIÈRE ÉTAPE — DEMANDE D'ACCÈS AU CODE SOURCE\n" +
            "🎯 Tu veux obtenir l'accès complet pour inspecter le code source d'Amine NAHLI ?\n" +
            "    1. Descends jusqu'au formulaire de Contact en bas de la page (#contact)\n" +
            "    2. Remplis les champs avec exactement :\n" +
            "       • Objet   : ACCES_CODE_SOURCE\n" +
            "       • Message : Je demande l'accès pour inspecter le code source d'Amine NAHLI.\n" +
            "    3. Saisis ton adresse e-mail et clique sur \"Envoyer le message\" pour recevoir tes accès !\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #ff007f; font-family: monospace; font-weight: bold; font-size: 12px; line-height: 1.6;"
        );
      }
    };

    const handleOverride = (param?: unknown) => {
      const currentLevel = getStoredLevel();
      if (currentLevel < 3 && param !== "force") {
        return isEn
          ? "🔒 Access denied! Solve Level 1 and Level 2 first!"
          : "🔒 Accès refusé ! Résous d'abord le Niveau 1 et le Niveau 2 !";
      }

      if (param === "force") {
        return triggerVictory();
      }

      saveLevel(4);
      playSuccessAudio();
      printFinalPayloadInstructions();

      // Auto glide down smoothly to the contact form!
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const el = document.getElementById("contact");
          if (el) {
            const lenis = window.__lenis;
            if (lenis) {
              lenis.scrollTo(el, { offset: -70, duration: 1.5 });
            } else {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 150);
      }

      return isEn
        ? "👉 Gliding down to Contact Form! Submit your source code access request to receive credentials!"
        : "👉 Défilement vers le formulaire de Contact ! Envoie ta demande d'accès au code source pour recevoir tes accès !";
    };

    const handleReset = () => {
      saveLevel(1);
      closeModal();
      console.clear();
      printHeader();
      return isEn ? "CTF reset to Level 1!" : "CTF réinitialisé au Niveau 1 !";
    };

    // Attach global functions to window
    window.flag = handleFlag;
    window.solve = handleFlag;
    window.override = handleOverride;
    window.hack = handleOverride;
    window.resetCTF = handleReset;

    // Print welcome on first mount
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      // If the user deliberately presses F5 to reload, reset CTF to Level 1
      if (isPageReload()) {
        try {
          sessionStorage.removeItem("nahli_ctf_level");
        } catch {
          // storage fallback
        }
      }

      const lvl = getStoredLevel();
      printHeader();
      if (lvl === 2) {
        printLevel2();
      } else if (lvl === 3) {
        printLevel3();
      } else if (lvl >= 4) {
        printFinalPayloadInstructions();
      }
    }

    const onVictoryTrigger = () => {
      triggerVictory();
    };
    window.addEventListener("ctf_victory_trigger", onVictoryTrigger);

    return () => {
      window.removeEventListener("ctf_victory_trigger", onVictoryTrigger);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      delete window.flag;
      delete window.solve;
      delete window.override;
      delete window.hack;
      delete window.resetCTF;
    };
  }, [isEn]);

  return (
    <>
      {/* Victory Easter Egg Modal displayed on screen when Level 3 is solved */}
      {isVictoryModalOpen && (
        <>
          <ConfettiCanvas />
          <div
            role="dialog"
            aria-modal="true"
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="cursor-default relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-accent bg-surface-deep text-text-primary p-6 sm:p-7 shadow-[0_0_60px_rgba(200,241,34,0.45)]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fermer la modal"
                className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-full border border-border-strong bg-text-primary/[0.08] text-text-secondary hover:text-text-primary hover:bg-text-primary/[0.15] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>

              {/* Header Badge */}
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-accent uppercase tracking-wider mb-2">
                <PartyPopper className="size-4 text-accent animate-bounce" />
                <span>{isEn ? "🎉 GG SUNDAY HACKER // 100% TROLLED 🎉" : "🎉 GG HACKER DU DIMANCHE // 100% TROLLÉ 🎉"}</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {isEn
                  ? "DID YOU REALLY THINK AMINE WAS GOING TO SEND YOU HIS SOURCE CODE BY EMAIL?! 😂"
                  : "TU CROYAIS VRAIMENT QU'AMINE ALLAIT T'ENVOYER SON CODE SOURCE PAR E-MAIL ?! 😂"}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {isEn
                  ? "Access report: 0 lines of source code leaked, 0 vulnerabilities found, 100% trolled! Even the mail server is dead laughing! Everything in Amine NAHLI's architecture is bunkerized with Zero-Trust."
                  : "Rapport d'accès : 0 ligne de code source divulguée, 0 faille trouvée, 100% de troll réussi ! Même le serveur de messagerie est mort de rire ! Ici toute l'infrastructure d'Amine NAHLI est bunkerisée en Zero-Trust."}
              </p>

              {/* Funny Telemetry Cards */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <div className="text-[10px] text-text-secondary uppercase">{isEn ? "Source Code Leaked" : "Code Source Donné"}</div>
                  <div className="mt-0.5 text-sm font-bold text-accent">{isEn ? "0 lines" : "0 ligne"}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <div className="text-[10px] text-text-secondary uppercase">{isEn ? "Vulnerabilities" : "Failles"}</div>
                  <div className="mt-0.5 text-sm font-bold text-sky-400">0.00%</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <div className="text-[10px] text-text-secondary uppercase">{isEn ? "Troll Score" : "Score Troll"}</div>
                  <div className="mt-0.5 text-sm font-bold text-pink-400">100% MAX</div>
                </div>
              </div>

              {/* The Famous El Risitas AMINE Meme */}
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-accent/40 shadow-xl">
                <Image
                  src="/images/ctf-risitas.jpg"
                  alt="Amine Risitas Meme"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent">
                    <ShieldCheck className="size-3.5" />
                    <span>Zero-Trust Verified</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingAudio) {
                        victoryAudioRef.current?.pause();
                        setIsPlayingAudio(false);
                      } else {
                        playVictoryAudio();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors cursor-pointer"
                    title={isEn ? "Play/Pause Laugh" : "Jouer/Mettre en pause le son"}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="size-3.5 animate-pulse text-accent" />
                        <span>{isEn ? "Stop Sound" : "Couper"}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="size-3.5" />
                        <span>{isEn ? "Replay Sound" : "Rejouer le son"}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-border-strong bg-text-primary/[0.06] px-4 py-2 text-xs font-semibold text-text-primary hover:bg-text-primary/[0.12] transition-colors cursor-pointer"
                  >
                    {isEn ? "Close" : "Fermer"}
                  </button>
                  <a
                    href={`/${isEn ? "en" : "fr"}#contact`}
                    onClick={closeModal}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-text-on-accent hover:bg-accent-hover transition-colors shadow-sm"
                  >
                    <Sparkles className="size-3" />
                    <span>{isEn ? "Contact Amine" : "Contacter Amine"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
