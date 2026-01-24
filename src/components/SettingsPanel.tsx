import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '@/stores/settings'
import { useStatsStore } from '@/stores/stats'
import { useAudio } from '@/hooks/useAudio'
import { KEYBOARD_SHORTCUTS } from '@/utils/constants'
import {
  Settings,
  Volume2,
  Moon,
  Sun,
  Monitor,
  RotateCcw,
  X,
  Keyboard,
  Brain,
} from 'lucide-react'

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const settings = useSettingsStore()
  const stats = useStatsStore()
  const { playClick } = useAudio()

  const themeOptions = [
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  useEffect(() => {
    if (settings.showHelp) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [settings.showHelp])

  const close = () => {
    playClick()
    onClose()
  }

  return (
    <AnimatePresence>
      {settings.showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <Settings className="text-quiz-primary" size={24} />
                <h2 id="settings-title" className="text-xl font-bold">Settings</h2>
              </div>
              <button
                onClick={close}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
            </header>

            <div className="p-6 space-y-8">
              <section aria-labelledby="audio-section">
                <h3 className="flex items-center space-x-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Volume2 size={16} />
                  <span>Audio</span>
                </h3>
                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <span className="font-medium">Sound Effects</span>
                  <button
                    onClick={() => { playClick(); settings.toggleSound() }}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-quiz-primary' : 'bg-slate-600'
                    }`}
                    role="switch"
                    aria-checked={settings.soundEnabled}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.soundEnabled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </section>

              <section aria-labelledby="theme-section">
                <h3 className="flex items-center space-x-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Sun size={16} />
                  <span>Theme</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { playClick(); settings.setTheme(option.value) }}
                      className={`flex flex-col items-center p-4 rounded-xl transition-all border-2 ${
                        settings.theme === option.value
                          ? 'border-quiz-primary bg-quiz-primary/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <option.icon
                        size={20}
                        className={`mb-2 ${
                          settings.theme === option.value ? 'text-quiz-primary' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          settings.theme === option.value ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section aria-labelledby="stats-section">
                <h3 className="flex items-center space-x-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Brain size={16} />
                  <span>Statistics</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalQuizzesCreated}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Quizzes Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-quiz-primary">{stats.totalQuestionsGenerated}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Time Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-quiz-secondary">
                      {stats.lastSessionDate ? new Date(stats.lastSessionDate).toLocaleDateString() : 'Never'}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Last Session</div>
                  </div>
                </div>
                <button
                  onClick={() => { playClick(); stats.resetStats() }}
                  className="mt-4 w-full flex items-center justify-center space-x-2 p-3 text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <RotateCcw size={16} />
                  <span className="text-sm font-medium">Reset Statistics</span>
                </button>
              </section>

              <section aria-labelledby="help-section">
                <h3 className="flex items-center space-x-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Keyboard size={16} />
                  <span>Keyboard Shortcuts</span>
                </h3>
                <div className="space-y-2">
                  {KEYBOARD_SHORTCUTS.map((shortcut) => (
                    <div
                      key={shortcut.action}
                      className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400">{shortcut.action}</span>
                      <kbd className="px-3 py-1 text-xs font-mono bg-slate-200 dark:bg-slate-700 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="p-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500">QuizFlow v1.0.0 - Built with React + Vite</p>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
