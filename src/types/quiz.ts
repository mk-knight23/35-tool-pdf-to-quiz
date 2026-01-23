export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  createdAt: string
  pdfName: string
}

export interface QuizSettings {
  apiKey: string
  model: string
  numQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
}
