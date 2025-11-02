import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

const getStoredFavorites = (userId: string): number[] => {
    const favorites = localStorage.getItem(`favorites_${userId}`);
    return favorites ? JSON.parse(favorites) : [];
};

const storeFavorites = (userId: string, favorites: number[]) => {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
};

interface FavoritesContextType {
  favoriteIds: number[];
  addFavorite: (id: number) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(true);
      const userFavorites = getStoredFavorites(user.id);
      setFavoriteIds(userFavorites);
      setLoading(false);
    } else {
      setFavoriteIds([]);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const addFavorite = async (id: number) => {
    if (!user) return;
    setLoading(true);
    const updatedFavorites = [...favoriteIds, id];
    setFavoriteIds(updatedFavorites);
    storeFavorites(user.id, updatedFavorites);
    setLoading(false);
  };

  const removeFavorite = async (id: number) => {
    if (!user) return;
    setLoading(true);
    const updatedFavorites = favoriteIds.filter(favId => favId !== id);
    setFavoriteIds(updatedFavorites);
    storeFavorites(user.id, updatedFavorites);
    setLoading(false);
  };

  const isFavorite = (id: number) => {
    return favoriteIds.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
