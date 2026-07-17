"use client";

import { useEffect } from "react";
import { Button, type ButtonVariant } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Accessible confirm dialog: scrim + Esc close, focus trap on confirm, returns focus. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <button
        className="qf-scrim absolute inset-0 cursor-default"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-lg border border-line bg-raised p-6 shadow-[var(--shadow-overlay)]">
        <h2 id="confirm-title" className="font-display text-xl text-ink">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-2 text-sm text-ink-secondary">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          {/* autoFocus is intentional here: focus the primary action when the modal opens */}
          <Button autoFocus variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
