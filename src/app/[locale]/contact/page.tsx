import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { siteConfig } from "@/config/site";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";

type ContactPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].contact;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/contact" });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].contact;
  const links = [
    { label: copy.email, value: "nahli-ami@upf.ac.ma", href: siteConfig.links.email, icon: Mail, external: false },
    { label: copy.linkedin, value: "in/AmineNAHLI", href: siteConfig.links.linkedin, icon: LinkedinIcon, external: true },
    { label: copy.github, value: "github.com/Amine-NAHLI", href: siteConfig.links.github, icon: GithubIcon, external: true },
  ];

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {links.map(({ label, value, href, icon: Icon, external }) => (
            <a key={href} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} data-analytics-event={href === siteConfig.links.github ? "github_click" : undefined} className="surface-card group flex min-h-48 flex-col p-6 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <Icon aria-hidden="true" className="size-6 text-accent" />
              <span className="mt-auto pt-8 text-sm font-semibold text-text-primary">{label}</span>
              <span className="mt-1 flex items-center gap-1 break-all text-sm text-text-muted">{value}{external ? <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" /> : null}</span>
            </a>
          ))}
        </div>
        <div className="mt-8"><ContactForm locale={locale} /></div>
      </Container>
    </>
  );
}
