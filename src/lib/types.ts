import { z } from "zod";

/** Bump when the persisted/exported shape changes in a breaking way. */
export const SCHEMA_VERSION = 1;

export const questionTypeSchema = z.enum(["mcq", "tf", "short", "fill"]);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const genModeSchema = z.enum(["quick", "ai"]);
export type GenMode = z.infer<typeof genModeSchema>;

export const difficultySchema = z.enum(["easy", "medium", "hard", "mixed"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const audienceSchema = z.enum(["school", "university", "professional"]);
export type Audience = z.infer<typeof audienceSchema>;

/**
 * A single question.
 * - mcq/tf: `options` populated, `correctIndex` is the 0-based index, `acceptableAnswers` empty.
 * - short/fill: `options` empty, `correctIndex` is -1, `acceptableAnswers` holds accepted responses.
 *   For fill-blank the `prompt` contains the blank marker `_____`.
 */
export const questionSchema = z.object({
  id: z.string().min(1),
  type: questionTypeSchema,
  prompt: z.string().min(1),
  options: z.array(z.string()).default([]),
  correctIndex: z.number().int().default(-1),
  acceptableAnswers: z.array(z.string()).default([]),
  explanation: z.string().default(""),
  source: genModeSchema.default("quick"),
});
export type Question = z.infer<typeof questionSchema>;

export const quizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  questions: z.array(questionSchema).min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  sourceName: z.string().default("Untitled source"),
  mode: genModeSchema.default("quick"),
  timed: z.boolean().default(false),
  timeLimitSec: z.number().int().positive().nullable().default(null),
  schemaVersion: z.number().int().default(SCHEMA_VERSION),
});
export type Quiz = z.infer<typeof quizSchema>;

export const flashcardSchema = z.object({
  id: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
  source: genModeSchema.default("quick"),
  due: z.string(),
  intervalDays: z.number().default(0),
  ease: z.number().default(2.5),
  reps: z.number().int().default(0),
  lapses: z.number().int().default(0),
});
export type Flashcard = z.infer<typeof flashcardSchema>;

export const deckSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  cards: z.array(flashcardSchema).min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  sourceName: z.string().default("Untitled source"),
  mode: genModeSchema.default("quick"),
  schemaVersion: z.number().int().default(SCHEMA_VERSION),
});
export type Deck = z.infer<typeof deckSchema>;

export const quizResultItemSchema = z.object({
  questionId: z.string(),
  type: questionTypeSchema,
  correct: z.boolean(),
});
export type QuizResultItem = z.infer<typeof quizResultItemSchema>;

export const quizResultSchema = z.object({
  id: z.string().min(1),
  quizId: z.string(),
  quizTitle: z.string(),
  createdAt: z.string(),
  durationSec: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  items: z.array(quizResultItemSchema),
  mode: genModeSchema.default("quick"),
});
export type QuizResult = z.infer<typeof quizResultSchema>;

/** Full data export envelope (settings + all local records). */
export const exportEnvelopeSchema = z.object({
  app: z.literal("mk-quizflow").default("mk-quizflow"),
  schemaVersion: z.number().int().default(SCHEMA_VERSION),
  exportedAt: z.string(),
  quizzes: z.array(quizSchema).default([]),
  decks: z.array(deckSchema).default([]),
  results: z.array(quizResultSchema).default([]),
});
export type ExportEnvelope = z.infer<typeof exportEnvelopeSchema>;

/** Human-friendly labels used across the UI. */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "Multiple choice",
  tf: "True / false",
  short: "Short answer",
  fill: "Fill in the blank",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  mixed: "Mixed",
};
