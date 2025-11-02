import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '../types';

// Helper functions for localStorage
const getStoredUsers = (): UserProfile[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

const storeUsers = (users: UserProfile[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const getStoredUser = (): UserProfile | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const storeUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (credentials: { email: string }) => Promise<{ error: string | null }>;
  signUp: (params: { name: string; type: 'owner' | 'seeker'; email: string }) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserProfile> & { newAvatarFile?: File }) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate async loading
    setTimeout(() => {
      setUser(getStoredUser());
      setIsLoading(false);
    }, 500);
  }, []);

  const login = async (credentials: { email: string }) => {
    const users = getStoredUsers();
    // For simulation, we'll use email as the user's ID and there's no password.
    const foundUser = users.find(u => u.id.toLowerCase() === credentials.email.toLowerCase());
    
    if (foundUser) {
      storeUser(foundUser);
      setUser(foundUser);
      return { error: null };
    }
    return { error: 'Invalid credentials. User not found.' };
  };

  const signUp = async (params: { name: string; type: 'owner' | 'seeker'; email: string }) => {
    const users = getStoredUsers();
    if (users.some(u => u.id.toLowerCase() === params.email.toLowerCase())) {
      return { error: 'An account with this email already exists.' };
    }
    
    const newUser: UserProfile = {
      id: params.email, // Use email as unique ID for simulation
      name: params.name,
      type: params.type,
      profilePicture: `https://api.dicebear.com/8.x/initials/svg?seed=${params.name}`,
    };
    
    users.push(newUser);
    storeUsers(users);
    
    // Log the user in immediately after sign up
    storeUser(newUser);
    setUser(newUser);
    
    return { error: null };
  };

  const logout = async () => {
    storeUser(null);
    setUser(null);
  };

  const updateUser = async (updatedData: Partial<UserProfile> & { newAvatarFile?: File }) => {
    if (!user) return { error: 'User not authenticated' };
    
    let avatarUrl = user.profilePicture;
    if (updatedData.newAvatarFile) {
        // This URL will only be valid for the current session, which is fine for a simulation.
        avatarUrl = URL.createObjectURL(updatedData.newAvatarFile);
    }

    const updatedUser: UserProfile = { ...user, name: updatedData.name || user.name, profilePicture: avatarUrl };
    
    // Update in global user list
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      storeUsers(users);
    }

    // Update current user
    storeUser(updatedUser);
    setUser(updatedUser);

    return { error: null };
  };

  const deleteAccount = async () => {
    if (!user) return { error: 'User not authenticated' };

    // Remove from global user list
    let users = getStoredUsers();
    users = users.filter(u => u.id !== user.id);
    storeUsers(users);

    // Remove associated data
    localStorage.removeItem(`favorites_${user.id}`);
    const allHouses = JSON.parse(localStorage.getItem('boardingHouses') || '[]');
    const remainingHouses = allHouses.filter((h: any) => h.ownerName !== user.name);
    localStorage.setItem('boardingHouses', JSON.stringify(remainingHouses));

    await logout();
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, signUp, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
