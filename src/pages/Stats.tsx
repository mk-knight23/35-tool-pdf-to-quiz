import { useQuizStore } from '@/stores/quizStore';
import { useStatsStore } from '@/stores/stats';
import { BarChart3, TrendingUp, FileText, Target, Clock } from 'lucide-react';

export default function Stats() {
  const { quizzes } = useQuizStore();
  const stats = useStatsStore();

  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
  const avgQuestions = quizzes.length > 0 ? Math.round(totalQuestions / quizzes.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-normal text-[var(--text-primary)] mb-2">
          Your Statistics
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">Track your quiz generation progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-ink)]/10 rounded-lg">
              <FileText className="w-5 h-5 text-[var(--color-ink)]" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Total Quizzes</span>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{quizzes.length}</p>
        </div>

        <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-ink)]/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-[var(--color-ink)]" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Total Questions</span>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{totalQuestions}</p>
        </div>

        <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-ink)]/10 rounded-lg">
              <Target className="w-5 h-5 text-[var(--color-ink)]" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Avg Questions</span>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{avgQuestions}</p>
        </div>

        <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-ink)]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[var(--color-ink)]" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Created</span>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalQuizzesCreated}</p>
        </div>
      </div>

      {/* Questions by Quiz */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[var(--color-ink)]/10 rounded-lg">
            <Clock className="w-5 h-5 text-[var(--color-ink)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Questions by Quiz</h3>
        </div>

        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.slice(0, 10).map((quiz, index) => {
              const maxQuestions = Math.max(...quizzes.map(q => q.questions.length));
              const percent = (quiz.questions.length / maxQuestions) * 100;
              return (
                <div key={quiz.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-primary)] truncate max-w-[200px]">
                      {quiz.title || quiz.pdfName || `Quiz #${quizzes.length - index}`}
                    </span>
                    <span className="text-[var(--text-secondary)]">{quiz.questions.length} questions</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-ink)] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">
            No data yet. Generate some quizzes to see your stats.
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 bg-[var(--bg-primary)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
        {quizzes.length > 0 ? (
          <div className="space-y-3">
            {quizzes.slice(0, 5).map((quiz, index) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm text-[var(--text-primary)]">
                    {quiz.title || quiz.pdfName || `Quiz #${quizzes.length - index}`}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {quiz.questions.length} questions
                  </p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">
            No activity yet. Start generating quizzes!
          </p>
        )}
      </div>
    </div>
  );
}
