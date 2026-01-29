import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileUp,
  History,
  BrainCircuit,
  AlertCircle,
  Check,
  ChevronRight,
  Trash2,
  ExternalLink,
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
    <div className="space-y-8">
      {!activeQuiz ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Upload Area */}
          <div className="editorial-card">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 border border-[var(--border-color)] rounded-[var(--radius-lg)]">
                <FileUp size={32} strokeWidth={1.5} className="text-[var(--text-primary)]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-display font-semibold">Upload PDF Document</h3>
                <p className="text-sm text-[var(--text-secondary)]">Maximum file size: 10MB</p>
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
                className="editorial-button-primary cursor-pointer"
              >
                Select File
              </label>

              {file && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-medium">
                  <Check size={16} strokeWidth={1.5} />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!file || loading}
            className="w-full editorial-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <BrainCircuit size={18} strokeWidth={1.5} className="animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <BrainCircuit size={18} strokeWidth={1.5} />
                Generate Quiz
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-[var(--radius-md)] text-red-700 dark:text-red-400">
              <AlertCircle size={18} strokeWidth={1.5} className="shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* History */}
          {quizzes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <History size={16} strokeWidth={1.5} />
                Recent Quizzes
              </h3>
              <div className="space-y-3">
                {quizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    className="editorial-card flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <ChevronRight size={16} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
                      <div className="text-left">
                        <h4 className="font-semibold text-[var(--text-primary)]">{quiz.title}</h4>
                        <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">{quiz.pdfName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveQuiz(quiz)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-[var(--radius-sm)] transition-all focus-ring"
                        aria-label="Open quiz"
                      >
                        <ExternalLink size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => removeQuiz(quiz.id)}
                        className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[var(--radius-sm)] transition-all focus-ring"
                        aria-label="Delete quiz"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
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
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 pb-32"
        >
          {/* Quiz Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-6">
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 focus-ring rounded-[var(--radius-sm)] px-2 py-1"
            >
              ← Back to Generator
            </button>
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">{activeQuiz.pdfName}</span>
          </div>

          <header className="space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[var(--text-primary)]">
              {activeQuiz.title}
            </h2>
            <p className="text-[var(--text-secondary)]">Based on your uploaded document</p>
          </header>

          {/* Questions */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className="editorial-card space-y-5">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-[var(--color-ink)] text-[var(--color-paper)] rounded-[var(--radius-sm)] font-semibold text-sm shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <h4 className="text-lg font-medium leading-relaxed text-[var(--text-primary)]">{q.question}</h4>
                </div>

                <div className="space-y-2 pl-12">
                  {q.options.map((option, oIdx) => {
                    const isSelected = userAnswers[q.id] === oIdx
                    const isCorrect = oIdx === q.correctAnswer
                    const showCorrect = showResults && isCorrect
                    const showWrong = showResults && isSelected && !isCorrect

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(q.id, oIdx)}
                        className={`w-full text-left p-4 rounded-[var(--radius-md)] border-2 transition-all flex items-center justify-between ${
                          !showResults && isSelected
                            ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                            : !showResults && !isSelected
                            ? 'border-[var(--border-color)] hover:border-[var(--color-ink)] hover:bg-[var(--bg-primary)]'
                            : showCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-600 dark:border-green-700 text-green-700 dark:text-green-400'
                            : showWrong
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-700 text-red-700 dark:text-red-400'
                            : 'border-[var(--border-color)]'
                        }`}
                      >
                        <span className="font-medium">{option}</span>
                        {showCorrect && <Check size={16} strokeWidth={1.5} />}
                        {showWrong && <AlertCircle size={16} strokeWidth={1.5} />}
                      </button>
                    )
                  })}
                </div>

                {showResults && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-12 pt-4 border-t border-[var(--border-color)]"
                  >
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)] mr-2">Explanation:</span>
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              {showResults ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--text-secondary)] font-medium">Score</span>
                    <span className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
                      {score}/{activeQuiz.questions.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="editorial-button-primary"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">
                    {Object.keys(userAnswers).length} of {activeQuiz.questions.length} answered
                  </p>
                  <button
                    disabled={Object.keys(userAnswers).length < activeQuiz.questions.length}
                    onClick={() => setShowResults(true)}
                    className="editorial-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
