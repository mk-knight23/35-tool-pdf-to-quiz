import type { Metadata } from "next";
import { GitHubIcon } from "@/components/ui/icons";
import { CREATOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "Open Source",
  description: "QuizFlow is built on open standards and licensing. Explore our source code, license terms, and guide to contributing.",
  alternates: { canonical: "/open-source" },
};

export default function OpenSourcePage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Community</p>
        <h1 className="font-display text-4xl text-ink mt-2">Open Source</h1>
        <p className="text-ink-secondary mt-2 text-base">
          QuizFlow is built completely in the open, allowing developers to inspect, host, or contribute to the platform.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink">Licensing</h2>
          <p>
            The software is distributed under the <strong>MIT License</strong>. This permits commercial use, modification, distribution, and private use, provided that the original copyright and license notice are included.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Tech Stack Standards</h2>
          <p>
            We adhere to strict quality standards to keep the workspace lightweight and modular:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
            <li>Framework: Next.js App Router (React 19, TypeScript strict mode).</li>
            <li>Styles: Tailwind CSS v4 using CSS variable tokens.</li>
            <li>AI SDK: Vercel AI SDK (OIDC/Gateway routing, no direct client credentials).</li>
            <li>Storage: Client-side IndexedDB with no server database dependencies.</li>
          </ul>
        </section>

        <div className="pt-4 flex gap-3">
          <a
            href={CREATOR.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-line bg-surface-2 px-4 py-2.5 rounded-md text-sm text-ink hover:bg-raised transition-colors"
          >
            <GitHubIcon size={16} /> Inspect Repository
          </a>
        </div>
      </div>
    </div>
  );
}
