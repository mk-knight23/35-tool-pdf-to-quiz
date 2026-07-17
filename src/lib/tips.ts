/** Study tips shown while a quiz or deck is being generated (ported from legacy). */
export const GENERATION_TIPS: readonly string[] = [
  "Teaching someone else is the best way to learn. Try explaining these concepts out loud.",
  "Active recall beats re-reading. Test yourself before you check the answer.",
  "Connect new information to things you already know.",
  "Take breaks. Your brain consolidates memories during rest.",
  "Handwriting your notes improves retention.",
  "The forgetting curve is real. Review this material tomorrow, then again next week.",
  "Focus on understanding, not memorisation.",
  "Explain each concept as if to a curious ten-year-old to test your clarity.",
];

/** Deterministic tip pick based on an index, so tests and reduced-motion views are stable. */
export function tipAt(index: number): string {
  return GENERATION_TIPS[Math.abs(index) % GENERATION_TIPS.length];
}
