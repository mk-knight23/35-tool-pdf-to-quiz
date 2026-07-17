"use client";

import { BarChart3, BookOpen, CheckCircle2, Clock, FileText, Layers, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              icon={FileText}
              label="Quizzes created"
              value={String(data.stats.quizzesCreated)}
              color="indigo"
            />
            <StatTile 
              icon={Layers} 
              label="Decks created" 
              value={String(data.stats.decksCreated)} 
              color="purple"
            />
            <StatTile
              icon={BookOpen}
              label="Quizzes taken"
              value={String(data.stats.quizzesTaken)}
              color="sky"
            />
            <StatTile
              icon={CheckCircle2}
              label="Questions answered"
              value={String(data.stats.questionsAnswered)}
              color="emerald"
            />
            <StatTile
              icon={Target}
              label="Average accuracy"
              value={formatPercent(data.stats.accuracy)}
              color="amber"
            />
            <StatTile
              icon={Clock}
              label="Time studied"
              value={formatDuration(data.stats.timeStudiedSec)}
              color="rose"
            />
          </div>

          <section className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Recent attempts</h2>
              <Link href="/history" className="text-sm font-semibold text-accent hover:underline">
                View all history
              </Link>
            </div>
            {data.recent.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-900/10 p-6 text-center text-sm text-ink-secondary">
                No quiz attempts recorded yet. Play a quiz to see it here.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {data.recent.map((result) => {
                  const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
                  const isHigh = pct >= 80;
                  const isLow = pct < 50;
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md px-5 py-4 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-900/40 hover:-translate-y-0.5 shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink text-sm sm:text-base">{result.quizTitle}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {new Date(result.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-sm tabular-nums text-ink-secondary hidden sm:inline">
                          {result.correct}/{result.total}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold font-mono",
                            isHigh
                              ? "bg-success-tint text-success border border-success/20"
                              : isLow
                              ? "bg-error-tint text-error border border-error/20"
                              : "bg-warning-tint text-warning border border-warning/20"
                          )}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
  color,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  color: "indigo" | "purple" | "sky" | "emerald" | "amber" | "rose";
}) {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    sky: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 backdrop-blur-md p-5 shadow-paper transition-all duration-200 hover:-translate-y-1 hover:shadow-lifted hover:bg-white/45 dark:hover:bg-slate-900/50">
      <span className={cn("flex size-10 items-center justify-center rounded-xl border", colorMap[color])}>
        <Icon size={20} strokeWidth={2} aria-hidden />
      </span>
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="font-sans text-3xl font-bold tracking-tight tabular-nums text-ink">{value}</span>
        <span className="text-xs font-medium text-ink-secondary">{label}</span>
      </div>
    </div>
  );
}
