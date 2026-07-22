import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export default function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-subtle py-12 sm:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:gap-16">
          <div className="max-w-sm">
            <Link href={`/${locale}`} className="text-lg font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{dictionary.footer.builtWith}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">{dictionary.footer.navigation}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-text-secondary">
              <li><Link className="footer-link" href={`/${locale}/projects`}>{dictionary.nav.projects}</Link></li>
              <li><Link className="footer-link" href={`/${locale}/journey`}>{dictionary.nav.journey}</Link></li>
              <li><Link className="footer-link" href={`/${locale}/blog`}>{dictionary.nav.blog}</Link></li>
              <li><Link className="footer-link" href={`/${locale}/contact`}>{dictionary.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">{dictionary.footer.elsewhere}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-text-secondary">
              <li><a className="footer-link inline-flex items-center gap-1" href={siteConfig.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" className="size-3.5" /></a></li>
              <li><a className="footer-link inline-flex items-center gap-1" href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" className="size-3.5" /></a></li>
              <li><a className="footer-link inline-flex items-center gap-1" href={siteConfig.links.tryHackMe} target="_blank" rel="noreferrer">TryHackMe <ArrowUpRight aria-hidden="true" className="size-3.5" /></a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name}. {dictionary.footer.rights}</p>
          <p>Next.js · TypeScript · Supabase</p>
        </div>
      </Container>
    </footer>
  );
}

