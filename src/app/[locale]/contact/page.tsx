import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import { getPublicContactLinks } from "@/features/portfolio/data";

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
  const contactLinks = await getPublicContactLinks();
  const links = [
    { label: copy.email, value: contactLinks.email.replace("mailto:", ""), href: contactLinks.email, icon: Mail, external: false },
    { label: copy.linkedin, value: contactLinks.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, ""), href: contactLinks.linkedin, icon: LinkedinIcon, external: true },
    { label: copy.github, value: contactLinks.github.replace(/^https?:\/\/(www\.)?/, ""), href: contactLinks.github, icon: GithubIcon, external: true },
  ];

  return (
    <Container className="py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
        
        {/* Left Column (Sticky) */}
        <div className="lg:sticky lg:top-32 lg:h-max">
          <div className="mb-12 lg:mb-16">
            <p className="font-mono text-sm uppercase tracking-widest text-accent mb-4">{copy.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-text-primary mb-6">{copy.title}</h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-md">{copy.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            {links.map(({ label, value, href, icon: Icon, external }) => (
              <a 
                key={href} 
                href={href} 
                target={external ? "_blank" : undefined} 
                rel={external ? "noreferrer" : undefined} 
                data-analytics-event={href === contactLinks.github ? "github_click" : undefined} 
                className="group relative flex items-center justify-between p-4 rounded-2xl border border-border/20 bg-surface-subtle/20 backdrop-blur-md transition-all hover:bg-surface-subtle/60 hover:border-accent/30 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-bg-page border border-border/50 group-hover:border-accent/40 group-hover:shadow-[0_0_20px_-5px_rgba(var(--color-accent-rgb),0.3)] transition-all">
                    <Icon aria-hidden="true" className="size-5 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{label}</p>
                    <p className="text-xs font-mono text-text-secondary mt-1">{value}</p>
                  </div>
                </div>
                {external ? <ArrowUpRight aria-hidden="true" className="size-5 text-text-muted opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent transition-all relative z-10" /> : null}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column (Form) */}
        <div className="mt-8 lg:mt-0">
          <ContactForm locale={locale} />
        </div>
      </div>
    </Container>
  );
}
