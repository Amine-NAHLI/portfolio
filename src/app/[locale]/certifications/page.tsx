import type { Metadata } from "next";
import { ArrowUpRight, Award, Calendar, Download } from "lucide-react";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import PageIntro from "@/components/ui/PageIntro";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
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
        {certifications.length === 0 ? (
          <PortfolioEmptyState collection="certifications" locale={locale} className="mx-auto max-w-3xl" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {certifications.map((certification) => (
              <div key={certification.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-surface-subtle">
                  {certification.hasDocument ? (
                    certification.documentMimeType?.startsWith("image/") ? (
                      <img
                        src={`/api/certifications/${certification.id}/document`}
                        alt={`Preview of ${certification.name}`}
                        className="pointer-events-none h-full w-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={`/api/certifications/${certification.id}/document#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={`Preview of ${certification.name}`}
                        className="pointer-events-none h-full w-full border-none"
                        tabIndex={-1}
                      />
                    )
                  ) : (
                    <div className="grid h-full place-items-center text-text-muted">
                      <Award className="size-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-raised/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold leading-snug text-text-primary line-clamp-2" title={certification.name}>
                    {certification.name}
                  </h2>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                    <Calendar aria-hidden="true" className="size-4 opacity-70" />
                    <span>
                      {certification.issuedOn 
                        ? new Date(certification.issuedOn).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" }) 
                        : "—"}
                    </span>
                  </div>

                  <div className="mt-auto pt-6 flex items-center gap-3">
                    {certification.verificationUrl ? (
                      <a href={certification.verificationUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                        {copy.verify} <ArrowUpRight aria-hidden="true" className="size-4" />
                      </a>
                    ) : (
                      <div className="flex-1" />
                    )}
                    
                    {certification.hasDocument ? (
                      <a href={`/api/certifications/${certification.id}/document`} target="_blank" rel="noreferrer" className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" title="Télécharger">
                        <Download aria-hidden="true" className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
