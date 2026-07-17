import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our binding privacy commitments. Your files never leave your browser unless explicitly sent to AI endpoints.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Legal</p>
        <h1 className="font-display text-4xl text-ink mt-2">Privacy Policy</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Our binding privacy guarantees. We do not track, collect, or store your text.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink">1. Document Processing</h2>
          <p>
            When you upload PDF files or paste study text, the extraction process runs completely in your web browser tab. No document text, vocabulary lists, or raw files are uploaded to our servers for processing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">2. AI Generation Services</h2>
          <p>
            When you select <strong>AI mode</strong>, the extracted text is streamed to the server endpoint to request questions. The server forwards the text block, receives the parsed questions, and returns them to your client. No study text or questions are logged or persisted server-side.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">3. Bring Your Own Key (BYOK)</h2>
          <p>
            If you supply your own API key (a Vercel AI Gateway key), it is kept in browser tab session memory only. It is never saved to disk, never logged on our servers, and never sent to analytics providers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">4. Local Storage</h2>
          <p>
            All generated quizzes, results, metrics, and flashcard decks are stored in <strong>IndexedDB</strong> on your local machine. We cannot access or recover your data if you clear your browser profile data.
          </p>
        </section>
      </div>
    </div>
  );
}
