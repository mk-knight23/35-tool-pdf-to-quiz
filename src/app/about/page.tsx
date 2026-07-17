import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the mission, active recall engineering, and local-first architecture behind MK QuizFlow.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Our Mission</p>
        <h1 className="font-display text-4xl text-ink mt-2">About QuizFlow</h1>
        <p className="text-ink-secondary mt-2 text-base">
          A local-first, privacy-respecting study tool designed to turn static study resources into active learning modules.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <p>
          QuizFlow was created by **Kazi Musharraf** with a simple objective: to replace ineffective, passive study habits (like highlights and repetitive readings) with high-intensity **Active Recall** and **Spaced Repetition** systems.
        </p>
        
        <h2 className="font-display text-xl text-ink mt-4">Privacy by Design</h2>
        <p>
          Unlike modern tools that require uploading your notes and PDFs to a cloud database, QuizFlow processes everything on your device. The deterministic Quick Mode runs entirely inside your browser tab without any network queries. 
        </p>
        <p>
          When you enable AI Mode, text blocks are streamed securely to API models and are immediately discarded. No text content, file metadata, or generated questions are saved server-side.
        </p>

        <h2 className="font-display text-xl text-ink mt-4">Open Source Philosophy</h2>
        <p>
          We believe educational tools should be transparent, accessible, and free of corporate locking. QuizFlow is fully open-source under the MIT license. You can export your data anytime as a standardized JSON envelope, ensuring you are always in complete control of your academic assets.
        </p>
      </div>
    </div>
  );
}
