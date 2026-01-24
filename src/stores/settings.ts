import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'light' | 'system'

interface SettingsState {
  soundEnabled: boolean
  theme: ThemeMode
  showHelp: boolean
  reducedMotion: boolean
  autoSave: boolean
  highQualityExport: boolean
  isDarkMode: boolean

  toggleSound: () => void
  setTheme: (theme: ThemeMode) => void
  applyTheme: () => void
  toggleHelp: () => void
  toggleDarkMode: () => void
  setReducedMotion: (value: boolean) => void
  setAutoSave: (value: boolean) => void
  setHighQualityExport: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      theme: 'dark',
      showHelp: false,
      reducedMotion: false,
      autoSave: true,
      highQualityExport: false,
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
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setAutoSave: (value) => set({ autoSave: value }),
      setHighQualityExport: (value) => set({ highQualityExport: value }),
    }),
    {
      name: 'quizflow-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
