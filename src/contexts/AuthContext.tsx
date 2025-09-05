import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  isBlocked?: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          isBlocked: data.is_blocked,
          createdAt: new Date(data.created_at)
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const ensureAdminExists = async () => {
    try {
      // First try to login as admin
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@lab.com',
        password: 'admin123'
      });

      if (!loginError) {
        return; // Admin exists and we're logged in
      }

      // If login failed, create admin user using RPC function
      const { error: createError } = await supabase.rpc('create_user', {
        p_username: 'admin',
        p_email: 'admin@lab.com',
        p_password: 'admin123',
        p_role: 'admin'
      });

      if (createError) {
        throw createError;
      }

      // Now login as the newly created admin
      const { error: finalLoginError } = await supabase.auth.signInWithPassword({
        email: 'admin@lab.com',
        password: 'admin123'
      });

      if (finalLoginError) {
        throw finalLoginError;
      }

    } catch (error) {
      console.error('创建管理员失败:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          // If it's the admin trying to login and credentials are invalid, try to create admin
          if (email === 'admin@lab.com') {
            await ensureAdminExists();
            return;
          }
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || '登录失败');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Use RPC function to create user (bypasses RLS)
      const { error } = await supabase.rpc('create_user', {
        p_username: username,
        p_email: email,
        p_password: password,
        p_role: 'member'
      });

      if (error) throw error;

      // Now login with the new credentials
      await login(email, password);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || '注册失败');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || '登出失败');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: updates.username,
          email: updates.email,
          role: updates.role,
          is_blocked: updates.isBlocked
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || '更新资料失败');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};