import type { Metadata } from "next";
import { CookiesConsent } from "./CookiesConsent";

export const metadata: Metadata = {
  title: "Cookie Policy & Consent",
  description:
    "How MK QuizFlow uses cookies and analytics, and how to allow or decline tracking. Analytics are off by default.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Legal</p>
        <h1 className="font-display text-4xl text-ink mt-2">Cookie Policy &amp; Consent</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Manage your tracking preferences. We respect your choice.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl text-ink">Use of cookies</h2>
          <p>
            QuizFlow does not set advertising or cross-site tracking cookies. In production it can
            load Google Tag Manager to collect anonymous, bucketed usage statistics that help us
            improve the tool — but only after you allow it below. We never transmit your document
            text, question content, file names, passwords, or API keys.
          </p>
          <p>
            Analytics are declined by default. Nothing loads until you explicitly opt in, and you can
            change your mind here at any time.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl text-ink">Local storage (not cookies)</h2>
          <p>
            Your quizzes, decks, results, and preferences live in your browser via IndexedDB and
            localStorage. That is how the app remembers your work between visits. It is separate from
            analytics and never leaves your device. You can export or clear all of it from Settings.
          </p>
        </section>

        <CookiesConsent />
      </div>
    </div>
  );
}
