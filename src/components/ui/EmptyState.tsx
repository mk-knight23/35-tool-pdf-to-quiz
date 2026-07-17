import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Honest empty state: icon + one sentence + optional action. Never fake numbers. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface-2 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent-tint text-accent">
        <Icon size={22} strokeWidth={1.75} aria-hidden />
      </span>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-secondary">{description}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
