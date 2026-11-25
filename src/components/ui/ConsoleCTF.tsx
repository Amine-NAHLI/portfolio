"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, X, Trophy, Sparkles } from "lucide-react";

declare global {
  interface Window {
    flag?: (answer: string) => string;
    override?: () => string;
    hack?: () => string;
    solve?: (answer: string) => string;
    resetCTF?: () => string;
  }
}

export default function ConsoleCTF() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const hasInitialized = useRef(false);
  const imageBase64Ref = useRef<string | null>(null);

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

    const handleOverride = () => {
      const currentLevel = getStoredLevel();
      if (currentLevel < 2) {
        return isEn
          ? "🔒 Access denied! Complete Level 1 first by finding the flag."
          : "🔒 Accès refusé ! Complète d'abord le Niveau 1 en trouvant le flag.";
      }
      return triggerVictory();
    };

    const handleReset = () => {
      saveLevel(1);
      setIsVictoryModalOpen(false);
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
      const lvl = getStoredLevel();
      printHeader();
      if (lvl === 2) {
        printLevel2();
      } else if (lvl === 3) {
        printLevel3();
      }
    }

    return () => {
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
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-accent bg-surface-deep text-text-primary p-6 sm:p-7 shadow-[0_0_50px_rgba(200,241,34,0.35)]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsVictoryModalOpen(false)}
              aria-label="Fermer la modal"
              className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-full border border-border-strong bg-text-primary/[0.08] text-text-secondary hover:text-text-primary hover:bg-text-primary/[0.15] transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-accent uppercase tracking-wider mb-3">
              <Trophy className="size-4 text-accent" />
              <span>{isEn ? "CTF COMPLETED // 100% SOLVED" : "CTF TERMINÉ // 100% RÉUSSI"}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {isEn ? "You won... but you won't inspect anything!" : "Tu as réussi... mais tu ne vas rien inspecter !"}
            </h3>

            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {isEn
                ? "Nice job clearing all 3 levels of the challenge! But everything on Amine NAHLI's portfolio is secured with zero-trust architecture. No vulnerabilities here!"
                : "Bien joué d'avoir passé les 3 niveaux du challenge ! Mais ici, toute l'architecture d'Amine NAHLI est sécurisée en Zero-Trust. Aucun bug ni faille à exploiter !"}
            </p>

            {/* The Famous El Risitas AMINE Meme */}
            <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-2xl border border-accent/40 shadow-xl">
              <Image
                src="/images/ctf-risitas.jpg"
                alt="Amine Risitas Meme"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent">
                <ShieldCheck className="size-3.5" />
                <span>Zero-Trust Verified</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVictoryModalOpen(false)}
                  className="rounded-full border border-border-strong bg-text-primary/[0.06] px-4 py-2 text-xs font-semibold text-text-primary hover:bg-text-primary/[0.12] transition-colors cursor-pointer"
                >
                  {isEn ? "Close" : "Fermer"}
                </button>
                <a
                  href={`/${isEn ? "en" : "fr"}#contact`}
                  onClick={() => setIsVictoryModalOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-text-on-accent hover:bg-accent-hover transition-colors shadow-sm"
                >
                  <Sparkles className="size-3" />
                  <span>{isEn ? "Contact Amine" : "Contacter Amine"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
