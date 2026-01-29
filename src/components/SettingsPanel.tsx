import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '@/stores/settings'
import { useStatsStore } from '@/stores/stats'
import { useAudio } from '@/hooks/useAudio'
import {
  Settings,
  Volume2,
  Moon,
  Sun,
  Monitor,
  RotateCcw,
  X,
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <Settings size={20} strokeWidth={1.5} className="text-[var(--text-primary)]" />
                <h2 id="settings-title" className="font-display text-lg font-semibold">Settings</h2>
              </div>
              <button
                onClick={close}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-[var(--radius-sm)] transition-all focus-ring"
                aria-label="Close settings"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </header>

            {/* Content */}
            <div className="p-6 space-y-8 editorial-scrollbar">
              {/* Audio Section */}
              <section aria-labelledby="audio-section">
                <h3 className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                  <Volume2 size={14} strokeWidth={1.5} />
                  <span id="audio-section">Audio</span>
                </h3>
                <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
                  <span className="font-medium text-[var(--text-primary)]">Sound Effects</span>
                  <button
                    onClick={() => { playClick(); settings.toggleSound() }}
                    className={`relative w-12 h-6 rounded-full transition-colors border ${
                      settings.soundEnabled
                        ? 'bg-[var(--color-ink)] border-[var(--color-ink)]'
                        : 'bg-transparent border-[var(--border-color)]'
                    }`}
                    role="switch"
                    aria-checked={settings.soundEnabled}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </section>

              {/* Theme Section */}
              <section aria-labelledby="theme-section">
                <h3 className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                  <Sun size={14} strokeWidth={1.5} />
                  <span id="theme-section">Theme</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { playClick(); settings.setTheme(option.value) }}
                      className={`flex flex-col items-center p-4 rounded-[var(--radius-md)] transition-all border-2 ${
                        settings.theme === option.value
                          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
                          : 'border-[var(--border-color)] hover:border-[var(--color-ink)]'
                      }`}
                    >
                      <option.icon size={18} strokeWidth={1.5} className="mb-2" />
                      <span className="text-xs font-semibold uppercase">{option.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Statistics Section */}
              <section aria-labelledby="stats-section">
                <h3 className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                  <Brain size={14} strokeWidth={1.5} />
                  <span id="stats-section">Statistics</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-semibold">{stats.totalQuizzesCreated}</div>
                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-semibold">{stats.totalQuestionsGenerated}</div>
                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-semibold">{formatTime(stats.totalTimeSpent)}</div>
                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-semibold">
                      {stats.lastSessionDate ? new Date(stats.lastSessionDate).toLocaleDateString() : 'Never'}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Last</div>
                  </div>
                </div>
                <button
                  onClick={() => { playClick(); stats.resetStats() }}
                  className="mt-4 w-full flex items-center justify-center gap-2 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-[var(--radius-md)] transition-colors focus-ring"
                >
                  <RotateCcw size={16} strokeWidth={1.5} />
                  <span className="text-sm font-medium">Reset Statistics</span>
                </button>
              </section>
            </div>

            {/* Footer */}
            <footer className="p-4 border-t border-[var(--border-color)] text-center">
              <p className="text-xs text-[var(--text-secondary)] font-mono">QuizFlow v1.0.0 — React + Vite</p>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
