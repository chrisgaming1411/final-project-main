import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { UserProfile, mapProfileFromSupabase } from '../types';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

type Profile = Tables<'profiles'>;

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (credentials: TablesInsert<'profiles'>) => Promise<{ error: AuthError | null }>;
  signUp: (params: {email: string, password: string, data: {full_name: string, user_type: 'owner' | 'seeker'}}) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserProfile> & { newAvatarFile?: File }) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setIsLoading(true);
        await fetchUserProfile(session.user.id);
        setIsLoading(false);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } else if (data) {
      setUser(mapProfileFromSupabase(data));
    }
  };

  const login = async (credentials: any) => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    return { error };
  };

  const signUp = async (params: {email: string, password: string, data: {full_name: string, user_type: 'owner' | 'seeker'}}) => {
    const { error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.data.full_name,
          user_type: params.data.user_type,
          avatar_url: `https://api.dicebear.com/8.x/initials/svg?seed=${params.data.full_name}`
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updatedData: Partial<UserProfile> & { newAvatarFile?: File }) => {
    if (!user) return { error: 'User not authenticated' };

    let avatarUrl = user.profilePicture;

    if (updatedData.newAvatarFile) {
      const file = updatedData.newAvatarFile;
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return { error: 'Failed to upload new avatar.' };
      }

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatarUrl = publicUrlData.publicUrl;
    }
    
    const profileUpdate: TablesUpdate<'profiles'> = {
      full_name: updatedData.name,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').update(profileUpdate).eq('id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      return { error: 'Failed to update profile.' };
    }

    await fetchUserProfile(user.id); // Re-fetch to update state
    return { error: null };
  };

  const deleteAccount = async () => {
    const { error } = await supabase.rpc('delete_user_account');
    if (error) {
      console.error('Error deleting account:', error);
      return { error: 'Failed to delete account.' };
    }
    await logout();
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!session, user, session, isLoading, login, signUp, logout, updateUser, deleteAccount }}>
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
