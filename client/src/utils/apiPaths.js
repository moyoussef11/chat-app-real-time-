export const BASE_URL = 'http://localhost:1111/api/';

export const APT_PATHS = {
  AUTH: {
    REGISTER: 'auth/register',
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    UPDATEPROFILE: (id) => `auth/update-profile/${id}`,
  },
  MESSAGES: {
    GET_USERS: 'messages/users',
    SEND_MESSAGE: (id) => `messages/send-message/${id}`,
    GET_MESSAGES: (id) => `messages/${id}`,
  },
  GROUPS: {
    GROUPS: 'groups',
    SEND_MESSAGES: (id) => `groups/${id}/send-message`,
    GET_MESSAGES: (id) => `groups/${id}/messages`,
  },
};
