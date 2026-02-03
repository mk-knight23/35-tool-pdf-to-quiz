import { useQuizStore } from '@/stores/quizStore';
import { Clock, Trash2, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const { quizzes, removeQuiz } = useQuizStore();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No quiz history yet</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Generate your first quiz to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-normal text-[var(--text-primary)] mb-2">
          Quiz History
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">{quizzes.length} quizzes generated</p>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-[var(--color-ink)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[var(--color-ink)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                    {quiz.title || quiz.pdfName || `Quiz #${quizzes.length - index}`}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    {quiz.questions.length} questions • {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedQuiz(quiz.id)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  title="View quiz"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this quiz?')) {
                      removeQuiz(quiz.id);
                    }
                  }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                  title="Delete quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedQuiz === quiz.id && (
              <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                <div className="space-y-4">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={question.id || qIndex} className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <p className="font-medium text-[var(--text-primary)] mb-2">
                        {qIndex + 1}. {question.question}
                      </p>
                      <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                        {question.options.map((option, oIndex) => (
                          <li
                            key={oIndex}
                            className={
                              oIndex === question.correctAnswer
                                ? 'text-green-600 dark:text-green-400 font-medium'
                                : ''
                            }
                          >
                            {oIndex === question.correctAnswer && '✓ '}
                            {option}
                          </li>
                        ))}
                      </ul>
                      {question.explanation && (
                        <p className="mt-2 text-xs text-[var(--text-muted)] italic">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
