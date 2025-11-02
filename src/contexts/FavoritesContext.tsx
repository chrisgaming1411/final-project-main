import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface FavoritesContextType {
  favoriteIds: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      localStorage.removeItem('favorites');
    }
  }, []);

  const updateLocalStorage = (ids: number[]) => {
    localStorage.setItem('favorites', JSON.stringify(ids));
  };

  const addFavorite = (id: number) => {
    setFavoriteIds(prevIds => {
      const newIds = [...prevIds, id];
      updateLocalStorage(newIds);
      return newIds;
    });
  };

  const removeFavorite = (id: number) => {
    setFavoriteIds(prevIds => {
      const newIds = prevIds.filter(favId => favId !== id);
      updateLocalStorage(newIds);
      return newIds;
    });
  };

  const isFavorite = (id: number) => {
    return favoriteIds.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite }}>
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
