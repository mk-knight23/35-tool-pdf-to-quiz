import type { Metadata } from "next";
import { FlashcardsView } from "./FlashcardsView";

export const metadata: Metadata = {
  title: "Flashcards",
  description:
    "Study your saved flashcard decks with spaced self-grading. Decks are stored locally in your browser.",
  alternates: { canonical: "/flashcards" },
};

export default function FlashcardsPage() {
  return <FlashcardsView />;
}
