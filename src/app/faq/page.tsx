import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about privacy, PDF support, API keys, and browser storage in MK QuizFlow.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "Are my PDF files uploaded to a server?",
    a: "No. PDF text extraction is completed entirely inside your browser tab using pdf.js. If you use Quick Mode, everything runs locally on your machine with zero network requests carrying your text. If you choose AI Mode, the text is streamed securely to the server route to hit the LLM and is discarded immediately after response generation.",
  },
  {
    q: "Can QuizFlow read scanned handwritten notes?",
    a: "Quick Mode cannot read image-only scanned PDFs as it relies on raw text data coordinates. For scanned or handwritten materials, you must copy and paste the text representation directly in the text input area.",
  },
  {
    q: "What is the difference between Quick Mode and AI Mode?",
    a: "Quick Mode runs client-side and uses deterministic keyword algorithms to hide words and create questions. AI Mode uses advanced language models to synthesize reworded multiple choice and short answer questions along with tailored explanations.",
  },
  {
    q: "How does the BYOK (Bring Your Own Key) model work?",
    a: "If you run out of anonymous daily free limits (40 per day) or want to use a specific model provider, you can save your API key in settings. The key is held client-side in the browser's tab memory only. It is never logged on our servers or stored on disk.",
  },
  {
    q: "How is my study progress saved?",
    a: "Your study history, flashcards, and results are stored on your local device inside IndexedDB. Clearing browser cookies or cache may remove this data, so we recommend using the Export button in Settings to create backups.",
  },
  {
    q: "What question types can QuizFlow make?",
    a: "Multiple choice, true/false, short answer, and fill-in-the-blank (cloze). In the editor you can change a question's type, rewrite the prompt and options, set the correct answer, and add an explanation. Quick mode leans on fill-in-the-blank and short answer because those are what keyword heuristics do reliably; AI mode can produce all four with reworded options.",
  },
  {
    q: "Can I pick which pages of a PDF to use?",
    a: "Yes. After a PDF is read, you get a page-range field (for example 12-34, or 1-3, 5, 8-10). QuizFlow shows the character count per page so you can spot blank or scanned pages before generating, and it only uses the pages you select.",
  },
  {
    q: "Is there really no sign-up, and is it free?",
    a: "There is no account and no sign-up. Quick mode is free and unlimited because it runs on your machine. AI mode draws on a shared daily allowance; if that runs out you can add your own gateway key. The code is MIT-licensed and public, so you can also run your own copy.",
  },
  {
    q: "Does it work offline?",
    a: "Quick mode does. Once the page has loaded, PDF reading, question generation, playing, scoring, and exporting all run in the browser with no network calls carrying your content. AI mode is the only part that needs a connection, because it calls the AI gateway.",
  },
  {
    q: "What are the keyboard shortcuts in the quiz player?",
    a: "Press 1-4 to pick an option, Enter to confirm or move to the next question, and Escape to exit. The whole app is keyboard-operable, and the reorder controls in the editor have up/down buttons so you never need a mouse to rearrange questions.",
  },
  {
    q: "How does 'retake incorrect only' work?",
    a: "When you finish a quiz, the results screen lists which questions you missed. 'Retake incorrect only' starts a new run containing just those questions, so you spend your time on the material you haven't locked in yet rather than repeating what you already know.",
  },
  {
    q: "What can I export, and will it re-import?",
    a: "You can export a quiz to JSON, CSV, Markdown, or a printable HTML page (use your browser's print-to-PDF for a clean handout). JSON re-imports back into QuizFlow with its schema validated first. Exports made in Quick mode carry a 'Quick mode (no AI)' label so their origin is clear.",
  },
  {
    q: "How does weak-topic analysis use my data?",
    a: "It looks only at your local results — which questions you got right or wrong — and groups the misses into topics so you can see where to focus. It never re-reads or uploads your source document; it works from the aggregated outcomes already stored on your device.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Help Center</p>
        <h1 className="font-display text-4xl text-ink mt-2">Frequently Asked Questions</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Get answers to common queries about privacy, data models, and configurations.
        </p>
      </div>

      <hr className="border-line" />

      <div className="flex flex-col gap-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="flex flex-col gap-2 bg-surface-2 border border-line p-5 rounded-md shadow-paper">
            <h2 className="font-display text-lg font-semibold text-ink">{faq.q}</h2>
            <p className="text-sm text-ink-secondary leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
