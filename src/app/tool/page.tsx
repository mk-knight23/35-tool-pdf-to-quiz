import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolWorkspace } from "./ToolWorkspace";

export const metadata: Metadata = {
  title: "Create a quiz",
  description:
    "Upload a PDF or paste notes, then generate a quiz or flashcard deck in your browser with deterministic Quick mode — no AI key required.",
  alternates: { canonical: "/tool" },
};

export default function ToolPage() {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<p className="py-12 text-sm text-ink-secondary">Loading the workspace…</p>}>
        <ToolWorkspace />
      </Suspense>
    </div>
  );
}
