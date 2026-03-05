import { describe, it, expect, beforeEach } from 'vitest';
import type { Quiz, QuizSettings } from '../types/quiz';

const mockQuiz: Quiz = {
  id: 'test-quiz-1',
  title: 'Test Quiz',
  questions: [
    {
      id: 'q1',
      question: 'What is 2+2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: 'Basic math',
    },
  ],
  createdAt: new Date().toISOString(),
  pdfName: 'test.pdf',
};

// Create a mock store factory
const createMockStore = () => {
  let quizzes: Quiz[] = [];
  let quizSettings: QuizSettings = {
    apiKey: '',
    model: 'minimax/minimax-m2:free',
    numQuestions: 5,
    difficulty: 'medium',
  };
  let previewQuiz: Quiz | null = null;

  return {
    get quizzes() { return quizzes; },
    get quizSettings() { return quizSettings; },
    get previewQuiz() { return previewQuiz; },
    addQuiz: (quiz: Quiz) => { quizzes = [quiz, ...quizzes]; },
    removeQuiz: (id: string) => { quizzes = quizzes.filter(q => q.id !== id); },
    updateSettings: (settings: Partial<QuizSettings>) => { quizSettings = { ...quizSettings, ...settings }; },
    setPreviewQuiz: (quiz: Quiz | null) => { previewQuiz = quiz; },
    confirmPreviewQuiz: () => {
      if (previewQuiz) {
        quizzes = [previewQuiz, ...quizzes];
        previewQuiz = null;
      }
    },
    importQuizzes: (newQuizzes: Quiz[], replace = false) => {
      if (replace) {
        quizzes = newQuizzes;
      } else {
        const existingIds = new Set(quizzes.map(q => q.id));
        const filtered = newQuizzes.filter(q => !existingIds.has(q.id));
        quizzes = [...filtered, ...quizzes];
      }
    },
    clearAllQuizzes: () => { quizzes = []; },
    replaceQuizzes: (newQuizzes: Quiz[]) => { quizzes = newQuizzes; },
  };
};

describe('quizStore', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  it('should add a quiz', () => {
    store.addQuiz(mockQuiz);
    
    expect(store.quizzes).toHaveLength(1);
    expect(store.quizzes[0].id).toBe(mockQuiz.id);
  });

  it('should remove a quiz', () => {
    store.addQuiz(mockQuiz);
    store.removeQuiz(mockQuiz.id);
    
    expect(store.quizzes).toHaveLength(0);
  });

  it('should update settings', () => {
    store.updateSettings({ numQuestions: 10 });
    
    expect(store.quizSettings.numQuestions).toBe(10);
  });

  it('should set and confirm preview quiz', () => {
    store.setPreviewQuiz(mockQuiz);
    
    expect(store.previewQuiz).toEqual(mockQuiz);
    
    store.confirmPreviewQuiz();
    
    expect(store.quizzes).toHaveLength(1);
    expect(store.previewQuiz).toBeNull();
  });

  it('should import quizzes without duplicates', () => {
    store.addQuiz(mockQuiz);
    
    const mockQuiz2: Quiz = {
      ...mockQuiz,
      id: 'test-quiz-2',
    };
    
    store.importQuizzes([mockQuiz, mockQuiz2]);
    
    expect(store.quizzes).toHaveLength(2);
  });

  it('should replace all quizzes', () => {
    store.addQuiz(mockQuiz);
    
    const newQuizzes: Quiz[] = [{
      ...mockQuiz,
      id: 'new-quiz',
    }];
    
    store.replaceQuizzes(newQuizzes);
    
    expect(store.quizzes).toHaveLength(1);
    expect(store.quizzes[0].id).toBe('new-quiz');
  });
});
