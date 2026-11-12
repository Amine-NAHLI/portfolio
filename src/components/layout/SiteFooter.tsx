import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  contactLinks: { github: string; linkedin: string; tryHackMe: string };
};

export default function SiteFooter({ locale, dictionary, contactLinks }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#0B0B0C] py-14 sm:py-18 text-[#A1A1AA]">
      <Container>
        <div className="grid gap-10 border-b border-white/[0.08] pb-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">
          <div className="max-w-md">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C8F122] block mb-2">
              Portfolio Ingénieur
            </span>
            <Link
              href={`/${locale}`}
              className="font-display text-2xl font-bold tracking-tight text-[#FFFFFF] hover:text-[#C8F122] transition-colors"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed">
              {dictionary.footer.builtWith}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] mb-4">
              {dictionary.footer.navigation}
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  className="hover:text-[#FFFFFF] transition-colors"
                  href={`/${locale}/projects`}
                >
                  {dictionary.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#FFFFFF] transition-colors"
                  href={`/${locale}/journey`}
                >
                  {dictionary.nav.journey}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#FFFFFF] transition-colors"
                  href={`/${locale}/certifications`}
                >
                  Certifications
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#FFFFFF] transition-colors"
                  href={`/${locale}/contact`}
                >
                  {dictionary.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] mb-4">
              {dictionary.footer.elsewhere}
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  className="inline-flex items-center gap-1.5 hover:text-[#FFFFFF] transition-colors"
                  href={contactLinks.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="size-3.5 text-[#C8F122]" />
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-1.5 hover:text-[#FFFFFF] transition-colors"
                  href={contactLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="size-3.5 text-[#C8F122]" />
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-1.5 hover:text-[#FFFFFF] transition-colors"
                  href={contactLinks.tryHackMe}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>TryHackMe</span>
                  <ArrowUpRight className="size-3.5 text-[#C8F122]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#A1A1AA]">
          <p>© {year} {siteConfig.name}. {dictionary.footer.rights}</p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale === "fr" ? "en" : "fr"}`}
              className="hover:text-[#FFFFFF] transition-colors"
            >
              {locale === "fr" ? "English version" : "Version française"}
            </Link>
            <span className="text-white/20">·</span>
            <Link
              href="/admin"
              className="hover:text-[#FFFFFF] transition-colors"
            >
              {locale === "fr" ? "Console d’administration" : "Admin console"}
            </Link>
          </div>
          <p className="flex items-center gap-2">
            <span>Next.js</span>
            <span className="text-white/20">·</span>
            <span>TypeScript</span>
            <span className="text-white/20">·</span>
            <span>Supabase</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
