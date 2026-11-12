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
    <footer className="border-t border-border bg-bg-page py-14 sm:py-18 text-text-muted">
      <Container>
        <div className="grid gap-10 border-b border-border pb-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">
          <div className="max-w-md">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-2">
              Portfolio Ingénieur
            </span>
            <Link
              href={`/${locale}`}
              className="font-display text-2xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              {dictionary.footer.builtWith}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-4">
              {dictionary.footer.navigation}
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  className="hover:text-text-primary transition-colors"
                  href={`/${locale}/projects`}
                >
                  {dictionary.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-text-primary transition-colors"
                  href={`/${locale}/journey`}
                >
                  {dictionary.nav.journey}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-text-primary transition-colors"
                  href={`/${locale}/certifications`}
                >
                  Certifications
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-text-primary transition-colors"
                  href={`/${locale}/contact`}
                >
                  {dictionary.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-4">
              {dictionary.footer.elsewhere}
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors"
                  href={contactLinks.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="size-3.5 text-accent" />
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors"
                  href={contactLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="size-3.5 text-accent" />
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors"
                  href={contactLinks.tryHackMe}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>TryHackMe</span>
                  <ArrowUpRight className="size-3.5 text-accent" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-text-muted">
          <p>© {year} {siteConfig.name}. {dictionary.footer.rights}</p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale === "fr" ? "en" : "fr"}`}
              className="hover:text-text-primary transition-colors"
            >
              {locale === "fr" ? "English version" : "Version française"}
            </Link>
            <span className="text-text-muted/40">·</span>
            <Link
              href="/admin"
              className="hover:text-text-primary transition-colors"
            >
              {locale === "fr" ? "Console d’administration" : "Admin console"}
            </Link>
          </div>
          <p className="flex items-center gap-2">
            <span>Next.js</span>
            <span className="text-text-muted/40">·</span>
            <span>TypeScript</span>
            <span className="text-text-muted/40">·</span>
            <span>Supabase</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
