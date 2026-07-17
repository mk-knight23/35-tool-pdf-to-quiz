import { Globe, GitBranch } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/ui/icons";
import { CREATOR, FOOTER_SENTENCE, NAV_LINKS, SITE } from "@/lib/site";

/** Footer present on every route. Carries the exact creator sentence (STANDARDS §3). */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg text-ink">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-sm text-ink-secondary">
            A local-first study tool. Documents stay in your browser.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink-secondary hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={CREATOR.github}
            className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink"
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitHubIcon size={16} /> GitHub
          </a>
          <a
            href={CREATOR.portfolio}
            className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Globe size={16} strokeWidth={1.75} aria-hidden /> Portfolio
          </a>
          <a
            href={CREATOR.repo}
            className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink"
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitBranch size={16} strokeWidth={1.75} aria-hidden /> Source repository
          </a>
        </div>
      </div>

      <div className="border-t border-line px-4 py-5 text-center text-sm text-ink-muted sm:px-6 lg:px-8">
        {FOOTER_SENTENCE}
      </div>
    </footer>
  );
}
