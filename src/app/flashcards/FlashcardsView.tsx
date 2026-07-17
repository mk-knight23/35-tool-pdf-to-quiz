"use client";

import { Layers, Play, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FlashcardPlayer } from "@/components/flashcards/FlashcardPlayer";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { dueCount, isDue, type ReviewGrade, reviewCard } from "@/lib/srs";
import { deleteDeck, listDecks, saveDeck } from "@/lib/storage";
import type { Deck, Flashcard } from "@/lib/types";

export function FlashcardsView() {
  const [decks, setDecks] = useState<Deck[] | null>(null);
  const [studying, setStudying] = useState<{ deck: Deck; cards: Flashcard[] } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Deck | null>(null);

  const load = useCallback(async () => {
    setDecks(await listDecks());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startStudy = (deck: Deck) => {
    const due = deck.cards.filter((c) => isDue(c));
    const cards = due.length > 0 ? due : deck.cards;
    setStudying({ deck, cards });
  };

  const handleGrade = useCallback(
    async (card: Flashcard, grade: ReviewGrade) => {
      if (!studying) return;
      const updated = reviewCard(card, grade);
      const nextDeck: Deck = {
        ...studying.deck,
        cards: studying.deck.cards.map((c) => (c.id === card.id ? updated : c)),
        updatedAt: new Date().toISOString(),
      };
      setStudying({ ...studying, deck: nextDeck });
      await saveDeck(nextDeck);
    },
    [studying],
  );

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await deleteDeck(pendingDelete.id);
    setPendingDelete(null);
    await load();
  }, [load, pendingDelete]);

  if (studying) {
    return (
      <FlashcardPlayer
        title={studying.deck.title}
        cards={studying.cards}
        onGrade={handleGrade}
        onExit={() => {
          setStudying(null);
          void load();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Flashcards</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Decks you have saved, with spaced self-grading. Everything is stored on this device.
          </p>
        </div>
        <Link href="/tool" className={buttonClasses("primary")}>
          <Plus size={16} strokeWidth={1.75} aria-hidden /> New deck
        </Link>
      </div>

      {decks === null ? (
        <p className="py-8 text-sm text-ink-secondary">Loading your decks…</p>
      ) : decks.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No decks yet"
          description="Create your first deck from a PDF or pasted notes. Choose 'A flashcard deck' in the tool."
          action={
            <Link href="/tool" className={buttonClasses("primary")}>
              Create a deck
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {decks.map((deck) => {
            const due = dueCount(deck.cards);
            return (
              <li
                key={deck.id}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface-2 p-5 shadow-paper"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-xl text-ink">{deck.title}</h2>
                  <button
                    type="button"
                    aria-label={`Delete ${deck.title}`}
                    onClick={() => setPendingDelete(deck)}
                    className="inline-flex size-8 items-center justify-center rounded-sm text-ink-secondary transition-colors hover:bg-error-tint hover:text-error"
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="neutral">
                    {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                  </Badge>
                  {due > 0 ? (
                    <Badge tone="highlight">{due} due</Badge>
                  ) : (
                    <Badge tone="success">All reviewed</Badge>
                  )}
                </div>
                <Button variant="accent" size="sm" className="self-start" onClick={() => startStudy(deck)}>
                  <Play size={15} strokeWidth={1.75} aria-hidden /> Study
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this deck?"
        description={`"${pendingDelete?.title ?? ""}" and its review progress will be removed from this device. This can't be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
