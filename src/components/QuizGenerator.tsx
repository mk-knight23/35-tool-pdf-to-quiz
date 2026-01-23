import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileUp, 
  History, 
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { useQuizStore } from '@/stores/quizStore'
import { extractTextFromPDF, generateQuizFromAI } from '@/services/aiService'
import type { Quiz } from '@/types/quiz'

export function QuizGenerator() {
  const { settings, addQuiz, quizzes, removeQuiz } = useQuizStore()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleGenerate = async () => {
    if (!file) return
    if (!settings.apiKey) {
      setError('Please configure your API key in Settings first')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const text = await extractTextFromPDF(file)
      const quizData = await generateQuizFromAI(
        text,
        settings.apiKey,
        settings.model,
        settings.numQuestions,
        settings.difficulty
      )

      const newQuiz: Quiz = {
        id: Math.random().toString(36).substr(2, 9),
        title: quizData.title,
        questions: quizData.questions.map((q: any) => ({
          ...q,
          id: Math.random().toString(36).substr(2, 9)
        })),
        createdAt: new Date().toISOString(),
        pdfName: file.name
      }

      addQuiz(newQuiz)
      setActiveQuiz(newQuiz)
      setUserAnswers({})
      setShowResults(false)
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (showResults) return
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const score = activeQuiz ? activeQuiz.questions.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0)
  }, 0) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!activeQuiz ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Upload Area */}
          <div className="glass p-12 rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center text-center space-y-6 transition-colors hover:border-quiz-primary/50">
            <div className="p-6 bg-quiz-primary/10 rounded-full text-quiz-primary">
              <FileUp size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold">Upload PDF</h3>
              <p className="text-slate-500 mt-2">Maximum file size: 10MB</p>
            </div>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="hidden" 
              id="pdf-upload" 
            />
            <label 
              htmlFor="pdf-upload"
              className="bg-quiz-primary hover:bg-quiz-primary/90 text-white px-8 py-3 rounded-xl font-bold cursor-pointer transition-all active:scale-95 shadow-lg shadow-quiz-primary/20"
            >
              Select File
            </label>
            {file && (
              <div className="flex items-center gap-2 text-quiz-accent font-medium">
                <CheckCircle2 size={18} />
                {file.name}
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!file || loading}
            className="w-full bg-quiz-dark dark:bg-white dark:text-quiz-dark text-white p-5 rounded-2xl font-display font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <BrainCircuit className="animate-spin" />
            ) : (
              <BrainCircuit />
            )}
            {loading ? 'GENERATING QUIZ...' : 'GENERATE QUIZ'}
          </button>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* History */}
          {quizzes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <History className="w-5 h-5" /> Recent Quizzes
              </h3>
              <div className="grid gap-4">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="glass p-4 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <ChevronRight className="text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">{quiz.title}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-tighter">{quiz.pdfName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setActiveQuiz(quiz)}
                        className="p-2 hover:bg-quiz-primary/10 text-quiz-primary rounded-lg transition-colors"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => removeQuiz(quiz.id)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 pb-20"
        >
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveQuiz(null)}
              className="text-slate-500 hover:text-quiz-primary transition-colors flex items-center gap-2"
            >
              ← Back to Generator
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase">{activeQuiz.pdfName}</span>
          </div>

          <header className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight">
              {activeQuiz.title}
            </h2>
            <p className="text-slate-500">Based on your uploaded document</p>
          </header>

          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className="glass p-8 rounded-[2rem] space-y-6">
                <div className="flex items-start gap-4">
                  <span className="bg-quiz-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-xl font-bold leading-snug">{q.question}</h4>
                </div>
                
                <div className="grid gap-3 pl-12">
                  {q.options.map((option, oIdx) => {
                    const isSelected = userAnswers[q.id] === oIdx
                    const isCorrect = oIdx === q.correctAnswer
                    const showCorrect = showResults && isCorrect
                    const showWrong = showResults && isSelected && !isCorrect

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(q.id, oIdx)}
                        className={clsx(
                          "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between",
                          !showResults && isSelected && "bg-quiz-primary/10 border-quiz-primary",
                          !showResults && !isSelected && "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                          showCorrect && "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400",
                          showWrong && "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400"
                        )}
                      >
                        <span className="font-medium">{option}</span>
                        {showCorrect && <CheckCircle2 size={18} />}
                        {showWrong && <AlertCircle size={18} />}
                      </button>
                    )
                  })}
                </div>

                {showResults && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-12 pt-4 border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="text-sm text-slate-500 italic">
                      <span className="font-bold text-quiz-accent uppercase not-italic mr-2">Explanation:</span>
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <div className="glass p-4 rounded-2xl shadow-2xl flex items-center justify-between">
              {showResults ? (
                <>
                  <div className="flex items-center gap-4 pl-4">
                    <span className="text-sm font-bold text-slate-500 uppercase">Score</span>
                    <span className="text-2xl font-black text-quiz-primary">{score}/{activeQuiz.questions.length}</span>
                  </div>
                  <button 
                    onClick={() => setActiveQuiz(null)}
                    className="bg-quiz-dark dark:bg-white dark:text-quiz-dark text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500 pl-4 font-medium">
                    {Object.keys(userAnswers).length} of {activeQuiz.questions.length} answered
                  </p>
                  <button 
                    disabled={Object.keys(userAnswers).length < activeQuiz.questions.length}
                    onClick={() => setShowResults(true)}
                    className="bg-quiz-primary hover:bg-quiz-primary/90 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all"
                  >
                    Check Results
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
