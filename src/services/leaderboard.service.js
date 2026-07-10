import api from '../utils/api.js';
import { API_ENDPOINTS } from '../constants/api.js';

export default {
  async getUserLeaderboard() {
    const res = await api.get(API_ENDPOINTS.LEADERBOARDS.USERS);
    return res.data.data;
  },

  async getTeamLeaderboard() {
    const res = await api.get(API_ENDPOINTS.LEADERBOARDS.TEAMS);
    return res.data.data;
  }
};
