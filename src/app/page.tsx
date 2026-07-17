import {
  ArrowRight,
  FileText,
  ListChecks,
  Lock,
  Pencil,
  RefreshCw,
  Shuffle,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { QuickModeBadge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

const HOW_IT_WORKS = [
  {
    icon: FileText,
    title: "Add your material",
    body: "Upload a PDF or paste notes and markdown. For PDFs you can pick a page range and see how much text each page holds before you generate.",
  },
  {
    icon: Shuffle,
    title: "Generate in Quick mode",
    body: "A deterministic generator turns sentences and key terms into multiple-choice, true/false, short-answer and fill-in-the-blank questions. No account, no API key.",
  },
  {
    icon: Pencil,
    title: "Edit and organise",
    body: "Rewrite questions, fix answers, reorder them, remove duplicates, or regenerate any single question. Nothing you edit is thrown away without a warning.",
  },
  {
    icon: ListChecks,
    title: "Play, score, revise",
    body: "Take the quiz with keyboard shortcuts and optional timing, review what you missed, and retake only the ones you got wrong.",
  },
];

const FEATURES = [
  {
    icon: Lock,
    title: "Local-first by design",
    body: "Documents are read in your browser. Quizzes, decks and results live in IndexedDB on your device — there is no server database.",
  },
  {
    icon: RefreshCw,
    title: "Regenerate that works",
    body: "Per-question and whole-quiz regeneration re-run the generator on your source instead of silently clearing your work.",
  },
  {
    icon: Timer,
    title: "Optional timed mode",
    body: "Turn on a per-quiz timer when you want exam pressure. It is never the default, and remaining time is shown as text, not just colour.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any (web browser)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Kazi Musharraf", url: "https://www.mkazi.live" },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="flex flex-col items-start gap-6 pt-6">
        <QuickModeBadge />
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl">
          Turn a PDF or your notes into a quiz you can actually study from.
        </h1>
        <p className="max-w-2xl text-lg text-ink-secondary">
          MK QuizFlow reads your material in the browser and builds quizzes and flashcards from it.
          The Quick mode is deterministic and works with zero AI keys, so you can generate, play and
          export without signing up for anything.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/tool" className={buttonClasses("primary", "lg")}>
            Create a quiz
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
          </Link>
          <Link href="/flashcards" className={buttonClasses("secondary", "lg")}>
            Study flashcards
          </Link>
        </div>
        <p className="text-sm text-ink-muted">
          Free and open source. Your documents never leave your device in Quick mode.
        </p>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="flex flex-col gap-8">
        <div>
          <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">How it works</p>
          <h2 id="how-heading" className="mt-2 font-display text-2xl text-ink">
            From source to study session in four steps
          </h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-md border border-line bg-surface-2 p-5 shadow-paper"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent-tint text-accent">
                  <step.icon size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="font-mono text-sm text-ink-muted">{`0${i + 1}`}</span>
              </div>
              <h3 className="font-display text-lg text-ink">{step.title}</h3>
              <p className="text-sm text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading" className="flex flex-col gap-8">
        <div>
          <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">
            What you get
          </p>
          <h2 id="features-heading" className="mt-2 font-display text-2xl text-ink">
            Built for revision, not for a demo
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-lg border border-line bg-surface-2 p-6 shadow-paper"
            >
              <span className="flex size-10 items-center justify-center rounded-md bg-accent-tint text-accent">
                <feature.icon size={20} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="font-display text-xl text-ink">{feature.title}</h3>
              <p className="text-sm text-ink-secondary">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick mode explainer */}
      <section className="rounded-lg border border-line bg-surface-2 p-6 shadow-paper sm:p-8">
        <div className="flex flex-col gap-4 md:max-w-2xl">
          <QuickModeBadge className="self-start" />
          <h2 className="font-display text-2xl text-ink">What &ldquo;Quick mode&rdquo; means</h2>
          <p className="text-ink-secondary">
            Quick mode uses sentence and keyword heuristics — not a language model — to build
            questions. The same text always produces the same questions, and it runs fully offline.
            It will not paraphrase or invent facts, so questions stay close to your source. When you
            want richer, reworded questions later, an optional AI layer can be added, and it is
            always labelled so you know which mode produced what.
          </p>
          <Link href="/tool" className={buttonClasses("accent", "md", "self-start")}>
            Try Quick mode
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
