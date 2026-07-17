import { Globe, GitBranch } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/ui/icons";
import { CREATOR, FOOTER_SENTENCE, NAV_LINKS, SITE } from "@/lib/site";

/** Footer present on every route. Carries the exact creator sentence (STANDARDS §3). */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-white/5 dark:bg-slate-950/10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display font-semibold text-base text-ink">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-xs text-ink-secondary">
            A local-first study tool. Documents stay in your browser.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-xs">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink-secondary hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-xs">
          <a
            href={CREATOR.github}
            className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink"
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitHubIcon size={14} /> GitHub
          </a>
          <a
            href={CREATOR.portfolio}
            className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Globe size={14} strokeWidth={1.75} aria-hidden /> Portfolio
          </a>
          <a
            href={CREATOR.repo}
            className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink"
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitBranch size={14} strokeWidth={1.75} aria-hidden /> Source repository
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-ink-muted sm:px-6 lg:px-8">
        {FOOTER_SENTENCE}
      </div>
    </footer>
  );
}
