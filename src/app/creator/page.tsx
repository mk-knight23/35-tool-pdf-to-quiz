import type { Metadata } from "next";
import { GitBranch, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { CREATOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Creator",
  description: "Meet Kazi Musharraf, the systems architect and AI-native engineer behind MK QuizFlow.",
  alternates: { canonical: "/creator" },
};

export default function CreatorPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": CREATOR.name,
    "jobTitle": "AI Engineer & Systems Architect",
    "url": CREATOR.portfolio,
    "sameAs": [
      CREATOR.github,
    ],
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="flex flex-col items-center text-center gap-4">
        <div className="size-24 rounded-full bg-accent-strong text-on-accent flex items-center justify-center font-display text-4xl font-semibold shadow-paper">
          KM
        </div>
        <div>
          <h1 className="font-display text-3xl text-ink font-semibold">{CREATOR.name}</h1>
          <p className="text-sm text-ink-secondary mt-1">{CREATOR.role}</p>
        </div>
      </div>

      <hr className="border-line" />

      <div className="qf-prose text-sm text-ink-secondary leading-relaxed flex flex-col gap-4">
        <p>
          Hi. I&apos;m {CREATOR.name} (also known as mk-knight), an AI systems engineer and
          full-stack developer. I build local-first, low-maintenance, privacy-minded developer tools
          and study platforms.
        </p>
        <p>
          I made QuizFlow because I wanted a study tool that keeps my documents on my own machine.
          Highlighting lecture slides is passive, and most cloud study apps ask you to upload
          everything first. QuizFlow runs client-side by default, so you can generate and take
          quizzes offline.
        </p>
        <p>
          If you want to collaborate on AI integration pipelines, custom MCP servers, or full-stack
          Next.js systems, reach out through my portfolio or open an issue on the repo.
        </p>
      </div>

      <div className="flex flex-col gap-3 items-center justify-center mt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href={CREATOR.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-line bg-surface-2 px-4 py-2 rounded-md text-sm text-ink hover:bg-raised transition-colors"
          >
            <GitHubIcon size={16} /> GitHub
          </a>
          <a
            href={CREATOR.portfolio}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-line bg-surface-2 px-4 py-2 rounded-md text-sm text-ink hover:bg-raised transition-colors"
          >
            <Globe size={16} className="text-accent" /> Portfolio
          </a>
          <a
            href={CREATOR.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-line bg-surface-2 px-4 py-2 rounded-md text-sm text-ink hover:bg-raised transition-colors"
          >
            <GitBranch size={16} className="text-accent" /> Repository
          </a>
        </div>
      </div>
    </div>
  );
}
