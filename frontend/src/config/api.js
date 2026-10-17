// src/config/api.js
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/create',
    ADMIN_CREATE_USER: '/users/admin',
    USERS: '/users',
    USER_BY_ID: '/users/:id',
    USER_UPDATE: '/users/:id',
    USER_PATCH: '/users/:id',
    USER_DELETE: '/users/delete/:id',
    USER_STATUS: '/users/:id/status',
    PROFILE: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    FORUM: '/forum',
    MY_TOPICS: '/forum/mine',
    TOPIC_BY_ID: '/forum/:id'
  }
}

export default API_CONFIG