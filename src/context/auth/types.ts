
export type User = {
  id: string;
  email: string;
  name: string;
  preferences?: {
    theme?: string;
    emailNotifications?: boolean;
    calendarSync?: boolean;
  };
  savedChats?: string[];
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  saveChat: (chatId: string) => Promise<boolean>;
  removeChat: (chatId: string) => Promise<boolean>;
}

// Extended user type with password for storage
export type UserWithPassword = User & { password: string };

// User database structure
export type UsersDatabase = Record<string, UserWithPassword>;
