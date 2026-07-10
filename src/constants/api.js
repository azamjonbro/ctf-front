export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    REFRESH: '/auth/refresh',
    CAPTCHA: '/auth/captcha'
  },
  USERS: {
    PROFILE: (username) => `/users/profile/${username}`,
    UPDATE_PROFILE: '/users/profile',
    ACTIVITY_CALENDAR: (username) => `/users/activity-calendar?username=${username}`,
    DASHBOARD_STATS: '/users/dashboard-stats',
    UPLOAD_AVATAR: '/ctfs/upload'
  },
  TEAMS: {
    MY_TEAM: '/teams/me',
    CREATE: '/teams',
    JOIN: '/teams/join',
    LEAVE: '/teams/leave',
    REGISTER_HACKATHON: (hackathonId) => `/teams/register-hackathon/${hackathonId}`
  },
  CTFS: {
    LIST: '/ctfs',
    DETAILS: (ctfId) => `/ctfs/${ctfId}`,
    START_SESSION: (ctfId) => `/ctfs/${ctfId}/session`,
    SUBMIT_QUESTION: (ctfId, questionId) => `/ctfs/${ctfId}/questions/${questionId}/submit`,
    SUBMIT_FLAG: (ctfId, flagIndex) => `/ctfs/${ctfId}/flags/${flagIndex}/submit`,
    UNLOCK_QUESTION_HINT: (ctfId, questionId) => `/ctfs/${ctfId}/questions/${questionId}/hints/unlock`,
    UNLOCK_FLAG_HINT: (ctfId, questionId, flagId) => `/ctfs/${ctfId}/questions/${questionId}/flags/${flagId}/hints/unlock`,
    OPEN_HINT: '/hints/open',
    FINISH: (ctfId) => `/ctfs/${ctfId}/finish`,
    FINISH_EARLY: (ctfId) => `/ctfs/${ctfId}/finish-early`,
    FORCE_FINISH: (ctfId) => `/admin/ctfs/${ctfId}/finish`
  },
  LEADERBOARDS: {
    USERS: '/leaderboards/users',
    TEAMS: '/leaderboards/teams'
  },
  HACKATHONS: {
    LIST: '/hackathons',
    DETAILS: (hackathonId) => `/hackathons/${hackathonId}`,
    CHALLENGES: (hackathonId) => `/hackathons/${hackathonId}/challenges`,
    STANDINGS: (hackathonId) => `/hackathons/${hackathonId}/standings`,
    REGISTERED_TEAMS: (hackathonId) => `/hackathons/${hackathonId}/registered-teams`,
    FINISH: '/hackathons/finish'
  }
};
