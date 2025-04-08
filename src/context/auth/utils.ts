
import { UsersDatabase } from './types';
import { USERS_DB_KEY } from './constants';

// Initialize users database from localStorage or with default data
export const initUsersDb = (): UsersDatabase => {
  const storedUsers = localStorage.getItem(USERS_DB_KEY);
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Default users for development
  return {
    '1': {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      password: 'password123',
      preferences: {
        theme: 'light',
        emailNotifications: true,
        calendarSync: false
      },
      savedChats: []
    }
  };
};
