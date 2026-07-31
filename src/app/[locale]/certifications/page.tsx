import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import PageIntro from "@/components/ui/PageIntro";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import CertificationCard from "@/components/ui/CertificationCard";
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
              <CertificationCard 
                key={certification.id} 
                certification={{
                  id: certification.id,
                  name: certification.name,
                  issuer: certification.issuer,
                  issuedOn: certification.issuedOn,
                  verificationUrl: certification.verificationUrl,
                  hasDocument: certification.hasDocument,
                  documentMimeType: certification.documentMimeType,
                  description: certification.description
                }} 
                locale={locale} 
                copy={copy} 
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
