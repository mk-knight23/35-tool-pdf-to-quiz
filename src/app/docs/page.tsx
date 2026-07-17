import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn about the architecture, security models, local IndexedDB persistence, and generator algorithms behind MK QuizFlow.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Technical Manual</p>
        <h1 className="font-display text-4xl text-ink mt-2">Documentation</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Detailed guide to understanding how QuizFlow parses text, stores data client-side, and structures learning materials.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6">
        <section>
          <h2 className="font-display text-2xl text-ink">1. Local-First Architecture</h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            QuizFlow operates entirely inside your web browser. When you upload a PDF file or paste study notes, the application uses browser-based parsers to read the raw strings. No files or document texts are stored on the server.
          </p>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Data is persisted client-side using <strong>IndexedDB</strong> via the <code className="bg-raised px-1.5 py-0.5 rounded text-xs">idb</code> wrapper library. Small configuration parameters (such as theme and volume toggles) are stored in <code className="bg-raised px-1.5 py-0.5 rounded text-xs">localStorage</code>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">2. Question Generation Engines</h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            QuizFlow features two generation pathways:
          </p>
          <ul className="list-disc pl-5 text-sm text-ink-secondary flex flex-col gap-1">
            <li><strong>Quick Mode (Deterministic Heuristics)</strong>: Extracts keywords and matches sentences without calling any language models. Fully offline and deterministic.</li>
            <li><strong>AI Mode</strong>: Streams content to a serverless API that connects to high-quality language models via the Vercel AI Gateway. Paraphrases and structures questions with detailed explanations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">3. Keyboard Shortcuts</h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Navigate the Quiz Player instantly using the following hotkeys:
          </p>
          <table className="min-w-full border-collapse border border-line text-left text-xs text-ink-secondary mt-2">
            <thead>
              <tr className="bg-surface-2 border-b border-line">
                <th className="px-4 py-2 font-semibold">Hotkey</th>
                <th className="px-4 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="px-4 py-2 font-mono font-semibold text-ink">1, 2, 3, 4</td>
                <td className="px-4 py-2">Select quiz options (MCQ / True-False)</td>
              </tr>
              <tr className="border-b border-line">
                <td className="px-4 py-2 font-mono font-semibold text-ink">Enter</td>
                <td className="px-4 py-2">Confirm selected answer / Proceed to next question</td>
              </tr>
              <tr className="border-b border-line">
                <td className="px-4 py-2 font-mono font-semibold text-ink">Escape</td>
                <td className="px-4 py-2">Exit the current player session and return to editor</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
