"use client";

import { useEffect, useId, useState } from "react";
import type { Locale } from "@/i18n/config";

const copy = {
  fr: {
    diagram: "Diagramme Mermaid",
    loading: "Chargement du diagramme…",
    source: "Afficher la source du diagramme",
    error: "Le diagramme ne peut pas être affiché. Sa source reste disponible ci-dessous.",
  },
  en: {
    diagram: "Mermaid diagram",
    loading: "Loading diagram…",
    source: "Show diagram source",
    error: "The diagram could not be rendered. Its source remains available below.",
  },
} as const;

export function MermaidDiagram({ source, locale }: { source: string; locale: Locale }) {
  const generatedId = useId();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          fontFamily: "var(--font-sans)",
          suppressErrorRendering: true,
        });
        const renderId = `mermaid-${generatedId.replaceAll(":", "")}`;
        const { svg } = await mermaid.render(renderId, source.slice(0, 10_000));
        if (!active) return;
        objectUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
        setDiagramUrl(objectUrl);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }

    void renderDiagram();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [generatedId, source]);

  const labels = copy[locale];
  return (
    <figure className="article-mermaid">
      <figcaption>{labels.diagram}</figcaption>
      <div className="article-mermaid-canvas" aria-busy={status === "loading"}>
        {diagramUrl ? (
          // A generated blob URL cannot use the Next.js image optimizer.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={diagramUrl} alt={labels.diagram} />
        ) : null}
      </div>
      {status === "loading" ? <p role="status">{labels.loading}</p> : null}
      {status === "error" ? <p role="alert">{labels.error}</p> : null}
      <details>
        <summary>{labels.source}</summary>
        <pre tabIndex={0}><code>{source}</code></pre>
      </details>
    </figure>
  );
}
