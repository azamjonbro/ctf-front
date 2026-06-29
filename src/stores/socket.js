import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { useAuthStore } from './auth.js';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null,
    isConnected: false,
    liveSolves: [],
    announcements: [],
  }),
  actions: {
    connectSocket() {
      const authStore = useAuthStore();
      if (!authStore.accessToken || this.socket) return;

      this.socket = io({
        auth: {
          token: authStore.accessToken
        }
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      // Global challenge solve listener
      this.socket.on('challenge:solved', (data) => {
        this.liveSolves.unshift(data);
        if (this.liveSolves.length > 20) {
          this.liveSolves.pop(); // keep latest 20 solves
        }
      });

      // Announcement updates listener
      this.socket.on('announcement:broadcast', (data) => {
        this.announcements.unshift(data);
      });
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }
    },

    joinHackathon(hackathonId) {
      if (this.socket) {
        this.socket.emit('join:hackathon', hackathonId);
      }
    }
  }
});
