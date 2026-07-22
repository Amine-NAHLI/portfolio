"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { PublicSearchEntry } from "@/features/search/types";
import type { Locale } from "@/i18n/config";

const labels = {
  fr: { input: "Rechercher dans le portfolio", hint: "Projet, technologie, certification, article…", empty: "Aucun résultat.", prompt: "Saisissez au moins deux caractères.", types: { page: "Page", project: "Projet", skill: "Compétence", certification: "Certification", journey: "Parcours", article: "Article" } },
  en: { input: "Search the portfolio", hint: "Project, technology, certification, article…", empty: "No results.", prompt: "Enter at least two characters.", types: { page: "Page", project: "Project", skill: "Skill", certification: "Certification", journey: "Journey", article: "Article" } },
} as const;

export function GlobalSearch({ entries, locale }: { entries: PublicSearchEntry[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const normalized = normalize(query);
  const results = useMemo(() => {
    if (normalized.length < 2) return [];
    return entries.map((entry) => {
      const title = normalize(entry.title);
      const content = normalize([entry.description, ...entry.keywords].join(" "));
      const score = title === normalized ? 100 : title.startsWith(normalized) ? 50 : title.includes(normalized) ? 25 : content.includes(normalized) ? 10 : 0;
      return { entry, score };
    }).filter((result) => result.score > 0).sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title, locale)).slice(0, 30);
  }, [entries, locale, normalized]);
  const copy = labels[locale];

  return (
    <div>
      <label className="relative block"><span className="sr-only">{copy.input}</span><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-muted" /><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.hint} className="min-h-14 rounded-xl pl-12 pr-4 text-base" /></label>
      <p aria-live="polite" className="mt-4 min-h-6 text-sm text-text-muted">{normalized.length < 2 ? copy.prompt : `${results.length} résultat${locale === "fr" && results.length > 1 ? "s" : results.length === 1 ? "" : "s"}`}</p>
      {normalized.length >= 2 && results.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-border-strong p-10 text-center text-text-muted">{copy.empty}</div> : (
        <ul className="mt-4 grid gap-3">{results.map(({ entry }) => <li key={`${entry.type}:${entry.id}`}><Link href={entry.href} className="surface-card group flex min-h-28 items-start justify-between gap-5 p-5 hover:border-border-strong"><div><p className="font-mono text-xs uppercase tracking-wider text-accent">{copy.types[entry.type]}</p><h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{entry.title}</h2><p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">{entry.description}</p></div><ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-text-muted" /></Link></li>)}</ul>
      )}
    </div>
  );
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}
