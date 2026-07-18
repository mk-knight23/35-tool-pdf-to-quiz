import {
  ArrowRight,
  FileText,
  ListChecks,
  Lock,
  Shuffle,
  Loader2
} from "lucide-react";
import { Suspense } from "react";
import { ToolWorkspace } from "@/app/tool/ToolWorkspace";
import { QuickModeBadge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

const HOW_IT_WORKS = [
  {
    icon: FileText,
    title: "1. Add your material",
    body: "Paste lecture notes, study guides, or drop a text-based PDF file directly into the browser.",
  },
  {
    icon: Shuffle,
    title: "2. Generate locally",
    body: "A deterministic sentence heuristic engine parses key terms and structures questions in seconds. No keys needed.",
  },
  {
    icon: ListChecks,
    title: "3. Play and revise",
    body: "Answer the quiz with instant feedback, view your score, and review mistakes to lock in memory.",
  },
];

const USE_CASES = [
  {
    title: "Exam & Test Revision",
    description: "Convert lecture notes or textbooks into rapid mock tests before exams to check your knowledge retention.",
  },
  {
    title: "Vocabulary & Definitions",
    description: "Drill terms and definitions using automatically formatted fill-in-the-blank and short-answer questions.",
  },
  {
    title: "Interview Prep",
    description: "Upload key documentation or concept cheat sheets and quiz yourself on crucial talking points.",
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
    <div className="flex flex-col gap-20 pb-16 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="flex flex-col items-center text-center gap-4 pt-6 max-w-3xl mx-auto">
        <QuickModeBadge />
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl font-bold tracking-tight">
          Turn any PDF or notes into a study quiz, instantly.
        </h1>
        <p className="text-base text-ink-secondary max-w-2xl leading-relaxed">
          MK QuizFlow reads your material directly in the browser. Build study quizzes and flashcard decks
          with zero server uploads, zero accounts, and zero API keys.
        </p>
      </section>

      {/* Immediate Utility: Workspace Card */}
      <section id="workspace-card" className="w-full">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 border border-line bg-surface-2 rounded-2xl">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-sm text-ink-secondary mt-2">Loading study workspace…</p>
          </div>
        }>
          <ToolWorkspace />
        </Suspense>
      </section>

      {/* Product Story Section */}
      <section className="grid gap-12 md:grid-cols-2 border-t border-line pt-12 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <span className="text-2xs font-bold uppercase tracking-[0.1em] text-accent">The Problem</span>
          <h2 className="font-display text-2xl text-ink font-bold leading-tight">
            Passive reading creates the illusion of learning.
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Re-reading notes, highlighting PDFs, and staring at slides are the most common revision methods—and the least effective. Without actively forcing your brain to retrieve information, retention drops rapidly after you close the file.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-2xs font-bold uppercase tracking-[0.1em] text-accent">The Solution</span>
          <h2 className="font-display text-2xl text-ink font-bold leading-tight">
            Active recall built into your daily revision.
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            QuizFlow helps you test yourself immediately. By transforming passive notes into multiple-choice, true/false, and fill-in-the-blank questions, it forces retrieval practice. You focus your limited study time on concepts you actually got wrong.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" aria-labelledby="how-heading" className="flex flex-col gap-8 border-t border-line pt-12">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-2xs font-bold uppercase tracking-[0.1em] text-accent">Revision Workflow</p>
          <h2 id="how-heading" className="mt-2 font-display text-3xl text-ink font-bold">
            From notes to mock test in seconds
          </h2>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <h3 className="font-display text-lg text-ink font-bold">{step.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Basic vs Advanced Options */}
      <section className="grid gap-8 md:grid-cols-2 border-t border-line pt-12 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl text-ink font-bold">Basic Mode (Default)</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span> Fast generation using offline sentence heuristics.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span> Bypasses setup screens to start answering questions immediately.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span> No AI keys or internet connections required.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl text-ink font-bold">Advanced Options</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span> Fine-tune question types, difficulty, and quiz timers.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span> Personal AI-mode capability using your own Vercel AI Gateway keys.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span> Manual question editing, pruning, and flashcard export.
            </li>
          </ul>
        </div>
      </section>

      {/* Use Cases */}
      <section className="flex flex-col gap-8 border-t border-line pt-12">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-2xs font-bold uppercase tracking-[0.1em] text-accent">Use Cases</p>
          <h2 className="mt-2 font-display text-3xl text-ink font-bold">Built for real revision tasks</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="rounded-2xl border border-line bg-surface-2 p-6 shadow-sm">
              <h3 className="font-display text-lg text-ink font-bold">{uc.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary leading-relaxed">{uc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy and Trust Details */}
      <section className="rounded-2xl border border-line bg-surface-2 p-6 md:p-8 shadow-paper max-w-3xl mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-xl bg-accent-tint text-accent">
            <Lock size={16} />
          </span>
          <h3 className="font-display text-lg text-ink font-bold">Zero-Egress Browser Privacy</h3>
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed">
          MK QuizFlow is local-first by design. Everything happens on your device:
        </p>
        <ul className="flex flex-col gap-2 text-xs text-ink-muted leading-relaxed list-disc pl-5">
          <li><strong>Local Extraction:</strong> PDF text is read inside your browser using pdfjs-dist. The file is never sent to a backend server.</li>
          <li><strong>Local Generation:</strong> Quick mode heuristics run purely client-side to generate questions.</li>
          <li><strong>Local Storage:</strong> Quizzes, results, and flashcards are persisted only in your browser&apos;s IndexedDB database.</li>
          <li><strong>Consent-Gated Analytics:</strong> We track generic feature usages (e.g. quiz completed) to improve the product. We never log or transmit notes, PDFs, or generated questions.</li>
        </ul>
      </section>

      {/* Limitations */}
      <section className="max-w-3xl mx-auto text-center flex flex-col gap-3">
        <h3 className="font-display text-base text-ink font-bold">Product Limitations</h3>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Quick mode is deterministic and extracts sentences directly—it does not synthesize complex AI scenarios or re-read concepts dynamically. Image-only (scanned) PDFs are not supported because we do not run OCR in-browser. Personal AI Keys are supported for advanced semantic generation.
        </p>
      </section>

      {/* Final CTA */}
      <section className="flex flex-col items-center gap-4 text-center max-w-xl mx-auto border-t border-line pt-12">
        <h2 className="font-display text-2xl text-ink font-bold">Ready to test your knowledge?</h2>
        <a
          href="#workspace-card"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-accent-strong hover:bg-accent text-on-accent text-sm font-bold shadow-md transition-all active:scale-[0.98]"
        >
          Create your first quiz
          <ArrowRight size={16} strokeWidth={2} />
        </a>
      </section>
    </div>
  );
}
