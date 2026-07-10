import { defineStore } from 'pinia';
import challengeService from '../services/challenge.service.js';
import { useChallengeStore } from './challenge.store.js';

export const useHintStore = defineStore('hint', {
  state: () => ({
    unlockedHints: {},
    loadingHints: {}
  }),
  getters: {
    isHintUnlocked: (state) => (questionId) => {
      return !!state.unlockedHints[questionId];
    },
    isHintLoading: (state) => (questionId) => {
      return !!state.loadingHints[questionId];
    },
    getHint: (state) => (questionId) => {
      return state.unlockedHints[questionId] || '';
    }
  },
  actions: {
    async unlockHint(ctfId, questionId) {
      if (!ctfId || !questionId) return null;
      this.loadingHints[questionId] = true;
      try {
        const data = await challengeService.unlockQuestionHint(ctfId, questionId);
        const hintText = data?.hint || '';
        this.unlockedHints[questionId] = hintText;

        // Also update challengeStore currentChallenge question state
        const challengeStore = useChallengeStore();
        if (challengeStore.currentChallenge && challengeStore.currentChallenge.questions) {
          const question = challengeStore.currentChallenge.questions.find(
            q => (q.id === questionId || q._id === questionId)
          );
          if (question) {
            question.hint = hintText;
            question.hintUnlocked = true;
          }
        }
        return data;
      } finally {
        this.loadingHints[questionId] = false;
      }
    },
    async fetchQuestion(questionId) {
      const challengeStore = useChallengeStore();
      if (challengeStore.currentChallenge && challengeStore.currentChallenge.questions) {
        const question = challengeStore.currentChallenge.questions.find(
          q => (q.id === questionId || q._id === questionId)
        );
        if (question && (question.hintUnlocked || question.hint)) {
          this.unlockedHints[questionId] = question.hint || '';
        }
        return question;
      }
      return null;
    }
  }
});
