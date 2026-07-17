import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Study Guides",
  description: "Read Kazi's original tutorials on active recall, spaced repetition scheduling, and local-first study workflows.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Knowledge Base</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Guides &amp; Tutorials</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-secondary">
          Deep-dives into cognitive psychology, local file parsing, and structured test strategies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(GUIDES).map((guide) => (
          <div
            key={guide.slug}
            className="flex flex-col justify-between gap-4 rounded-lg border border-line bg-surface-2 p-6 shadow-paper"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-3xs text-ink-muted">
                <span>{guide.publishedAt}</span>
                <span>·</span>
                <span>{guide.readTime}</span>
              </div>
              <h2 className="font-display text-xl text-ink leading-tight">{guide.title}</h2>
              <p className="text-sm text-ink-secondary leading-relaxed">{guide.description}</p>
            </div>
            <Link
              href={`/guides/${guide.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-strong self-start"
            >
              Read article <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
