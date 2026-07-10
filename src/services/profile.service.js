import api from '../utils/api.js';
import { API_ENDPOINTS } from '../constants/api.js';
import normalizeUsername from '../utils/normalizeUsername.js';

export default {
  async getProfile(username) {
    const normalized = normalizeUsername(username);
    const res = await api.get(API_ENDPOINTS.USERS.PROFILE(normalized));
    return res.data.data;
  },

  async updateProfile(payload) {
    if (payload.username) {
      payload.username = normalizeUsername(payload.username);
    }
    const res = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, payload);
    return res.data;
  },

  async getActivityCalendar(username) {
    const normalized = normalizeUsername(username);
    const res = await api.get(API_ENDPOINTS.USERS.ACTIVITY_CALENDAR(normalized));
    return res.data.data;
  },

  async uploadAvatar(formData) {
    const res = await api.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  }
};
