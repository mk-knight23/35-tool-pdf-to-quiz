import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-ink-secondary">
      <Loader2 className="animate-spin" size={20} aria-hidden />
      <span className="text-sm">Loading…</span>
    </div>
  );
}
