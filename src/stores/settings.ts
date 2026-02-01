import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'light' | 'system'

interface SettingsState {
  soundEnabled: boolean
  theme: ThemeMode
  showHelp: boolean
  isDarkMode: boolean

  toggleSound: () => void
  setTheme: (theme: ThemeMode) => void
  applyTheme: () => void
  toggleHelp: () => void
  toggleDarkMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      theme: 'dark',
      showHelp: false,
      isDarkMode: true,

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setTheme: (theme) => {
        set({ theme })
        get().applyTheme()
      },
      applyTheme: () => {
        const { theme } = get()
        const isDark =
          theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        set({ isDarkMode: isDark })

        if (isDark) {
          document.documentElement.classList.add('dark')
          document.documentElement.classList.remove('light')
        } else {
          document.documentElement.classList.add('light')
          document.documentElement.classList.remove('dark')
        }
      },
      toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),
      toggleDarkMode: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme, isDarkMode: newTheme === 'dark' })
        get().applyTheme()
      },
    }),
    {
      name: 'quizflow-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
