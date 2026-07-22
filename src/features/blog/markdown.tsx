import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { MermaidDiagram } from "@/components/blog/MermaidDiagram";
import type { Locale } from "@/i18n/config";

type MarkdownBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; lines: string[]; alert: string | null }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; alt: string; src: string; caption: string | null }
  | { type: "rule" };

export type TableOfContentsItem = { id: string; text: string; level: 2 | 3 | 4 };

export function getTableOfContents(markdown: string): TableOfContentsItem[] {
  return parseMarkdown(markdown).flatMap((block) => block.type === "heading" ? [{ id: block.id, text: block.text, level: block.level }] : []);
}

const labels = {
  fr: { table: "Tableau défilable", externalImage: "Image externe non affichée", code: "Code" },
  en: { table: "Scrollable table", externalImage: "External image not displayed", code: "Code" },
} as const;

export function MarkdownContent({ markdown, locale = "fr" }: { markdown: string; locale?: Locale }) {
  const blocks = parseMarkdown(markdown);
  return (
    <div className="article-content">
      {blocks.map((block, index) => <MarkdownBlockView key={`${block.type}-${index}`} block={block} locale={locale} />)}
    </div>
  );
}

function MarkdownBlockView({ block, locale }: { block: MarkdownBlock; locale: Locale }) {
  if (block.type === "heading") {
    const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";
    return <Tag id={block.id} className="scroll-mt-24"><a href={`#${block.id}`}>{renderInline(block.text)}</a></Tag>;
  }
  if (block.type === "paragraph") return <p>{renderInline(block.text)}</p>;
  if (block.type === "rule") return <hr />;
  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return <Tag>{block.items.map((item, index) => <li key={`${item}-${index}`}>{renderInline(item)}</li>)}</Tag>;
  }
  if (block.type === "quote") {
    return (
      <blockquote className={block.alert ? "article-alert" : undefined}>
        {block.alert ? <strong>{block.alert}</strong> : null}
        {block.lines.map((line, index) => <p key={`${line}-${index}`}>{renderInline(line)}</p>)}
      </blockquote>
    );
  }
  if (block.type === "code") {
    if (block.language === "mermaid") return <MermaidDiagram source={block.code} locale={locale} />;
    return (
      <figure className="article-code">
        <figcaption>{block.language || labels[locale].code}</figcaption>
        <pre tabIndex={0}><code className={block.language ? `language-${block.language}` : undefined}>{highlightCode(block.code, block.language)}</code></pre>
      </figure>
    );
  }
  if (block.type === "table") {
    return (
      <div className="article-table" tabIndex={0} role="region" aria-label={labels[locale].table}>
        <table>
          <thead><tr>{block.headers.map((cell, index) => <th key={`${cell}-${index}`} scope="col">{renderInline(cell)}</th>)}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  if (block.type === "image") {
    if (!isSafeLocalImage(block.src)) return <p>[{labels[locale].externalImage}: {block.alt}]</p>;
    return (
      <figure>
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
          <Image src={block.src} alt={block.alt} fill sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        </div>
        {block.caption ? <figcaption>{renderInline(block.caption)}</figcaption> : null}
      </figure>
    );
  }
  return null;
}

const codeKeywords = /\b(?:async|await|break|case|catch|class|const|continue|def|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|interface|let|new|null|of|return|select|then|throw|true|try|type|undefined|update|where|while|with|yield)\b/g;
const codeTokens = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\*[\s\S]*?\*\/|\/\/[^\n]*|--[^\n]*|#[^\n]*)|(\b\d+(?:\.\d+)?\b)/g;

function highlightCode(code: string, language: string): ReactNode[] | string {
  if (!language || language === "mermaid") return code;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of code.matchAll(codeTokens)) {
    const offset = match.index ?? 0;
    if (offset > cursor) nodes.push(...highlightKeywords(code.slice(cursor, offset), cursor));
    const className = match[1] ? "syntax-string" : match[2] ? "syntax-comment" : "syntax-number";
    nodes.push(<span className={className} key={`token-${offset}`}>{match[0]}</span>);
    cursor = offset + match[0].length;
  }
  if (cursor < code.length) nodes.push(...highlightKeywords(code.slice(cursor), cursor));
  return nodes;
}

function highlightKeywords(text: string, baseOffset: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(codeKeywords)) {
    const offset = match.index ?? 0;
    if (offset > cursor) nodes.push(text.slice(cursor, offset));
    nodes.push(<span className="syntax-keyword" key={`keyword-${baseOffset + offset}`}>{match[0]}</span>);
    cursor = offset + match[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replaceAll("\r\n", "\n").slice(0, 100_000).split("\n");
  const blocks: MarkdownBlock[] = [];
  const slugCounts = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    const fence = line.match(/^```([a-zA-Z0-9_-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) { code.push(lines[index]); index += 1; }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code", language: (fence[1] ?? "").toLowerCase(), code: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(4, Math.max(2, heading[1].length)) as 2 | 3 | 4;
      const text = heading[2].trim();
      const base = createSlug(text) || "section";
      const count = slugCounts.get(base) ?? 0;
      slugCounts.set(base, count + 1);
      blocks.push({ type: "heading", level, text, id: count ? `${base}-${count + 1}` : base });
      index += 1;
      continue;
    }

    if (/^([-*_])(?:\s*\1){2,}\s*$/.test(line)) { blocks.push({ type: "rule" }); index += 1; continue; }

    const image = line.match(/^!\[([^\]]+)]\(([^\s)]+)(?:\s+"([^"]*)")?\)\s*$/);
    if (image) { blocks.push({ type: "image", alt: image[1], src: image[2], caption: image[3] ?? null }); index += 1; continue; }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].startsWith(">")) { quoteLines.push(lines[index].replace(/^>\s?/, "")); index += 1; }
      const alertMatch = quoteLines[0]?.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)]$/i);
      if (alertMatch) quoteLines.shift();
      blocks.push({ type: "quote", lines: quoteLines.filter(Boolean), alert: alertMatch?.[1].toUpperCase() ?? null });
      continue;
    }

    const listMatch = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = Boolean(listMatch[2]);
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
        if (!match || Boolean(match[2]) !== ordered) break;
        items.push(match[3]); index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) { rows.push(splitTableRow(lines[index])); index += 1; }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !startsBlock(lines, index)) { paragraph.push(lines[index].trim()); index += 1; }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function startsBlock(lines: string[], index: number): boolean {
  const line = lines[index];
  return /^```|^#{1,6}\s|^>|^\s*(?:[-+*]|\d+\.)\s+|^!\[/.test(line)
    || /^([-*_])(?:\s*\1){2,}\s*$/.test(line)
    || (line.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1]));
}

function isTableDivider(line: string): boolean {
  return splitTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function splitTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function createSlug(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function isSafeLocalImage(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+]\([^)]+\))/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const offset = match.index ?? 0;
    if (offset > cursor) nodes.push(text.slice(cursor, offset));
    const token = match[0];
    if (token.startsWith("**")) nodes.push(<strong key={offset}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`")) nodes.push(<code key={offset}>{token.slice(1, -1)}</code>);
    else {
      const link = token.match(/^\[([^\]]+)]\(([^)]+)\)$/);
      if (link && isSafeLink(link[2])) {
        const external = /^https?:\/\//i.test(link[2]);
        nodes.push(external
          ? <a key={offset} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>
          : <Link key={offset} href={link[2]}>{link[1]}</Link>);
      } else nodes.push(link?.[1] ?? token);
    }
    cursor = offset + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function isSafeLink(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; }
  catch { return false; }
}
