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
    <div className="min-h-screen bg-[#000000] text-[#f3f1f7] pb-32">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-10%] top-1/4 size-[600px] rounded-full bg-[#0E161A] opacity-60 blur-[180px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-10%] top-1/2 size-[650px] rounded-full bg-[#070A09] opacity-70 blur-[180px] -z-10"
      />

      <Container className="pt-28 sm:pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Sticky Overview & Channels) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8FB3A2] mb-3 block">
                {copy.eyebrow}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-[#f3f1f7] leading-tight mb-5">
                {copy.title}
              </h1>
              <p className="text-base text-[#797681] leading-relaxed max-w-md font-normal">
                {copy.description}
              </p>
            </div>

            {/* Direct Connect Channels */}
            <div className="flex flex-col gap-3">
              {links.map(({ label, value, href, icon: Icon, external }) => (
                <a
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  data-analytics-event={href === contactLinks.github ? "github_click" : undefined}
                  className="group relative flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#070A09] transition-all duration-300 hover:border-[#8FB3A2]/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8FB3A2]/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center size-11 rounded-xl bg-[#060605] border border-white/10 group-hover:border-[#8FB3A2]/50 text-[#8FB3A2] transition-all">
                      <Icon aria-hidden="true" className="size-4 text-[#8FB3A2]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#f3f1f7] group-hover:text-[#8FB3A2] transition-colors">
                        {label}
                      </p>
                      <p className="text-xs font-mono text-[#797681] mt-0.5">{value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="size-4 text-[#797681] group-hover:text-[#8FB3A2] transition-colors" />
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
