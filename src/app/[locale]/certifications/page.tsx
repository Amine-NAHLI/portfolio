import type { Metadata } from "next";
import { ArrowUpRight, Award } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import PageIntro from "@/components/ui/PageIntro";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { getPublicCertifications } from "@/features/portfolio/data";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type CertificationsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CertificationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].certifications;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/certifications" });
}

export default async function CertificationsPage({ params }: CertificationsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].certifications;
  const certifications = await getPublicCertifications(locale);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": certifications.map((certification) => ({
          "@type": "EducationalOccupationalCredential",
          name: certification.name,
          credentialCategory: "certificate",
          recognizedBy: certification.issuer ? { "@type": "Organization", name: certification.issuer } : undefined,
        })),
      }} />
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        {certifications.length === 0 ? <PortfolioEmptyState collection="certifications" locale={locale} className="mx-auto max-w-3xl" /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((certification) => (
            <TechnicalFrame key={certification.id} index={String(certifications.indexOf(certification) + 1).padStart(2, "0")} label="Credential" className="flex flex-col p-6 sm:p-7">
              <div className="grid size-11 place-items-center border border-border bg-surface-raised text-accent">
                <Award aria-hidden="true" className="size-5" />
              </div>
              <div className="mt-6 flex-1">
                <Badge className="border-success/30 bg-success/10 text-success">{copy.completed}</Badge>
                <h2 className="mt-4 text-xl font-semibold text-text-primary">{certification.name}</h2>
                {certification.issuer ? <p className="mt-2 text-sm text-text-muted">{certification.issuer}</p> : null}
                {certification.description ? <p className="mt-4 text-sm leading-6 text-text-secondary">{certification.description}</p> : null}
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{copy.relatedSkills}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {certification.skills.map((skill) => <li key={skill}><Badge>{skill}</Badge></li>)}
                </ul>
              </div>
              {certification.verificationUrl ? (
                <a href={certification.verificationUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {copy.verify}<ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              ) : null}
              {certification.hasDocument ? <a href={`/api/certifications/${certification.id}/document`} className="mt-4 inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">PDF<ArrowUpRight aria-hidden="true" className="size-4" /></a> : null}
            </TechnicalFrame>
          ))}
        </div>}
      </Container>
    </>
  );
}
