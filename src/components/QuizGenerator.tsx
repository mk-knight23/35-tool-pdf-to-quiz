import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileUp,
  History,
  BrainCircuit,
  AlertCircle,
  Check,
  ChevronRight,
  Trash2,
  ExternalLink,
  Eye,
  Play,
  X,
  RefreshCw,
} from 'lucide-react'
import { useQuizStore } from '@/stores/quizStore'
import { extractTextFromPDF, generateQuizFromAI } from '@/services/aiService'
import type { Quiz } from '@/types/quiz'

export function QuizGenerator() {
  const { settings, quizzes, removeQuiz, previewQuiz, setPreviewQuiz, confirmPreviewQuiz } = useQuizStore()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [editingPreview, setEditingPreview] = useState<Quiz | null>(null)

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

      setPreviewQuiz(newQuiz)
      setEditingPreview(newQuiz)
      setFile(null)
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmQuiz = () => {
    if (editingPreview) {
      setPreviewQuiz(editingPreview)
      confirmPreviewQuiz()
      setActiveQuiz(editingPreview)
      setEditingPreview(null)
      setUserAnswers({})
      setShowResults(false)
    }
  }

  const handleRemoveQuestion = (questionId: string) => {
    if (!editingPreview) return
    setEditingPreview({
      ...editingPreview,
      questions: editingPreview.questions.filter(q => q.id !== questionId)
    })
  }

  const handleCancelPreview = () => {
    setPreviewQuiz(null)
    setEditingPreview(null)
  }

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (showResults) return
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const score = activeQuiz ? activeQuiz.questions.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0)
  }, 0) : 0

  // Preview Mode
  if (editingPreview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 pb-32"
      >
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-6">
          <button
            onClick={handleCancelPreview}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 focus-ring rounded-[var(--radius-sm)] px-2 py-1"
          >
            <X size={16} />
            Cancel
          </button>
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">Preview Mode</span>
        </div>

        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <Eye size={24} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
            <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight text-[var(--text-primary)]">
              {editingPreview.title}
            </h2>
          </div>
          <p className="text-[var(--text-secondary)]">
            Review and customize your generated quiz. Remove any questions you don't want to include.
          </p>
        </header>

        {/* Questions Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">
              {editingPreview.questions.length} questions ready
            </span>
          </div>

          <AnimatePresence>
            {editingPreview.questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="editorial-card space-y-4 group"
              >
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-[var(--color-muted)] text-[var(--color-paper)] rounded-[var(--radius-sm)] font-semibold text-sm shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-base font-medium leading-relaxed text-[var(--text-primary)]">{q.question}</h4>
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[var(--radius-sm)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove question"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((option, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-3 rounded-[var(--radius-sm)] border text-sm ${
                        oIdx === q.correctAnswer
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="pl-12 pt-2 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">Explanation: </span>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {editingPreview.questions.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-[var(--border-color)] rounded-[var(--radius-lg)]">
              <p className="text-[var(--text-secondary)]">All questions removed. Cancel and try again.</p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              {editingPreview.questions.length} of {previewQuiz?.questions.length} questions
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelPreview}
                className="editorial-button-secondary"
              >
                <RefreshCw size={16} strokeWidth={1.5} />
                Regenerate
              </button>
              <button
                onClick={handleConfirmQuiz}
                disabled={editingPreview.questions.length === 0}
                className="editorial-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} strokeWidth={1.5} />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Active Quiz Mode
  if (activeQuiz) {
    return (
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
    )
  }

  // Default Upload View
  return (
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
            <p className="text-sm text-[var(--text-secondary)]">Maximum file size: 10MB. Text-based PDFs only.</p>
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
                    <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">{quiz.pdfName} · {quiz.questions.length} questions</p>
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
  )
}