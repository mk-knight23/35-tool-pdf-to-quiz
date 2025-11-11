import { questionSchema, questionsSchema } from "@/lib/schemas";
import { createQuiz } from "@/lib/openrouter";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { files, customization } = await req.json();
    
    console.log("Received request for quiz generation");
    console.log("Files:", files.length);
    console.log("Customization:", customization);
    
    // Get API key from environment
    // @ts-ignore
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    console.log("API key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("OpenRouter API key not configured");
      return new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Use the number of questions from customization, default to 4
    const numQuestions = customization?.numQuestions || 4;
    
    // Use the model from customization or default to a free model
    const model = customization?.model || "minimax/minimax-m2:free";
    
    console.log("Using model:", model);
    console.log("Number of questions:", numQuestions);
    
    // Get the PDF data from the first file
    const pdfData = files[0]?.data;
    
    // Generate quiz using our OpenRouter client
    const questions = await createQuiz(apiKey, model, numQuestions, pdfData);
    
    console.log("Quiz generated successfully");
    console.log("Questions:", questions);
    
    // Validate the questions against our schema
    const validatedQuestions = questionsSchema.parse(questions);
    
    console.log("Validation successful");
    
    // Return the questions in the expected format for the client
    return Response.json({
      success: true,
      questions: validatedQuestions
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return Response.json({
      error: "Error generating quiz: " + (error instanceof Error ? error.message : "Unknown error")
    }, {
      status: 500
    });
  }
}
