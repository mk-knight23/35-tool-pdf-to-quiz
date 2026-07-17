import type { Metadata } from "next";
import { Globe, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { CREATOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kazi Musharraf for suggestions, feature requests, or collaboration.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Get in touch</p>
        <h1 className="font-display text-4xl text-ink mt-2">Contact</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Reach out if you find bugs, want to request features, or have collaboration ideas.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <p>
          QuizFlow is built and maintained by {CREATOR.name} as an open-source project. Bug reports
          and feature requests are best filed as GitHub issues so they stay public and trackable. For
          anything else, email works too.
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <a
            href={CREATOR.issues}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-3 text-ink hover:text-accent"
          >
            <GitHubIcon size={18} />
            <span>Open a GitHub issue for bugs or feature requests</span>
          </a>
          <a
            href={`mailto:${CREATOR.email}?subject=QuizFlow`}
            className="flex items-center gap-3 text-ink hover:text-accent"
          >
            <Mail size={18} className="text-accent" />
            <span>Email {CREATOR.email}</span>
          </a>
          <a
            href={CREATOR.portfolio}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-3 text-ink hover:text-accent"
          >
            <Globe size={18} className="text-accent" />
            <span>Visit the portfolio at mkazi.live</span>
          </a>
        </div>
      </div>
    </div>
  );
}
