import { create } from "zustand";
import { attemptAPI } from "../lib/api";

const useTestStore = create((set, get) => ({
  // ── Active session ─────────────────────────────────────────────
  attemptId: null,
  test: null,
  answers: {},        // { [questionId]: givenAnswer }
  flagged: new Set(), // flagged question ids
  currentSection: 0,
  currentQuestion: 0,
  startedAt: null,
  isSubmitting: false,
  isSubmitted: false,

  // ── Start a new test session ───────────────────────────────────
  startSession: async (testId, testData) => {
    const { data } = await attemptAPI.start(testId);
    set({
      attemptId: data.data._id,
      test: testData,
      answers: {},
      flagged: new Set(),
      currentSection: 0,
      currentQuestion: 0,
      startedAt: new Date(),
      isSubmitted: false,
    });
    return data.data._id;
  },

  // ── Save a single answer (autosave) ───────────────────────────
  saveAnswer: async (questionId, givenAnswer, sectionIndex) => {
    const { attemptId, answers } = get();
    set({ answers: { ...answers, [questionId]: givenAnswer } });

    // Fire-and-forget autosave
    if (attemptId) {
      attemptAPI.answer(attemptId, { questionId, sectionIndex, givenAnswer }).catch(() => {});
    }
  },

  // ── Toggle flagged ─────────────────────────────────────────────
  toggleFlag: (questionId) => {
    const flagged = new Set(get().flagged);
    flagged.has(questionId) ? flagged.delete(questionId) : flagged.add(questionId);
    set({ flagged });
  },

  // ── Navigate ───────────────────────────────────────────────────
  goToQuestion: (sectionIdx, questionIdx) =>
    set({ currentSection: sectionIdx, currentQuestion: questionIdx }),

  nextQuestion: () => {
    const { test, currentSection, currentQuestion } = get();
    if (!test) return;
    const section = test.sections[currentSection];
    if (currentQuestion < section.questions.length - 1) {
      set({ currentQuestion: currentQuestion + 1 });
    } else if (currentSection < test.sections.length - 1) {
      set({ currentSection: currentSection + 1, currentQuestion: 0 });
    }
  },

  prevQuestion: () => {
    const { test, currentSection, currentQuestion } = get();
    if (!test) return;
    if (currentQuestion > 0) {
      set({ currentQuestion: currentQuestion - 1 });
    } else if (currentSection > 0) {
      const prevSection = test.sections[currentSection - 1];
      set({
        currentSection: currentSection - 1,
        currentQuestion: prevSection.questions.length - 1,
      });
    }
  },

  // ── Submit ─────────────────────────────────────────────────────
  submit: async () => {
    const { attemptId } = get();
    if (!attemptId) return null;
    set({ isSubmitting: true });
    try {
      const { data } = await attemptAPI.submit(attemptId);
      set({ isSubmitted: true, isSubmitting: false });
      return data.data;
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  // ── Reset ──────────────────────────────────────────────────────
  reset: () =>
    set({
      attemptId: null, test: null, answers: {}, flagged: new Set(),
      currentSection: 0, currentQuestion: 0, startedAt: null,
      isSubmitting: false, isSubmitted: false,
    }),
}));

export default useTestStore;
