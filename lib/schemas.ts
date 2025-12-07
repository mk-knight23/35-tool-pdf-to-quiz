import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.enum(["A", "B", "C", "D"]),
});

export const questionsSchema = z.array(questionSchema);

export type Question = z.infer<typeof questionSchema>;
