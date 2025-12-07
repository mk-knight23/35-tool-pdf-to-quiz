import * as pdfjsLib from "pdfjs-dist";
import { Question } from "./types";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{ message: { content: string } }>;
}

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "minimax/minimax-m2:free";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://quizforge-ai.vercel.app";

if (typeof window !== "undefined") {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;
}

async function extractTextFromPDF(pdfData: string): Promise<string> {
  const base64Data = pdfData.includes(",") ? pdfData.split(",")[1] : pdfData;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const pdf = await (pdfjsLib as any).getDocument({ data: bytes }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n\n";
  }

  return text.trim();
}

function getFallbackQuiz(numQuestions: number): Question[] {
  const base: Question[] = [
    {
      question: "What is machine learning?",
      options: [
        "Explicit programming for every scenario",
        "Learning from data without explicit programming",
        "A type of database",
        "A programming language",
      ],
      answer: "B",
    },
    {
      question: "Which learning type uses labeled data?",
      options: ["Unsupervised", "Reinforcement", "Supervised", "Deep"],
      answer: "C",
    },
    {
      question: "What inspires neural networks?",
      options: ["Processors", "Biological neurons", "Databases", "Algorithms"],
      answer: "B",
    },
    {
      question: "What is deep learning?",
      options: [
        "Underwater learning",
        "Multi-layer neural networks",
        "A database type",
        "A programming style",
      ],
      answer: "B",
    },
  ];
  return base.slice(0, numQuestions);
}

async function callOpenRouter(
  apiKey: string,
  messages: OpenRouterMessage[]
): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": "QuizForge AI",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 4000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data: OpenRouterResponse = await response.json();
  return data.choices[0].message.content;
}

export async function createQuiz(
  apiKey: string,
  model: string,
  numQuestions: number,
  pdfData: string
): Promise<Question[]> {
  try {
    const text = await extractTextFromPDF(pdfData);

    if (!text || text.length < 100) {
      return getFallbackQuiz(numQuestions);
    }

    const content = await callOpenRouter(apiKey, [
      {
        role: "system",
        content: `Generate ${numQuestions} multiple-choice questions. Return ONLY valid JSON: [{"question":"...","options":["A","B","C","D"],"answer":"A"}]`,
      },
      {
        role: "user",
        content: `Create ${numQuestions} questions from:\n\n${text.substring(0, 3000)}`,
      },
    ]);

    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : getFallbackQuiz(numQuestions);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return getFallbackQuiz(numQuestions);
  }
}

export async function generateQuizTitle(apiKey: string, fileName: string): Promise<string> {
  const clean = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

  if (clean.length < 3) return "Quiz";

  try {
    const content = await callOpenRouter(apiKey, [
      {
        role: "system",
        content: "Generate a short quiz title from the filename. Respond with only the title.",
      },
      { role: "user", content: `Filename: ${fileName}` },
    ]);
    return content.trim();
  } catch {
    return clean
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
}
