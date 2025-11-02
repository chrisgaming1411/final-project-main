import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

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
    const fetchFavorites = async () => {
      if (!user) {
        setFavoriteIds([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('boarding_house_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavoriteIds(data.map(fav => fav.boarding_house_id));
      }
      setLoading(false);
    };

    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavoriteIds([]);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const addFavorite = async (id: number) => {
    if (!user) return;
    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      boarding_house_id: id,
    });
    if (error) {
      console.error('Error adding favorite:', error);
    } else {
      setFavoriteIds(prev => [...prev, id]);
    }
  };

  const removeFavorite = async (id: number) => {
    if (!user) return;
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.id, boarding_house_id: id });
    
    if (error) {
      console.error('Error removing favorite:', error);
    } else {
      setFavoriteIds(prev => prev.filter(favId => favId !== id));
    }
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
