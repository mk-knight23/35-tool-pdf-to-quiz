"use client";

import { BookOpen, FileText, History as HistoryIcon, Layers, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { deleteDeck, deleteQuiz, listDecks, listQuizzes, listResults } from "@/lib/storage";
import type { Deck, Quiz, QuizResult } from "@/lib/types";

type Tab = "quizzes" | "decks" | "attempts";
type Sort = "newest" | "oldest" | "title";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "quizzes", label: "Quizzes", icon: FileText },
  { id: "decks", label: "Decks", icon: Layers },
  { id: "attempts", label: "Attempts", icon: BookOpen },
];

interface HistoryData {
  quizzes: Quiz[];
  decks: Deck[];
  results: QuizResult[];
}

type PendingDelete = { kind: "quiz" | "deck"; id: string; title: string } | null;

export function HistoryView() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [tab, setTab] = useState<Tab>("quizzes");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  const load = useCallback(async () => {
    const [quizzes, decks, results] = await Promise.all([
      listQuizzes(),
      listDecks(),
      listResults(),
    ]);
    setData({ quizzes, decks, results });
  }, []);

  useEffect(() => {
    track("history_opened");
    let active = true;
    void (async () => {
      const [quizzes, decks, results] = await Promise.all([
        listQuizzes(),
        listDecks(),
        listResults(),
      ]);
      if (active) setData({ quizzes, decks, results });
    })();
    return () => {
      active = false;
    };
  }, []);

  const applySort = useCallback(
    <T extends { createdAt: string }>(items: T[], titleOf: (item: T) => string): T[] => {
      const sorted = items.slice();
      if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      else if (sort === "oldest") sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      else sorted.sort((a, b) => titleOf(a).localeCompare(titleOf(b)));
      return sorted;
    },
    [sort],
  );

  const filteredQuizzes = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return applySort(
      data.quizzes.filter((quiz) => quiz.title.toLowerCase().includes(q)),
      (quiz) => quiz.title,
    );
  }, [applySort, data, query]);

  const filteredDecks = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return applySort(
      data.decks.filter((deck) => deck.title.toLowerCase().includes(q)),
      (deck) => deck.title,
    );
  }, [applySort, data, query]);

  const filteredResults = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return applySort(
      data.results.filter((result) => result.quizTitle.toLowerCase().includes(q)),
      (result) => result.quizTitle,
    );
  }, [applySort, data, query]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "quiz") await deleteQuiz(pendingDelete.id);
    else await deleteDeck(pendingDelete.id);
    setPendingDelete(null);
    await load();
  }, [load, pendingDelete]);

  const totalEmpty =
    data !== null && data.quizzes.length === 0 && data.decks.length === 0 && data.results.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-ink">History</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Everything you have saved on this device. Nothing here is synced anywhere.
        </p>
      </div>

      {data === null ? (
        <p className="py-8 text-sm text-ink-secondary">Loading your history…</p>
      ) : totalEmpty ? (
        <EmptyState
          icon={HistoryIcon}
          title="Nothing here yet"
          description="Quizzes and decks you save, and quizzes you play, will be listed here."
          action={
            <Link href="/tool" className={buttonClasses("primary")}>
              Create your first
            </Link>
          }
        />
      ) : (
        <>
          <div role="tablist" aria-label="History type" className="flex gap-1 rounded-xl border border-white/20 dark:border-white/5 bg-white/15 dark:bg-slate-900/20 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent",
                  tab === t.id 
                    ? "bg-white/20 dark:bg-white/10 text-ink shadow-sm border-white/25 dark:border-white/10" 
                    : "text-ink-secondary hover:text-ink hover:bg-white/5",
                )}
              >
                <t.icon size={15} strokeWidth={2} className={tab === t.id ? "text-accent" : "text-ink-muted"} aria-hidden />
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                aria-label="Search history"
                className="w-full rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-secondary">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 py-2.5 text-sm text-ink outline-none focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title A–Z</option>
              </select>
            </label>
          </div>

          {tab === "quizzes" ? (
            <ItemList
              empty="No quizzes match."
              items={filteredQuizzes.map((quiz) => ({
                id: quiz.id,
                title: quiz.title,
                meta: `${quiz.questions.length} questions · ${new Date(quiz.createdAt).toLocaleDateString()}`,
                badge: quiz.mode === "quick" ? "Quick mode" : "AI-assisted",
                href: `/tool?quiz=${quiz.id}`,
                onDelete: () => setPendingDelete({ kind: "quiz", id: quiz.id, title: quiz.title }),
              }))}
            />
          ) : null}

          {tab === "decks" ? (
            <ItemList
              empty="No decks match."
              items={filteredDecks.map((deck) => ({
                id: deck.id,
                title: deck.title,
                meta: `${deck.cards.length} cards · ${new Date(deck.createdAt).toLocaleDateString()}`,
                badge: deck.mode === "quick" ? "Quick mode" : "AI-assisted",
                href: `/flashcards`,
                onDelete: () => setPendingDelete({ kind: "deck", id: deck.id, title: deck.title }),
              }))}
            />
          ) : null}

          {tab === "attempts" ? (
            <ItemList
              empty="No attempts match."
              items={filteredResults.map((result) => {
                const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
                return {
                  id: result.id,
                  title: result.quizTitle,
                  meta: `${result.correct}/${result.total} correct · ${pct}% · ${new Date(result.createdAt).toLocaleString()}`,
                  badge: null,
                  href: `/tool?quiz=${result.quizId}`,
                };
              })}
            />
          ) : null}
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete this ${pendingDelete?.kind ?? "item"}?`}
        description={`"${pendingDelete?.title ?? ""}" will be removed from this device. This can't be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

interface ListItem {
  id: string;
  title: string;
  meta: string;
  badge: string | null;
  href: string;
  onDelete?: () => void;
}

function ItemList({ items, empty }: { items: ListItem[]; empty: string }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 p-8 text-center text-sm text-ink-secondary">
        {empty}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 backdrop-blur-md p-4 shadow-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/45 dark:hover:bg-slate-900/50"
        >
          <Link href={item.href} className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate font-semibold text-ink">{item.title}</span>
              {item.badge ? <Badge tone="highlight">{item.badge}</Badge> : null}
            </span>
            <span className="mt-1 block text-xs text-ink-muted">{item.meta}</span>
          </Link>
          {item.onDelete ? (
            <button
              type="button"
              aria-label={`Delete ${item.title}`}
              onClick={item.onDelete}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-ink-secondary transition-all hover:bg-error-tint hover:text-error"
            >
              <Trash2 size={15} aria-hidden />
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
