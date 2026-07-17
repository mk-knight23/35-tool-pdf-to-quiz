import type { Question } from "./types";
import { normalizeAnswer } from "./text";

/** MCQ/TF answers are the selected option index; short/fill are free text; null = unanswered. */
export type AnswerValue = number | string | null;

/** Grade a single answer. Free-text uses tolerant normalised matching (no AI grading in v1). */
export function isCorrect(question: Question, answer: AnswerValue): boolean {
  if (answer === null || answer === undefined) return false;
  if (question.type === "mcq" || question.type === "tf") {
    return typeof answer === "number" && answer === question.correctIndex;
  }
  if (typeof answer !== "string") return false;
  const normalized = normalizeAnswer(answer);
  if (!normalized) return false;
  return question.acceptableAnswers.some((a) => normalizeAnswer(a) === normalized);
}

export interface ScoreSummary {
  total: number;
  correct: number;
  incorrectIds: string[];
  accuracy: number; // 0..1
}

export function scoreQuiz(
  questions: Question[],
  answers: Record<string, AnswerValue>,
): ScoreSummary {
  let correct = 0;
  const incorrectIds: string[] = [];
  for (const q of questions) {
    if (isCorrect(q, answers[q.id] ?? null)) correct++;
    else incorrectIds.push(q.id);
  }
  const total = questions.length;
  return { total, correct, incorrectIds, accuracy: total === 0 ? 0 : correct / total };
}
