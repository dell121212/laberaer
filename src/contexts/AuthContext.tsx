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
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
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
    // 检查本地存储的用户信息
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt)
        });
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('current_user');
      }
    }

    // 确保管理员账户存在
    ensureAdminExists();
    setLoading(false);
  }, []);

  const ensureAdminExists = async () => {
    try {
      // 检查数据库中是否存在管理员
      const { data: existingAdmin } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'admin')
        .single();

      if (!existingAdmin) {
        // 创建管理员账户
        const { error } = await supabase
          .from('users')
          .insert({
            username: 'admin',
            email: 'admin@sgxy.edu.cn',
            password: 'admin123', // 简单密码
            role: 'admin',
            is_blocked: false
          });

        if (error) {
          console.error('创建管理员失败:', error);
        } else {
          console.log('管理员账户创建成功');
        }
      }
    } catch (error) {
      console.error('检查管理员账户失败:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !userData) {
        console.error('登录失败:', error);
        return false;
      }

      if (userData.is_blocked) {
        alert('账户已被限制，请联系管理员');
        return false;
      }

      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        isBlocked: userData.is_blocked,
        createdAt: new Date(userData.created_at)
      };

      setUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // 检查用户名是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return { success: false, message: '用户名已存在' };
      }

      // 检查邮箱是否已存在
      const { data: existingEmail } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingEmail) {
        return { success: false, message: '邮箱已被注册' };
      }

      // 创建新用户
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password, // 简单存储密码
          role: 'member',
          is_blocked: false
        })
        .select()
        .single();

      if (error) {
        console.error('注册失败:', error);
        return { success: false, message: '注册失败：' + error.message };
      }

      return { success: true, message: '注册成功！请登录' };
    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, message: '注册失败，请重试' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};