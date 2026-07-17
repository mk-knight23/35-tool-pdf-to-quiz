"use client";

import { BarChart3, BookOpen, CheckCircle2, Clock, FileText, Layers, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { deriveStats, type DerivedStats, formatDuration, formatPercent } from "@/lib/stats";
import { listDecks, listQuizzes, listResults } from "@/lib/storage";
import type { QuizResult } from "@/lib/types";

interface DashboardData {
  stats: DerivedStats;
  recent: QuizResult[];
  isEmpty: boolean;
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [quizzes, decks, results] = await Promise.all([
        listQuizzes(),
        listDecks(),
        listResults(),
      ]);
      if (!active) return;
      setData({
        stats: deriveStats({ quizzes, decks, results }),
        recent: results.slice(0, 6),
        isEmpty: quizzes.length === 0 && decks.length === 0 && results.length === 0,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Your study activity, calculated from data stored on this device only.
        </p>
      </div>

      {data === null ? (
        <p className="py-8 text-sm text-ink-secondary">Loading your stats…</p>
      ) : data.isEmpty ? (
        <EmptyState
          icon={BarChart3}
          title="No activity yet"
          description="Create and play your first quiz, and your real stats will show up here. Nothing is counted until you actually study."
          action={
            <Link href="/tool" className={buttonClasses("primary")}>
              Create a quiz
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              icon={FileText}
              label="Quizzes created"
              value={String(data.stats.quizzesCreated)}
            />
            <StatTile icon={Layers} label="Decks created" value={String(data.stats.decksCreated)} />
            <StatTile
              icon={BookOpen}
              label="Quizzes taken"
              value={String(data.stats.quizzesTaken)}
            />
            <StatTile
              icon={CheckCircle2}
              label="Questions answered"
              value={String(data.stats.questionsAnswered)}
            />
            <StatTile
              icon={Target}
              label="Accuracy"
              value={formatPercent(data.stats.accuracy)}
            />
            <StatTile
              icon={Clock}
              label="Time studied"
              value={formatDuration(data.stats.timeStudiedSec)}
            />
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Recent attempts</h2>
              <Link href="/history" className="text-sm text-accent hover:underline">
                View all history
              </Link>
            </div>
            {data.recent.length === 0 ? (
              <p className="text-sm text-ink-secondary">
                No quiz attempts recorded yet. Play a quiz to see it here.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-line rounded-md border border-line bg-surface-2">
                {data.recent.map((result) => {
                  const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
                  return (
                    <li key={result.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{result.quizTitle}</p>
                        <p className="text-xs text-ink-muted">
                          {new Date(result.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-sm tabular-nums text-ink-secondary">
                        {result.correct}/{result.total} · {pct}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-line bg-surface-2 p-5 shadow-paper">
      <span className="flex size-9 items-center justify-center rounded-md bg-accent-tint text-accent">
        <Icon size={18} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="font-display text-4xl tabular-nums text-ink">{value}</span>
      <span className="text-sm text-ink-secondary">{label}</span>
    </div>
  );
}
