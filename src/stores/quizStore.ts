import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quiz, QuizSettings } from '@/types/quiz'

interface QuizStore {
  quizzes: Quiz[]
  quizSettings: QuizSettings
  previewQuiz: Quiz | null

  // Actions
  addQuiz: (quiz: Quiz) => void
  removeQuiz: (id: string) => void
  updateSettings: (settings: Partial<QuizSettings>) => void
  setPreviewQuiz: (quiz: Quiz | null) => void
  confirmPreviewQuiz: () => void
  importQuizzes: (quizzes: Quiz[], replace?: boolean) => void
  clearAllQuizzes: () => void
  replaceQuizzes: (quizzes: Quiz[]) => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quizzes: [],
      quizSettings: {
        apiKey: '',
        model: 'minimax/minimax-m2:free',
        numQuestions: 5,
        difficulty: 'medium',
      },
      previewQuiz: null,

      addQuiz: (quiz) => set((state) => ({ quizzes: [quiz, ...state.quizzes] })),
      removeQuiz: (id) => set((state) => ({ quizzes: state.quizzes.filter((q) => q.id !== id) })),
      updateSettings: (newSettings) => set((state) => ({ quizSettings: { ...state.quizSettings, ...newSettings } })),
      setPreviewQuiz: (quiz) => set({ previewQuiz: quiz }),
      confirmPreviewQuiz: () => {
        const { previewQuiz } = get()
        if (previewQuiz) {
          set((state) => ({
            quizzes: [previewQuiz, ...state.quizzes],
            previewQuiz: null,
          }))
        }
      },
      importQuizzes: (newQuizzes, replace = false) => set((state) => {
        if (replace) {
          return { quizzes: newQuizzes }
        }
        // Merge without duplicates
        const existingIds = new Set(state.quizzes.map(q => q.id))
        const filteredQuizzes = newQuizzes.filter(q => !existingIds.has(q.id))
        return { quizzes: [...filteredQuizzes, ...state.quizzes] }
      }),
      clearAllQuizzes: () => set({ quizzes: [] }),
      replaceQuizzes: (newQuizzes) => set({ quizzes: newQuizzes }),
    }),
    {
      name: 'quizflow-storage',
    }
  )
)
