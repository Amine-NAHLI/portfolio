import type { Metadata } from "next";
import { Compass, FlaskConical, Target } from "lucide-react";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { currentFocus } from "@/content/portfolio";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type NowPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: NowPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].now;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/now" });
}

export default async function NowPage({ params }: NowPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].now;
  const items = [
    { title: copy.currentProject, text: currentFocus.project[locale], icon: Compass },
    { title: copy.currentWork, text: currentFocus.work[locale], icon: FlaskConical },
    { title: copy.objective, text: currentFocus.objective[locale], icon: Target },
  ];

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map(({ title, text, icon: Icon }) => (
            <article key={title} className="surface-card p-6 sm:p-7">
              <Icon aria-hidden="true" className="size-6 text-accent" />
              <h2 className="mt-6 text-xl font-semibold text-text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 border-l-2 border-accent pl-5 text-sm leading-6 text-text-muted">
          <p>{copy.updated}</p>
          <p>{copy.source}</p>
        </div>
      </Container>
    </>
  );
}

