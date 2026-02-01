import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/settings'
import {
  Settings as SettingsIcon,
  Github,
  FileText,
} from 'lucide-react'
import { QuizGenerator } from './components/QuizGenerator'
import { SettingsPanel } from './components/SettingsPanel'

export default function App() {
  const { isDarkMode, focusMode, toggleHelp } = useSettingsStore()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} ${focusMode ? 'focus-mode' : ''}`}>
      {focusMode && <div className="focus-mode-indicator">FOCUS MODE</div>}
      <SettingsPanel onClose={() => toggleHelp()} />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-start mb-16 border-b border-[var(--border-color)] pb-8">
          <div>
            <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--text-primary)]">
              Quiz<span className="font-semibold">Flow</span>
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] font-body tracking-wide uppercase">
              PDF to Quiz Generator
            </p>
          </div>

          <nav className="flex items-center gap-3">
            <button
              onClick={() => toggleHelp()}
              className="p-2.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-ink)] transition-all focus-ring"
              aria-label="Open settings"
            >
              <SettingsIcon size={18} strokeWidth={1.5} />
            </button>
            <a
              href="https://github.com/mk-knight23/37-PDF-to-Quiz-Generator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-ink)] transition-all focus-ring"
              aria-label="View on GitHub"
            >
              <Github size={18} strokeWidth={1.5} />
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--border-color)] rounded-[var(--radius-md)] text-xs font-medium tracking-widest uppercase text-[var(--text-secondary)]"
          >
            <FileText size={14} strokeWidth={1.5} />
            AI-Powered Learning
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight text-[var(--text-primary)]"
          >
            Transform PDFs into<br />
            <span className="font-semibold italic">Interactive Quizzes</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-body leading-relaxed"
          >
            Upload any PDF document and instantly generate a comprehensive quiz.
            Perfect for students, educators, and lifelong learners.
          </motion.p>
        </div>

        {/* Main Content */}
        <main>
          <QuizGenerator />
        </main>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
            <p className="text-[var(--text-secondary)] font-mono">
              Made by MK — Musharraf Kazi
            </p>
            <p className="text-[var(--text-secondary)] font-mono">
              © 2026 QuizFlow AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
