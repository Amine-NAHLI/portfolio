import type { Metadata } from "next";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { timelineEntries } from "@/content/portfolio";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type JourneyPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: JourneyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].journey;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/journey" });
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].journey;

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        <ol className="relative mx-auto max-w-4xl before:absolute before:bottom-4 before:left-[1.35rem] before:top-4 before:w-px before:bg-border sm:before:left-[1.6rem]">
          {timelineEntries.map((entry) => {
            const Icon = entry.type === "experience" ? BriefcaseBusiness : GraduationCap;
            return (
              <li key={entry.id} className="relative grid grid-cols-[2.75rem_1fr] gap-5 pb-10 last:pb-0 sm:grid-cols-[3.25rem_1fr] sm:gap-7">
                <span className="relative z-10 grid size-11 place-items-center rounded-full border border-border-strong bg-bg-page text-accent sm:size-13">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <article className="surface-card p-6 sm:p-7">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{entry.type === "experience" ? copy.experience : copy.education}</p>
                      <h2 className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl">{entry.title[locale]}</h2>
                      <p className="mt-1 text-sm text-text-secondary">{entry.organization}{entry.location ? ` · ${entry.location[locale]}` : ""}</p>
                    </div>
                    <p className="shrink-0 font-mono text-xs text-text-muted">{entry.period[locale]}</p>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-text-secondary">{entry.description[locale]}</p>
                  {entry.details.length > 0 ? (
                    <ul className="mt-5 grid gap-2">
                      {entry.details.map((detail) => <li key={detail[locale]} className="flex gap-3 text-sm leading-6 text-text-secondary"><span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />{detail[locale]}</li>)}
                    </ul>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}

