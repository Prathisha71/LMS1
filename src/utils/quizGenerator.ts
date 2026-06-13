/**
 * Quiz Generator - API-based implementation
 * 
 * This module handles quiz data fetching from the backend API.
 * Hard-coded data has been removed in favor of dynamic API calls.
 */

import type { Quiz } from '../store/types';
import { quizAPI } from '../services/api';

/**
 * Fetch quiz by ID from the backend
 */
export const getQuizById = async (quizId: string) => {
  try {
    return await quizAPI.getQuiz(quizId);
  } catch (error) {
    console.error('Failed to fetch quiz:', error);
    throw error;
  }
};

/**
 * Fetch quizzes for a specific topic from the backend
 */
export const getQuizzesByTopic = async (topicId: string) => {
  try {
    return await quizAPI.getQuizzesByTopic(topicId);
  } catch (error) {
    console.error('Failed to fetch quizzes for topic:', error);
    throw error;
  }
};

/**
 * Generate a quiz payload for a chapter when no backend data is available.
 */
export const generateQuizForChapter = (
  _classId: string,
  _subjectId: string,
  chapterId: string,
  chapterTitle: string
): Quiz => ({
  id: `quiz-gen-${chapterId}`,
  title: `${chapterTitle} Practice Quiz`,
  subjectId: _subjectId,
  chapterId,
  durationMinutes: 12,
  questions: [
    {
      id: `${chapterId}-q1`,
      question: `What is the most important concept in ${chapterTitle}?`,
      options: ['Theory overview', 'Detailed formula', 'Practice examples', 'Summary notes'],
      correctAnswerIndex: 2,
      explanation: 'Practice examples help verify understanding and application of the lesson.',
    },
    {
      id: `${chapterId}-q2`,
      question: `Which skill is most useful for mastering ${chapterTitle}?`,
      options: ['Memorization', 'Conceptual clarity', 'Speed', 'Creative writing'],
      correctAnswerIndex: 1,
      explanation: 'Conceptual clarity is the key to solving complex board-style problems.',
    },
  ],
});

/**
 * Submit quiz attempt and get results
 */
export const submitQuiz = async (
  quizId: string,
  responses: Array<{ questionId: string; selectedOptionId?: string }>
) => {
  try {
    return await quizAPI.submitQuizAttempt(quizId, responses);
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    throw error;
  }
};

/**
 * Fetch quiz results for a student
 */
export const getQuizResults = async (studentId: string) => {
  try {
    return await quizAPI.getQuizResults(studentId);
  } catch (error) {
    console.error('Failed to fetch quiz results:', error);
    throw error;
  }
};

// Type exports for better type safety
export type { Quiz, QuizQuestion } from '../store/types';
