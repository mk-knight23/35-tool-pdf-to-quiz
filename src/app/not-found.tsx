import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-tint text-accent">
        <FileQuestion size={26} strokeWidth={1.75} aria-hidden />
      </span>
      <p className="font-mono text-sm text-ink-muted">404</p>
      <h1 className="font-display text-3xl text-ink">This page doesn&apos;t exist</h1>
      <p className="max-w-md text-sm text-ink-secondary">
        The page you&apos;re looking for may have moved or never existed.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className={buttonClasses("primary")}>
          Back home
        </Link>
        <Link href="/tool" className={buttonClasses("secondary")}>
          Create a quiz
        </Link>
      </div>
    </div>
  );
}
