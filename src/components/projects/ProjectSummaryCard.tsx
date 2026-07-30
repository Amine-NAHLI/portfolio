import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { projectCategoryLabels, publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";
import SkillIcon from "@/components/ui/SkillIcon";

type ProjectSummaryCardProps = {
  project: PortfolioProject;
  locale: Locale;
  cta: string;
  index?: string;
};

export default function ProjectSummaryCard({ project, locale, cta, index }: ProjectSummaryCardProps) {
  return (
    <TechnicalFrame as="article" index={index} label="Project record" className="group flex h-full flex-col p-6 sm:p-7 hover:-translate-y-0.5 transition-transform">
      {project.coverImage ? (
        <div className="relative mb-6 -mx-2 -mt-2 aspect-video overflow-hidden rounded-sm border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.coverImage} alt={project.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      ) : null}
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
      <ul className="mt-6 flex flex-wrap gap-3" aria-label={publicCopy[locale].projects.technologies}>
        {project.technologies.slice(0, 4).map((technology) => (
          <li key={technology} className="flex items-center gap-2 font-mono text-sm font-semibold text-text-secondary">
            <SkillIcon name={technology} className="text-[24px]" />
            <span>{technology}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-sm font-mono text-xs font-semibold uppercase tracking-[.07em] text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {cta}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </TechnicalFrame>
  );
}
