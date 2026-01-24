import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/settings'
import {
  BrainCircuit,
  Settings as SettingsIcon,
  Sparkles,
  Github,
} from 'lucide-react'
import { QuizGenerator } from './components/QuizGenerator'
import { SettingsPanel } from './components/SettingsPanel'

export default function App() {
  const { isDarkMode, toggleHelp } = useSettingsStore()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <SettingsPanel onClose={() => toggleHelp()} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="bg-quiz-primary p-2.5 rounded-2xl shadow-lg shadow-quiz-primary/30 rotate-3">
              <BrainCircuit className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black tracking-tighter">
                Quiz<span className="text-quiz-primary">Flow</span>
              </h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AI Enabled</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleHelp()}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-quiz-primary transition-all"
            >
              <SettingsIcon size={20} />
            </button>
            <a
              href="https://github.com/mk-knight23/37-PDF-to-Quiz-Generator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-quiz-primary transition-all"
            >
              <Github size={20} />
            </a>
          </div>
        </nav>

        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-quiz-secondary/10 text-quiz-secondary text-xs font-black uppercase tracking-widest"
          >
            <Sparkles size={14} className="fill-current" /> Transform Documents Instantly
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight leading-[0.9]">
            Turn PDFs into <br />
            <span className="gradient-text italic">Interactive Quizzes</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg font-medium">
            Upload any PDF and let our AI generate a comprehensive quiz for you. Perfect for students, teachers, and lifelong learners.
          </p>
        </div>

        <main>
          <QuizGenerator />
        </main>

        <footer className="mt-32 pb-12 border-t border-slate-200 dark:border-slate-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-slate-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-quiz-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-quiz-primary transition-colors">API</a>
              <a href="#" className="hover:text-quiz-primary transition-colors">Terms</a>
            </div>
            <p>&copy; 2026 MK-QUILABS</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
