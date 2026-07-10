import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useAuthStore } from '../stores/auth.store.js';

// Configure NProgress bar
NProgress.configure({ showSpinner: false, speed: 400 });

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api/v1' : 'https://ctf.techinfo.uz/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Start loader & inject access token
api.interceptors.request.use(
  (config) => {
    NProgress.start();
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Response Interceptor: Stop loader & handle token rotation on 401
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    NProgress.done();
    const originalRequest = error.config;

    // Check if error is unauthorized and request wasn't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore();

      try {
        // Attempt to rotate tokens
        const tokensRotated = await authStore.rotateSessionTokens();
        if (tokensRotated) {
          // Update headers and retry
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
          return api(originalRequest);
        }
      } catch (rotationError) {
        authStore.purgeAuthSession();
        return Promise.reject(rotationError);
      }
    }

    // Standardize error body format
    const errorBody = error.response?.data || {
      success: false,
      error: { id: 'SYSTEM_003', message: error.message || 'Network communication error' }
    };

    return Promise.reject(errorBody);
  }
);

export default api;
