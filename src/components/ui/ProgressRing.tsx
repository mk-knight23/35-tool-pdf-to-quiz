interface ProgressRingProps {
  value: number; // 0..1
  size?: number;
  label: string; // accessible description, e.g. "Score 8 of 10"
  center?: string; // visible center text
}

/** Thin accent progress/score ring with a text equivalent (DESIGN_SYSTEM §8). */
export function ProgressRing({ value, size = 96, label, center }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  return (
    <div
      role="img"
      aria-label={label}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {center ? (
        <span className="absolute font-mono text-xl font-semibold tabular-nums text-ink">
          {center}
        </span>
      ) : null}
    </div>
  );
}
