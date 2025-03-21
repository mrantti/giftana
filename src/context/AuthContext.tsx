
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth for the MVP
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    password: 'password123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('perfectgift_user');
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
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('perfectgift_user', JSON.stringify(userWithoutPassword));
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
      if (mockUsers.some(u => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use.",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        email,
        name,
        password
      };

      mockUsers.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('perfectgift_user', JSON.stringify(userWithoutPassword));
      
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
    localStorage.removeItem('perfectgift_user');
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

      // Update user
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('perfectgift_user', JSON.stringify(updatedUser));
      
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
