import api from '../utils/api.js';
import { API_ENDPOINTS } from '../constants/api.js';

export default {
  async getChallenges() {
    const res = await api.get(API_ENDPOINTS.CTFS.LIST);
    return res.data.data;
  },

  async getChallengeDetails(ctfId) {
    const res = await api.get(API_ENDPOINTS.CTFS.DETAILS(ctfId));
    return res.data.data;
  },

  async startSession(ctfId) {
    const res = await api.post(API_ENDPOINTS.CTFS.START_SESSION(ctfId));
    return res.data.data;
  },

  async submitQuestion(ctfId, questionId, answer) {
    const res = await api.post(API_ENDPOINTS.CTFS.SUBMIT_QUESTION(ctfId, questionId), { answer });
    return res.data.data;
  },

  async submitFlag(ctfId, flagIndex, flag) {
    const res = await api.post(API_ENDPOINTS.CTFS.SUBMIT_FLAG(ctfId, flagIndex), { flag });
    return res.data.data;
  },

  async unlockQuestionHint(ctfId, questionId) {
    const res = await api.post(API_ENDPOINTS.CTFS.UNLOCK_QUESTION_HINT(ctfId, questionId));
    return res.data.data;
  },

  async unlockFlagHint(ctfId, questionId, flagId) {
    const res = await api.post(API_ENDPOINTS.CTFS.UNLOCK_FLAG_HINT(ctfId, questionId, flagId));
    return res.data.data;
  },

  async openChallengeHint(ctfId) {
    const res = await api.post(API_ENDPOINTS.CTFS.OPEN_HINT, { challengeId: ctfId });
    return res.data.data;
  },

  async finishChallenge(ctfId) {
    const res = await api.post(API_ENDPOINTS.CTFS.FINISH(ctfId));
    return res.data.data;
  },

  async finishChallengeEarly(ctfId) {
    const res = await api.post(API_ENDPOINTS.CTFS.FINISH_EARLY(ctfId));
    return res.data.data;
  },

  async forceFinishChallenge(ctfId) {
    const res = await api.post(API_ENDPOINTS.CTFS.FORCE_FINISH(ctfId));
    return res.data.data;
  }
};
