import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import Container from "@/components/ui/Container";
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
    {
      label: copy.email,
      value: contactLinks.email.replace("mailto:", ""),
      href: contactLinks.email,
      icon: Mail,
      external: false,
    },
    {
      label: copy.linkedin,
      value: contactLinks.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, ""),
      href: contactLinks.linkedin,
      icon: LinkedinIcon,
      external: true,
    },
    {
      label: copy.github,
      value: contactLinks.github.replace(/^https?:\/\/(www\.)?/, ""),
      href: contactLinks.github,
      icon: GithubIcon,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-page text-text-primary pt-20 sm:pt-24 pb-8 flex items-start lg:items-center">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-10%] top-1/4 size-[600px] rounded-full bg-surface-raised opacity-60 blur-[180px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-10%] top-1/2 size-[650px] rounded-full bg-surface opacity-70 blur-[180px] -z-10"
      />

      <Container className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
          
          {/* Left Column (Overview & Channels) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-2 block">
                {copy.eyebrow}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-text-primary leading-[1.08] mb-3">
                {copy.title}
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-md font-normal">
                {copy.description}
              </p>
            </div>

            {/* Direct Connect Channels */}
            <div className="flex flex-col gap-2.5">
              {links.map(({ label, value, href, icon: Icon, external }) => (
                <a
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  data-analytics-event={href === contactLinks.github ? "github_click" : undefined}
                  className="group relative flex items-center justify-between px-4 py-3 rounded-2xl border border-border-strong bg-surface transition-all duration-300 hover:border-accent/45 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-bg-page border border-border group-hover:border-accent/50 text-accent transition-all">
                      <Icon aria-hidden="true" className="size-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {label}
                      </p>
                      <p className="text-xs font-mono text-text-secondary mt-0.5">{value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="size-4 text-text-muted group-hover:text-accent transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column (High-End Form) */}
          <div className="lg:col-span-7">
            <ContactForm locale={locale} />
          </div>
        </div>
      </Container>
    </div>
  );
}
