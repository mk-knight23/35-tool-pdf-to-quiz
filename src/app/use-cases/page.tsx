import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { USE_CASES } from "@/lib/use-cases";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "Learn how different learners, educators, and professionals use MK QuizFlow to optimize study recall.",
  alternates: { canonical: "/use-cases" },
};

export default function UseCasesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Personalization</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Use Cases</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-secondary">
          Explore how to optimize your study material based on your specific learning objectives.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(USE_CASES).map((item) => (
          <div
            key={item.slug}
            className="flex flex-col justify-between gap-4 rounded-lg border border-line bg-surface-2 p-6 shadow-paper"
          >
            <div className="flex flex-col gap-2">
              <span className="text-3xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
                Audience: {item.audience}
              </span>
              <h2 className="font-display text-xl text-ink">{item.title}</h2>
              <p className="text-sm text-ink-secondary leading-relaxed">{item.description}</p>
            </div>
            <Link
              href={`/use-cases/${item.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-strong self-start"
            >
              Read strategy <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
