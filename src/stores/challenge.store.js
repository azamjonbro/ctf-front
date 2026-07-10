import { defineStore } from 'pinia';
import challengeService from '../services/challenge.service.js';
import getChallengeId from '../utils/getChallengeId.js';

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    challenges: [],
    currentChallenge: null,
    hasActiveSession: false,
    timeRemaining: 0,
    solvedFlags: [],
    isLoading: false,
  }),
  actions: {
    async fetchChallenges() {
      this.isLoading = true;
      try {
        this.challenges = await challengeService.getChallenges();
      } finally {
        this.isLoading = false;
      }
    },

    async fetchChallengeDetails(challengeId) {
      this.isLoading = true;
      try {
        const data = await challengeService.getChallengeDetails(challengeId);
        this.hasActiveSession = data.hasActiveSession;
        if (data.hasActiveSession) {
          this.currentChallenge = data;
          this.timeRemaining = data.timeRemainingSeconds;
          this.solvedFlags = (data.solvedFlags || []).map(sf => sf.flagIndex);
        } else {
          this.currentChallenge = data.challenge;
          this.timeRemaining = 0;
          this.solvedFlags = [];
        }
        return data;
      } finally {
        this.isLoading = false;
      }
    },

    async startSession(challengeId) {
      await challengeService.startSession(challengeId);
      await this.fetchChallengeDetails(challengeId);
    },

    async submitQuestion(session, questionId, answer) {
      const ctfId = getChallengeId(session);
      if (!ctfId) return;
      const data = await challengeService.submitQuestion(ctfId, questionId, answer);
      await this.fetchChallengeDetails(ctfId);
      return data;
    },

    async submitFlag(session, flagIndex, flag) {
      const ctfId = getChallengeId(session);
      if (!ctfId) return;
      const data = await challengeService.submitFlag(ctfId, flagIndex, flag);
      await this.fetchChallengeDetails(ctfId);
      return data;
    },

    async unlockQuestionHint(session, questionId) {
      const ctfId = getChallengeId(session);
      if (!ctfId) return;
      const data = await challengeService.unlockQuestionHint(ctfId, questionId);
      if (this.currentChallenge && this.currentChallenge.questions) {
        const question = this.currentChallenge.questions.find(q => q.id === questionId);
        if (question) {
          question.hint = data.hint;
          question.hintUnlocked = true;
        }
      }
      return data;
    },

    async unlockFlagHint(session, questionId, flagIndex) {
      const ctfId = getChallengeId(session);
      if (!ctfId) return;
      const data = await challengeService.unlockFlagHint(ctfId, questionId, flagIndex);
      await this.fetchChallengeDetails(ctfId);
      return data;
    },

    async openChallengeHint(session) {
      const ctfId = getChallengeId(session);
      if (!ctfId) return;
      const data = await challengeService.openChallengeHint(ctfId);
      if (this.currentChallenge) {
        this.currentChallenge.hintUsed = true;
        this.currentChallenge.challengeHint = data.hint;
      }
      await this.fetchChallengeDetails(ctfId);
      return data;
    },

    async finishChallenge(ctfId) {
      return await challengeService.finishChallenge(ctfId);
    },

    async finishChallengeEarly(ctfId) {
      return await challengeService.finishChallengeEarly(ctfId);
    },

    async forceFinishChallenge(ctfId) {
      const data = await challengeService.forceFinishChallenge(ctfId);
      await this.fetchChallengeDetails(ctfId);
      return data;
    }
  }
});
