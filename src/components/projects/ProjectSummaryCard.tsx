import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { projectCategoryLabels, publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject, ProjectCategory } from "@/types/content";
import SkillIcon from "@/components/ui/SkillIcon";
import TiltCard from "@/components/ui/TiltCard";
import Magnetic from "@/components/ui/Magnetic";

type ProjectSummaryCardProps = {
  project: PortfolioProject;
  locale: Locale;
  cta: string;
};

export default function ProjectSummaryCard({ project, locale, cta }: ProjectSummaryCardProps) {
  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col bg-bg-page/60 backdrop-blur-xl border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/40 shadow-xl hover:shadow-[0_0_30px_-10px_rgba(var(--color-accent-rgb),0.2)]">
        
        {/* Cover Image Area */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-raised">
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={project.coverImage} 
              alt={project.title} 
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-surface-raised to-bg-page flex items-center justify-center text-text-secondary/50 font-mono text-xs">
              No Image
            </div>
          )}
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/40 to-transparent opacity-80" />
          
          {/* Categories over image */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
            {project.categories.slice(0, 3).map((category) => {
              const label = projectCategoryLabels[category as ProjectCategory]?.[locale] || category;
              return (
                <Badge key={category} className="bg-surface-raised/80 backdrop-blur-md border-border/50 text-text-primary text-[10px] px-2 py-0.5">
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="relative flex flex-col flex-1 p-5 z-10 -mt-2">
          {/* Glowing dot effect */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <h2 className="text-xl font-semibold text-text-primary tracking-tight transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h2>
          <p className="mt-1 text-xs font-medium text-accent/90">
            {project.subtitle[locale]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2">
            {project.summary[locale]}
          </p>
          
          <div className="mt-auto pt-6">
            <ul className="flex flex-wrap gap-2.5 mb-5" aria-label={publicCopy[locale].projects.technologies}>
              {project.technologies.slice(0, 4).map((technology) => (
                <li key={technology} className="flex items-center gap-1.5 font-mono text-xs font-semibold text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
                  <SkillIcon name={technology} className="text-[18px] grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <span>{technology}</span>
                </li>
              ))}
              {project.technologies.length > 4 && (
                <li className="flex items-center text-xs font-mono text-text-secondary/70">
                  +{project.technologies.length - 4}
                </li>
              )}
            </ul>
            
            <Magnetic intensity={0.1}>
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="group/btn relative flex w-full items-center justify-between rounded-full bg-surface-raised border border-border px-5 py-2.5 text-xs font-semibold text-text-primary transition-all duration-300 hover:bg-accent hover:border-accent hover:text-bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="tracking-wide uppercase">{cta}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-border transition-transform duration-300 group-hover/btn:bg-bg-page/20 group-hover/btn:translate-x-1">
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
