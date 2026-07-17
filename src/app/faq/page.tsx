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
