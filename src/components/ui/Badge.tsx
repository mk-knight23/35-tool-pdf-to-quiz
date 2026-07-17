import { ZapOff } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "accent" | "highlight" | "neutral" | "success" | "error" | "warning";

const tones: Record<BadgeTone, string> = {
  accent: "bg-accent-tint text-accent",
  highlight: "bg-highlight-tint text-highlight",
  neutral: "bg-surface-2 text-ink-secondary border border-line",
  success: "bg-success-tint text-success",
  error: "bg-error-tint text-error",
  warning: "bg-warning-tint text-warning",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The persistent "Quick mode (no AI)" marker (spec F2). */
export function QuickModeBadge({ className }: { className?: string }) {
  return (
    <Badge tone="highlight" className={className}>
      <ZapOff size={13} strokeWidth={1.75} aria-hidden />
      Quick mode (no AI)
    </Badge>
  );
}
