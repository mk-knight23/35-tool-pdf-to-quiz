import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StatsState {
  totalQuizzesCreated: number
  totalQuestionsGenerated: number
  totalTimeSpent: number
  lastSessionDate: string | null

  recordQuizCreated: () => void
  addQuestions: (count: number) => void
  addTimeSpent: (seconds: number) => void
  resetStats: () => void
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      totalQuizzesCreated: 0,
      totalQuestionsGenerated: 0,
      totalTimeSpent: 0,
      lastSessionDate: null,

      recordQuizCreated: () => set((state) => ({
        totalQuizzesCreated: state.totalQuizzesCreated + 1,
        lastSessionDate: new Date().toISOString()
      })),
      addQuestions: (count) => set((state) => ({
        totalQuestionsGenerated: state.totalQuestionsGenerated + count
      })),
      addTimeSpent: (seconds) => set((state) => ({
        totalTimeSpent: state.totalTimeSpent + seconds
      })),
      resetStats: () => set({
        totalQuizzesCreated: 0,
        totalQuestionsGenerated: 0,
        totalTimeSpent: 0,
        lastSessionDate: null,
      }),
    }),
    {
      name: 'quizflow-stats',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
