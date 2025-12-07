import { questionsSchema } from "@/lib/schemas";
import { createQuiz } from "@/lib/openrouter";
import { QuizGenerationRequest, QuizGenerationResponse } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body: QuizGenerationRequest = await req.json();
    const { files, customization } = body;
    
    if (!files || files.length === 0) {
      return Response.json({
        success: false,
        error: "No files provided"
      } as QuizGenerationResponse, { status: 400 });
    }
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return Response.json({
        success: false,
        error: "API key not configured"
      } as QuizGenerationResponse, { status: 500 });
    }
    
    const numQuestions = customization?.numQuestions || 4;
    const model = customization?.model || "minimax/minimax-m2:free";
    
    const questions = await createQuiz(apiKey, model, numQuestions, files[0].data);
    const validatedQuestions = questionsSchema.parse(questions);
    
    return Response.json({
      success: true,
      questions: validatedQuestions
    } as QuizGenerationResponse);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    } as QuizGenerationResponse, { status: 500 });
  }
}
