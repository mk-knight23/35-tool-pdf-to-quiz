"use server";

import { generateQuizTitle } from "@/lib/openrouter";

export const generateQuizTitleAction = async (file: string) => {
  try {
    // @ts-ignore
    const apiKey = globalThis.process?.env?.OPENROUTER_API_KEY || "";
    
    if (!apiKey) {
      console.error("OpenRouter API key not configured");
      return "Quiz";
    }
    
    return await generateQuizTitle(apiKey, file);
  } catch (error) {
    console.error("Error generating quiz title:", error);
    return "Quiz";
  }
};
