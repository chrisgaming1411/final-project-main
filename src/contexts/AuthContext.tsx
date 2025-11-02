import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  type: 'owner' | 'seeker';
  profilePicture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: Omit<User, 'profilePicture'>) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: Omit<User, 'profilePicture'>) => {
    const userWithPic: User = {
      ...userData,
      profilePicture: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/72f7/1c48/1924a99473c91bfdac585c9cc9c2bc58?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mJnJD9EzUMxuOGa0xzUEmYC0JQNIRhM704Zqs0bzBIsJ~XT-QNlVIkfzY9vZFBTayulfvYsx-2Xp~dBb3O3yYB905KQ6s0lCcnt7BaGeDk2xnx3Gp1giTw~f9AJ6Ce9t11JF4iZ2gZVd4kCv339PTlrWc~-wRUK0pS3iwo5lHuDFCFbFIHyJoj3LijnqmvnthP8QAH6Jg-5Ef8bfZKmzc~x8~LU5eMKsbqLw4UkZjmI6bWc1BW4hkxyC5rFNHICjX0w7kZFbmM92veRqLZYl5H9tLL1O-8s9WIJpKp4aRLRtAvhNeWpr6VayY8y3pdRBv9~IWhP~PPviMzw8x0lJww__'
    };
    localStorage.setItem('user', JSON.stringify(userWithPic));
    setUser(userWithPic);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, updateUser }}>
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
