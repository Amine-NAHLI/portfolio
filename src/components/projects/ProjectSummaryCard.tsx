import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { projectCategoryLabels, publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject, ProjectCategory } from "@/types/content";
import SkillIcon from "@/components/ui/SkillIcon";
import TiltCard from "@/components/ui/TiltCard";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Magnetic from "@/components/ui/Magnetic";

type ProjectSummaryCardProps = {
  project: PortfolioProject;
  locale: Locale;
  cta: string;
  index?: string;
};

export default function ProjectSummaryCard({ project, locale, cta, index }: ProjectSummaryCardProps) {
  return (
    <TiltCard className="h-full">
      <TechnicalFrame as="article" index={index} label="Project record" className="group relative flex h-full flex-col p-6 sm:p-7 transition-all duration-500 hover:border-accent/80 bg-bg-page/50 backdrop-blur-xl overflow-hidden">
        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute -inset-x-20 -top-20 h-40 bg-accent/20 blur-[100px] rounded-full" />
        </div>
        <NoiseOverlay opacity={0.03} />
        
        {project.coverImage ? (
          <div className="relative z-10 mb-6 -mx-2 -mt-2 aspect-video overflow-hidden rounded-sm border border-border shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverImage} alt={project.title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-page/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ) : null}
        
        <div className="relative z-10 flex flex-wrap gap-2">
          {project.categories.map((category) => {
            const label = projectCategoryLabels[category as ProjectCategory]?.[locale] || category;
            return (
              <Badge key={category} className="bg-surface-raised/80 backdrop-blur-md border-accent/20">
                {label}
              </Badge>
            );
          })}
        </div>
        
        <div className="relative z-10 mt-6 flex-1">
          <h2 className="text-2xl font-semibold text-text-primary transition-colors duration-300 group-hover:text-accent">{project.title}</h2>
          <p className="mt-2 text-sm font-medium text-accent/80">{project.subtitle[locale]}</p>
          <p className="mt-4 text-sm leading-6 text-text-secondary">{project.summary[locale]}</p>
        </div>
        
        <ul className="relative z-10 mt-6 flex flex-wrap gap-3" aria-label={publicCopy[locale].projects.technologies}>
          {project.technologies.slice(0, 4).map((technology) => (
            <li key={technology} className="flex items-center gap-2 font-mono text-sm font-semibold text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
              <SkillIcon name={technology} className="text-[24px]" />
              <span>{technology}</span>
            </li>
          ))}
        </ul>
        
        <div className="relative z-10 mt-7 self-start">
          <Magnetic intensity={0.2}>
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm font-mono text-xs font-semibold uppercase tracking-[.07em] text-text-primary transition-all duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group/btn"
            >
              {cta}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 group-hover/btn:text-accent" />
            </Link>
          </Magnetic>
        </div>
      </TechnicalFrame>
    </TiltCard>
  );
}
