/**
 * AI capability catalog (STANDARDS §10).
 *
 * Pure data/types - NO zod, NO prompts, NO server imports - safe for client.
 * Single source of truth for capability IDs, labels, modes, tiers, and parameters.
 */

export const CAPABILITY_IDS = [
  "quiz",
  "flashcards",
  "summary",
  "explain",
  "weak-topics",
  "regenerate-one",
] as const;

export type CapabilityId = (typeof CAPABILITY_IDS)[number];

export function isCapabilityId(value: string): value is CapabilityId {
  return (CAPABILITY_IDS as readonly string[]).includes(value);
}

export type CapabilityMode = "text" | "object";

export interface CapabilityMeta {
  id: CapabilityId;
  label: string;
  description: string;
  mode: CapabilityMode;
  tier: "fast" | "quality";
}

/** Maximum source text length accepted by AI tools. */
export const MAX_INPUT_CHARS = 40_000;

/** Daily free limit for anonymous AI calls. */
export const DAILY_AI_LIMIT = 40;

export const CAPABILITIES: readonly CapabilityMeta[] = [
  {
    id: "quiz",
    label: "Generate Quiz",
    description: "Generate MCQ, True/False, Fill-in-the-blanks, and Short Answer questions from notes or PDF.",
    mode: "object",
    tier: "quality",
  },
  {
    id: "flashcards",
    label: "Generate Flashcards",
    description: "Generate study flashcards from notes or PDF.",
    mode: "object",
    tier: "fast",
  },
  {
    id: "summary",
    label: "Summarize & Key Concepts",
    description: "Create a summary and extract key concepts from the source material.",
    mode: "object",
    tier: "fast",
  },
  {
    id: "explain",
    label: "Explain or Hint",
    description: "Provide hints or detailed explanations for questions.",
    mode: "object",
    tier: "fast",
  },
  {
    id: "weak-topics",
    label: "Weak Topic Analysis",
    description: "Analyze incorrect answers and history to identify weak concepts and suggest tasks.",
    mode: "object",
    tier: "quality",
  },
  {
    id: "regenerate-one",
    label: "Regenerate Single Question",
    description: "Replace a question with a different one based on context.",
    mode: "object",
    tier: "quality",
  },
];

export function getCapabilityMeta(id: CapabilityId): CapabilityMeta {
  const meta = CAPABILITIES.find((c) => c.id === id);
  if (!meta) {
    throw new Error(`Unknown capability: ${id}`);
  }
  return meta;
}
