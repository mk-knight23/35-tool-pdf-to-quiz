import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { QuizGenerator } from '../components/QuizGenerator';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
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
      <QuizGenerator />
    </div>
  );
}
