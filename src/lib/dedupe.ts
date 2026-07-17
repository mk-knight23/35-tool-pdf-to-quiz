import type { Question } from "./types";

function key(prompt: string): string {
  return prompt.toLowerCase().replace(/_+/g, " ").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Return the set of question ids that duplicate an earlier question (same normalised prompt).
 * The first occurrence is kept; later matches are flagged so the editor can prompt a review.
 */
export function findDuplicateIds(questions: Question[]): Set<string> {
  const seen = new Map<string, string>();
  const dupes = new Set<string>();
  for (const q of questions) {
    const k = key(q.prompt);
    if (!k) continue;
    if (seen.has(k)) dupes.add(q.id);
    else seen.set(k, q.id);
  }
  return dupes;
}

export function hasDuplicates(questions: Question[]): boolean {
  return findDuplicateIds(questions).size > 0;
}
