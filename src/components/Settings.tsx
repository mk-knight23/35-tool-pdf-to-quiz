import { motion } from 'framer-motion'
import { 
  X, 
  Key, 
  Cpu, 
  ListOrdered, 
  BarChart3,
  Moon,
  Sun,
  ShieldCheck
} from 'lucide-react'
import { useQuizStore } from '@/stores/quizStore'

interface SettingsProps {
  onClose: () => void
}

const MODELS = [
  { id: 'minimax/minimax-m2:free', name: 'MiniMax M2 (Free)' },
  { id: 'google/gemini-flash-1.5-8b:free', name: 'Gemini 1.5 Flash (Free)' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (Paid)' }
]

export function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings, isDarkMode, toggleDarkMode } = useQuizStore()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-black tracking-tight">App Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* API Key */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Key size={14} /> OpenRouter API Key
            </label>
            <input 
              type="password"
              value={settings.apiKey}
              onChange={e => updateSettings({ apiKey: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-quiz-primary outline-none transition-all"
              placeholder="sk-or-v1-..."
            />
            <p className="text-[10px] text-slate-400">
              Keys are stored locally in your browser. Get one at <a href="https://openrouter.ai/keys" target="_blank" className="text-quiz-primary underline">openrouter.ai</a>
            </p>
          </div>

          {/* Model selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} /> AI Model
            </label>
            <select 
              value={settings.model}
              onChange={e => updateSettings({ model: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-quiz-primary outline-none transition-all"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Number of questions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ListOrdered size={14} /> Default Question Count
            </label>
            <input 
              type="number"
              min="1" max="20"
              value={settings.numQuestions}
              onChange={e => updateSettings({ numQuestions: parseInt(e.target.value) })}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-quiz-primary outline-none transition-all"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={14} /> Difficulty Level
            </label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => updateSettings({ difficulty: d as any })}
                  className={clsx(
                    "flex-1 py-2 rounded-lg font-bold text-sm uppercase transition-all",
                    settings.difficulty === d 
                      ? "bg-quiz-primary text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Interface Theme</span>
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-xs font-black uppercase">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <ShieldCheck className="text-emerald-500 shrink-0" />
          <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 leading-relaxed">
            Your privacy is prioritized. All PDF processing and API keys remain within your browser environment.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
