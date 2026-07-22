import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { projectCategoryLabels, publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";

type ProjectSummaryCardProps = {
  project: PortfolioProject;
  locale: Locale;
  cta: string;
};

export default function ProjectSummaryCard({ project, locale, cta }: ProjectSummaryCardProps) {
  return (
    <article className="surface-card group flex h-full flex-col p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong sm:p-7">
      <div className="flex flex-wrap gap-2">
        {project.categories.map((category) => (
          <Badge key={category}>{projectCategoryLabels[category][locale]}</Badge>
        ))}
      </div>
      <div className="mt-6 flex-1">
        <h2 className="text-2xl font-semibold text-text-primary">{project.title}</h2>
        <p className="mt-2 text-sm font-medium text-accent">{project.subtitle[locale]}</p>
        <p className="mt-4 text-sm leading-6 text-text-secondary">{project.summary[locale]}</p>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label={publicCopy[locale].projects.technologies}>
        {project.technologies.slice(0, 4).map((technology) => (
          <li key={technology} className="font-mono text-xs text-text-muted">{technology}</li>
        ))}
      </ul>
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-lg font-semibold text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {cta}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
