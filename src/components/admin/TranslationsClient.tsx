"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  Sparkles,
  Copy,
  Check,
  FolderKanban,
  Milestone,
  Award,
  FileText,
  Loader2,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface TranslationsClientProps {
  stats: {
    projectsCount: number;
    journeyCount: number;
    certificationsCount: number;
  };
}

const sampleSnippets = [
  {
    label: "Accroche Ingénieur",
    text: "Concevoir des architectures logicielles fiables, sécurisées et intelligentes.",
  },
  {
    label: "Bio Génie Informatique",
    text: "Élève ingénieur en 4e année en Génie Informatique à l'UPF University, je développe des solutions logicielles intégrant cybersécurité et intelligence artificielle.",
  },
  {
    label: "Défi Technique Projet",
    text: "Mise en place d'une architecture Zero-Trust et d'une détection d'anomalies en temps réel sur flux réseau chiffré.",
  },
];

const uiDictionaryOverview = [
  { fr: "Accueil", en: "Home", category: "Navigation" },
  { fr: "Projets", en: "Projects", category: "Navigation" },
  { fr: "Parcours", en: "Journey", category: "Navigation" },
  { fr: "Certifications", en: "Certifications", category: "Navigation" },
  { fr: "Contact", en: "Contact", category: "Navigation" },
  { fr: "Explorer les projets", en: "Explore Selected Work", category: "Bouton CTA" },
  { fr: "Consulter le CV", en: "View Official CV", category: "Bouton CTA" },
  { fr: "Tous les domaines", en: "All Categories", category: "Filtres" },
  { fr: "Étude de cas détaillée", en: "Detailed Case Study", category: "Lien Projet" },
  { fr: "Inspecter le document", en: "Inspect Document", category: "Lien Certification" },
];

export default function TranslationsClient({ stats }: TranslationsClientProps) {
  const [direction, setDirection] = useState<"fr-to-en" | "en-to-fr">("fr-to-en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          targetLang: direction === "fr-to-en" ? "en" : "fr",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de la traduction automatique.");
      }

      setOutputText(data.translation || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === "fr-to-en" ? "en-to-fr" : "fr-to-en"));
    setInputText(outputText);
    setOutputText("");
  };

  return (
    <div className="space-y-10">
      {/* Overview Stats & Bilingual Status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0B0510] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#797681]">
            <span className="font-mono uppercase tracking-wider">Projets Bilingues</span>
            <FolderKanban className="size-4 text-[#9A71FF]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-[#f3f1f7]">{stats.projectsCount}</span>
            <span className="text-xs text-emerald-400 font-mono">100% FR / EN</span>
          </div>
          <p className="mt-1 text-xs text-[#797681]">Titres, résumés et études de cas traduits</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0510] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#797681]">
            <span className="font-mono uppercase tracking-wider">Jalons du Parcours</span>
            <Milestone className="size-4 text-[#9A71FF]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-[#f3f1f7]">{stats.journeyCount}</span>
            <span className="text-xs text-emerald-400 font-mono">100% FR / EN</span>
          </div>
          <p className="mt-1 text-xs text-[#797681]">Formations, stages et distinctions</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0510] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#797681]">
            <span className="font-mono uppercase tracking-wider">Certifications</span>
            <Award className="size-4 text-[#9A71FF]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-[#f3f1f7]">{stats.certificationsCount}</span>
            <span className="text-xs text-emerald-400 font-mono">100% FR / EN</span>
          </div>
          <p className="mt-1 text-xs text-[#797681]">Accréditations et compétences associées</p>
        </div>
      </div>

      {/* AI Translation Workbench */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 bg-[#120A1C] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#9A71FF]/30 bg-[#9A71FF]/10 text-[#9A71FF]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#f3f1f7]">
                Assistant de Traduction Automatique (IA LLaMA 3.3 70B)
              </h2>
              <p className="text-xs text-[#797681]">
                Traduisez instantanément vos textes professionnels entre le Français et l&apos;Anglais avec un ton technique naturel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDirection}
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[#f3f1f7] hover:bg-white/[0.08] transition-colors"
          >
            <span>{direction === "fr-to-en" ? "Français ➔ Anglais" : "Anglais ➔ Français"}</span>
            <ArrowRightLeft className="size-3.5 text-[#9A71FF]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Snippets */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#797681] block mb-2">
              Exemples rapides à tester :
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleSnippets.map((snippet) => (
                <button
                  key={snippet.label}
                  type="button"
                  onClick={() => setInputText(snippet.text)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[#797681] hover:text-[#f3f1f7] hover:border-[#9A71FF]/40 transition-colors"
                >
                  {snippet.label}
                </button>
              ))}
            </div>
          </div>

          {/* Workbench Split View */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Column */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs text-[#797681]">
                <span className="font-semibold text-[#f3f1f7]">
                  {direction === "fr-to-en" ? "Texte source (Français)" : "Texte source (Anglais)"}
                </span>
                <span className="font-mono">{inputText.length} / 5000</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder={
                  direction === "fr-to-en"
                    ? "Collez ici un texte en français à traduire (titre de projet, description de stage, défi technique...)"
                    : "Paste English text here to translate into French..."
                }
                className="w-full rounded-2xl border border-white/10 bg-[#060605] p-4 text-sm text-[#f3f1f7] placeholder:text-[#797681]/60 focus:border-[#9A71FF] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleTranslate}
                disabled={loading || !inputText.trim()}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#9A71FF] px-6 py-3 text-xs font-bold text-[#000000] shadow-lg shadow-[#9A71FF]/20 transition-all hover:bg-[#b08dff] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Traduction en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Traduire avec l&apos;IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Output Column */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs text-[#797681]">
                <span className="font-semibold text-[#f3f1f7]">
                  {direction === "fr-to-en" ? "Résultat (Anglais)" : "Résultat (Français)"}
                </span>
                {outputText && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A71FF] hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                value={outputText}
                readOnly
                rows={7}
                placeholder="La traduction s'affichera ici..."
                className="w-full rounded-2xl border border-white/10 bg-[#060605] p-4 text-sm text-[#f3f1f7] placeholder:text-[#797681]/50 focus:outline-none transition-colors resize-none"
              />
              {error && (
                <p className="mt-1 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access to Bilingual Content Editors */}
      <div>
        <div className="mb-4">
          <h3 className="font-display text-xl font-bold text-[#f3f1f7]">Espaces d&apos;Édition Bilingue Directe</h3>
          <p className="text-xs text-[#797681]">
            Tous vos contenus sont modifiables en français et en anglais dans leurs formulaires respectifs.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/general"
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0510] p-5 transition-all hover:border-[#9A71FF]/40 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="size-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#9A71FF] mb-3 group-hover:bg-[#9A71FF]/10 group-hover:border-[#9A71FF]/30 transition-colors">
                <FileText className="size-5" />
              </div>
              <h4 className="font-semibold text-sm text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors">
                Infos Générales
              </h4>
              <p className="mt-1 text-xs text-[#797681]">
                Role badge, headline hero, biographie et chiffres clés en FR & EN.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#9A71FF]">
              <span>Éditer les textes</span>
              <ExternalLink className="size-3" />
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0510] p-5 transition-all hover:border-[#9A71FF]/40 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="size-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#9A71FF] mb-3 group-hover:bg-[#9A71FF]/10 group-hover:border-[#9A71FF]/30 transition-colors">
                <FolderKanban className="size-5" />
              </div>
              <h4 className="font-semibold text-sm text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors">
                Projets Techniques
              </h4>
              <p className="mt-1 text-xs text-[#797681]">
                Titres, résumés, études de cas complètes (Défis, Solutions, Résultats) en FR & EN.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#9A71FF]">
              <span>Gérer les projets</span>
              <ExternalLink className="size-3" />
            </div>
          </Link>

          <Link
            href="/admin/journey"
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0510] p-5 transition-all hover:border-[#9A71FF]/40 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="size-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#9A71FF] mb-3 group-hover:bg-[#9A71FF]/10 group-hover:border-[#9A71FF]/30 transition-colors">
                <Milestone className="size-5" />
              </div>
              <h4 className="font-semibold text-sm text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors">
                Parcours & Expériences
              </h4>
              <p className="mt-1 text-xs text-[#797681]">
                Titres de diplômes, postes de stages, distinctions et compétences associées en FR & EN.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#9A71FF]">
              <span>Gérer le parcours</span>
              <ExternalLink className="size-3" />
            </div>
          </Link>

          <Link
            href="/admin/certifications"
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0510] p-5 transition-all hover:border-[#9A71FF]/40 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="size-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#9A71FF] mb-3 group-hover:bg-[#9A71FF]/10 group-hover:border-[#9A71FF]/30 transition-colors">
                <Award className="size-5" />
              </div>
              <h4 className="font-semibold text-sm text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors">
                Certifications
              </h4>
              <p className="mt-1 text-xs text-[#797681]">
                Noms, organismes, descriptions d&apos;objectifs validés et documents officiels.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#9A71FF]">
              <span>Gérer les certifs</span>
              <ExternalLink className="size-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* Global UI Dictionary Reference Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] shadow-xl">
        <div className="border-b border-white/10 bg-[#120A1C] px-6 py-4 flex items-center gap-3">
          <BookOpen className="size-5 text-[#9A71FF]" />
          <div>
            <h3 className="font-display text-base font-bold text-[#f3f1f7]">
              Dictionnaire & Libellés Globaux de l&apos;Interface
            </h3>
            <p className="text-xs text-[#797681]">
              Aperçu des correspondances standardisées utilisées par le système de navigation et les boutons.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] font-mono uppercase tracking-wider text-[#9A71FF]">
              <tr>
                <th className="py-3 px-6">Élément d&apos;interface</th>
                <th className="py-3 px-6">Version Française (FR)</th>
                <th className="py-3 px-6">Version Anglaise (EN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#f3f1f7]">
              {uiDictionaryOverview.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-6 font-mono text-[11px] text-[#797681]">{item.category}</td>
                  <td className="py-3 px-6 font-medium">{item.fr}</td>
                  <td className="py-3 px-6 text-[#9A71FF] font-medium">{item.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
