import { defineStore } from 'pinia';
import leaderboardService from '../services/leaderboard.service.js';

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    userLeaderboard: [],
    teamLeaderboard: [],
    surrounding: { currentUserRank: null, currentTeamRank: null, above: [], below: [] },
    isLoading: false
  }),
  actions: {
    async fetchUserLeaderboard() {
      this.isLoading = true;
      try {
        const data = await leaderboardService.getUserLeaderboard();
        this.userLeaderboard = data.leaderboard;
        this.surrounding = data.surrounding;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTeamLeaderboard() {
      this.isLoading = true;
      try {
        const data = await leaderboardService.getTeamLeaderboard();
        this.teamLeaderboard = data.leaderboard;
        this.surrounding = data.surrounding;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
