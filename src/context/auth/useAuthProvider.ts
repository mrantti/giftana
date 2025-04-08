
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User, UsersDatabase } from './types';
import { USER_STORAGE_KEY, USERS_DB_KEY } from './constants';
import { initUsersDb } from './utils';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersDb, setUsersDb] = useState<UsersDatabase>(initUsersDb);
  const { toast } = useToast();

  // Persist users database changes
  useEffect(() => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find user
      const foundUserEntry = Object.entries(usersDb).find(
        ([_, u]) => u.email === email && u.password === password
      );

      if (foundUserEntry) {
        const [_, foundUser] = foundUserEntry;
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user exists
      if (Object.values(usersDb).some(u => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use.",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUserId = String(Object.keys(usersDb).length + 1);
      const newUser = {
        id: newUserId,
        email,
        name,
        password,
        preferences: {
          theme: 'light',
          emailNotifications: true,
          calendarSync: false
        },
        savedChats: []
      };

      // Update users database
      setUsersDb(prev => ({
        ...prev,
        [newUserId]: newUser
      }));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update user in the database
      setUsersDb(prev => {
        const updatedUser = { 
          ...prev[user.id], 
          ...data, 
          preferences: { 
            ...prev[user.id].preferences, 
            ...data.preferences 
          }
        };
        return { ...prev, [user.id]: updatedUser };
      });
      
      // Update current user
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveChat = async (chatId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Don't save duplicate chat IDs
      if (user.savedChats?.includes(chatId)) return true;
      
      const savedChats = [...(user.savedChats || []), chatId];
      
      // Update user in state and localStorage
      const updatedUser = { ...user, savedChats };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update in the users database
      setUsersDb(prev => {
        const updatedDbUser = { 
          ...prev[user.id], 
          savedChats 
        };
        return { ...prev, [user.id]: updatedDbUser };
      });
      
      toast({
        title: "Chat saved",
        description: "This conversation has been saved to your profile.",
      });
      return true;
    } catch (error) {
      console.error("Save chat error:", error);
      toast({
        title: "Save failed",
        description: "Failed to save this conversation.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeChat = async (chatId: string): Promise<boolean> => {
    if (!user || !user.savedChats) return false;
    
    try {
      const savedChats = user.savedChats.filter(id => id !== chatId);
      
      // Update user in state and localStorage
      const updatedUser = { ...user, savedChats };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update in the users database
      setUsersDb(prev => {
        const updatedDbUser = { 
          ...prev[user.id], 
          savedChats 
        };
        return { ...prev, [user.id]: updatedDbUser };
      });
      
      toast({
        title: "Chat removed",
        description: "The conversation has been removed from your saved items.",
      });
      return true;
    } catch (error) {
      console.error("Remove chat error:", error);
      toast({
        title: "Remove failed",
        description: "Failed to remove this conversation.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    saveChat,
    removeChat
  };
};
