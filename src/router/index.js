import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.js';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: () => import('../views/Challenges.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/challenges/:challengeId',
    name: 'ChallengeDetails',
    component: () => import('../views/ChallengeDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/hackathons',
    name: 'Hackathons',
    component: () => import('../views/Hackathons.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboards',
    name: 'Leaderboards',
    component: () => import('../views/Leaderboards.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/Team.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/hackathons/:hackathonId',
    name: 'HackathonArena',
    component: () => import('../views/HackathonArena.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
