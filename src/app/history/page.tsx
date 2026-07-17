import type { Metadata } from "next";
import { HistoryView } from "./HistoryView";

export const metadata: Metadata = {
  title: "History",
  description:
    "Browse the quizzes, decks and attempts you have saved on this device, with search and sort.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return <HistoryView />;
}
