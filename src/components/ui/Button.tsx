import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-[120ms] ease-(--ease-enter) disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98] select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "qf-btn-primary shadow-paper",
  secondary:
    "bg-surface-2 text-ink border border-line-strong hover:border-ink hover:bg-raised",
  accent: "bg-accent-strong text-on-accent hover:opacity-90",
  ghost: "bg-transparent text-ink-secondary hover:bg-surface-2 hover:text-ink",
  destructive: "bg-error text-white hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 min-h-9",
  md: "text-sm px-4 py-2.5 min-h-11",
  lg: "text-base px-6 py-3 min-h-12",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="animate-spin" size={16} aria-hidden /> : null}
      {children}
    </button>
  );
}
