export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export type QuizGenerationRequest = {
  files: Array<{ data: string; name: string }>;
  customization?: {
    numQuestions?: number;
    model?: string;
  };
};

export type QuizGenerationResponse = {
  success: boolean;
  questions?: Question[];
  error?: string;
};
