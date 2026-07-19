import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSharedQuiz } from "@/lib/cloud";
import { SharedQuizView } from "./SharedQuizView";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const quiz = await fetchSharedQuiz(code);
  if (!quiz) return { title: "Quiz not found — MK QuizFlow", robots: { index: false } };
  const title = `${quiz.title} — MK QuizFlow`;
  const description = `Take this ${quiz.questions.length}-question quiz free on MK QuizFlow. No sign-up.`;
  return {
    title,
    description,
    robots: { index: false }, // user-shared content is not indexed
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function SharedQuizPage({ params }: PageProps) {
  const { code } = await params;
  const quiz = await fetchSharedQuiz(code);
  if (!quiz) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <SharedQuizView quiz={quiz} />
    </main>
  );
}
