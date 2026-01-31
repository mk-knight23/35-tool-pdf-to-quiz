import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quiz, QuizSettings } from '@/types/quiz'

interface QuizStore {
  quizzes: Quiz[]
  settings: QuizSettings

  // Actions
  addQuiz: (quiz: Quiz) => void
  removeQuiz: (id: string) => void
  updateSettings: (settings: Partial<QuizSettings>) => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      quizzes: [],
      settings: {
        apiKey: '',
        model: 'minimax/minimax-m2:free',
        numQuestions: 5,
        difficulty: 'medium',
      },

      addQuiz: (quiz) => set((state) => ({ quizzes: [quiz, ...state.quizzes] })),
      removeQuiz: (id) => set((state) => ({ quizzes: state.quizzes.filter((q) => q.id !== id) })),
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: 'quizflow-storage',
    }
  )
)
