import { create } from 'zustand';

/**
 * Assessment Store - Global state management for test-taking
 * Tracks current question index, user responses, and provides actions
 */

export const useAssessmentStore = create((set) => ({
  // State
  currentIndex: 0,
  responses: {},
  isSubmitted: false,
  submittedAt: null,

  // Actions
  setAnswer: (questionId, answer) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: answer,
      },
    })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    })),

  prevQuestion: () =>
    set((state) => ({
      currentIndex: Math.max(0, state.currentIndex - 1),
    })),

  submitAssessment: () =>
    set({
      isSubmitted: true,
      submittedAt: new Date(),
    }),

  // Reset store for new assessment
  reset: () =>
    set({
      currentIndex: 0,
      responses: {},
      isSubmitted: false,
      submittedAt: null,
    }),
}));
