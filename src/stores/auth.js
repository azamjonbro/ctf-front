import { defineStore } from 'pinia';
import axios from 'axios';
import api from '../utils/api.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.roles.includes('admin') || false,
    isStaff: (state) => state.user?.roles.includes('staff') || state.user?.roles.includes('admin') || false,
    isSupport: (state) => state.user?.roles.includes('support') || state.user?.roles.includes('admin') || false,
  },
  actions: {
    async userRegister(payload) {
      await api.post('/auth/register', payload);
    },

    async userLogin(payload) {
      const response = await api.post('/auth/login', payload);
      const { accessToken, refreshToken, user } = response.data.data;
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.user = user;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },

    async rotateSessionTokens() {
      if (!this.refreshToken) return false;
      
      // Use clean axios instance to avoid infinite loop intercepts
      const response = await axios.post('/api/v1/auth/refresh', {
        refreshToken: this.refreshToken
      });

      const { accessToken, refreshToken } = response.data.data;
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return true;
    },

    async userLogout() {
      try {
        await api.post('/auth/logout', { refreshToken: this.refreshToken });
      } catch (err) {
        // Suppress and continue purging local state
      } finally {
        this.purgeAuthSession();
      }
    },

    async userLogoutAll() {
      try {
        await api.post('/auth/logout-all');
      } finally {
        this.purgeAuthSession();
      }
    },

    purgeAuthSession() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
});
