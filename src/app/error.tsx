"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the browser console for debugging; no remote logging.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-error-tint text-error">
        <AlertTriangle size={26} strokeWidth={1.75} aria-hidden />
      </span>
      <h1 className="font-display text-2xl text-ink">Something went wrong</h1>
      <p className="max-w-md text-sm text-ink-secondary">
        An unexpected error interrupted this page. Your saved quizzes and decks are stored locally
        and are not affected.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
