import { describe, it, expect } from 'vitest';
import type { Question, Quiz, QuizSettings } from '../types/quiz';

describe('Quiz Types', () => {
  it('should validate Question structure', () => {
    const question: Question = {
      id: 'q1',
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Test explanation',
    };

    expect(question).toHaveProperty('id');
    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctAnswer');
    expect(question).toHaveProperty('explanation');
    expect(question.options).toHaveLength(4);
    expect(typeof question.correctAnswer).toBe('number');
  });

  it('should validate Quiz structure', () => {
    const quiz: Quiz = {
      id: 'quiz-1',
      title: 'Test Quiz',
      questions: [],
      createdAt: new Date().toISOString(),
      pdfName: 'test.pdf',
    };

    expect(quiz).toHaveProperty('id');
    expect(quiz).toHaveProperty('title');
    expect(quiz).toHaveProperty('questions');
    expect(quiz).toHaveProperty('createdAt');
    expect(quiz).toHaveProperty('pdfName');
    expect(Array.isArray(quiz.questions)).toBe(true);
  });

  it('should validate QuizSettings structure', () => {
    const settings: QuizSettings = {
      apiKey: 'test-key',
      model: 'test-model',
      numQuestions: 5,
      difficulty: 'medium',
    };

    expect(settings).toHaveProperty('apiKey');
    expect(settings).toHaveProperty('model');
    expect(settings).toHaveProperty('numQuestions');
    expect(settings).toHaveProperty('difficulty');
    expect(['easy', 'medium', 'hard']).toContain(settings.difficulty);
  });
});
