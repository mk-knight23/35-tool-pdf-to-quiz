import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Keep track of updates, performance boosts, and feature releases in MK QuizFlow.",
  alternates: { canonical: "/changelog" },
};

const RELEASES = [
  {
    version: "v2.0.0",
    date: "July 2026",
    title: "App Router Rebuild & AI Gateway",
    items: [
      "Migrated the entire frontend stack from client-side Vite SPA to Next.js App Router (strict TypeScript, Tailwind CSS v4).",
      "Added serverless AI integration using Vercel AI SDK v6.",
      "Implemented a token-bucket rate limiter and 40/day daily quotas for anonymous usage.",
      "Added support for Bring Your Own Key (BYOK) with memory-only retention.",
      "Added Weak-Topic analysis and hint support inside the player.",
      "Replaced local storage structures with IndexedDB (idb) for robust storage.",
      "scaffolded use cases, guides, sitemaps, and robots metadata files for SEO.",
    ],
  },
  {
    version: "v1.2.0",
    date: "May 2026",
    title: "Local PDF Worker optimization",
    items: [
      "Optimized the pdf.js extraction worker to build locally inside next public workspace instead of requesting third-party CDNs.",
      "Allowed page range selections with character count auditing before running generation.",
    ],
  },
  {
    version: "v1.0.0",
    date: "March 2026",
    title: "Initial Launch (Quick Mode)",
    items: [
      "Implemented client-side deterministic keyword-sentence matching algorithms.",
      "Scaffolded multiple choice, true/false, fill-in-the-blanks, and short answer question players.",
      "Persisted settings for theme, sound, and exportable JSON schema packs.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Releases</p>
        <h1 className="font-display text-4xl text-ink mt-2">Changelog</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Track updates, technical patches, and improvements made to QuizFlow.
        </p>
      </div>

      <hr className="border-line" />

      <div className="flex flex-col gap-10">
        {RELEASES.map((rel) => (
          <section key={rel.version} className="relative pl-6 border-l border-line flex flex-col gap-3">
            <span className="absolute -left-1.5 top-1.5 size-3 rounded-full bg-accent" />
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-xl text-ink">{rel.version}</h2>
              <span className="text-xs text-ink-muted">{rel.date}</span>
            </div>
            <h3 className="text-sm font-semibold text-ink-secondary">{rel.title}</h3>
            <ul className="list-disc pl-5 text-sm text-ink-secondary flex flex-col gap-1.5">
              {rel.items.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
