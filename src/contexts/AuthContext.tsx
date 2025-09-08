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
        localStorage.removeItem('current_user');
      }
    }
    setLoading(false);
  }, []);

  const createAdminIfNotExists = async () => {
    try {
      // 检查admin用户是否存在
      const { data: existingAdmin } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'admin');

      if (!existingAdmin || existingAdmin.length === 0) {
        // 创建admin用户
        const { error } = await supabase
          .from('users')
          .insert({
            username: 'admin',
            email: 'admin@sgxy.edu.cn',
            password: 'admin123',
            role: 'admin',
            is_blocked: false
          });

        if (error) {
          console.log('创建admin用户失败，可能已存在:', error.message);
        } else {
          console.log('成功创建admin用户');
        }
      }
    } catch (error) {
      console.log('检查/创建admin用户时出错:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('开始登录流程:', { username });

      // 先尝试创建admin用户（如果不存在）
      if (username === 'admin') {
        await createAdminIfNotExists();
      }

      // 查询用户
      const { data: userData, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);

      console.log('用户查询结果:', { userData, queryError });

      if (queryError) {
        console.error('查询用户失败:', queryError);
        return false;
      }

      if (!userData || userData.length === 0) {
        console.log('用户不存在');
        return false;
      }

      const userRecord = userData[0];

      // 验证密码
      if (userRecord.password !== password) {
        console.log('密码错误');
        return false;
      }

      if (userRecord.is_blocked) {
        console.log('用户被禁用');
        return false;
      }

      const user: User = {
        id: userRecord.id,
        username: userRecord.username,
        email: userRecord.email,
        role: userRecord.role,
        isBlocked: userRecord.is_blocked,
        createdAt: new Date(userRecord.created_at)
      };

      setUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      console.log('登录成功:', user);
      return true;
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('开始注册流程:', { username, email });

      // 检查用户名是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username);

      if (existingUser && existingUser.length > 0) {
        return { success: false, message: '用户名已存在' };
      }

      // 检查邮箱是否已存在
      const { data: existingEmail } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      if (existingEmail && existingEmail.length > 0) {
        return { success: false, message: '邮箱已被注册' };
      }

      // 创建新用户
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password,
          role: 'member',
          is_blocked: false
        })
        .select();

      if (insertError) {
        console.error('创建用户失败:', insertError);
        return { success: false, message: '注册失败: ' + insertError.message };
      }

      console.log('注册成功:', newUser);
      return { success: true, message: '注册成功！请登录' };
    } catch (error) {
      console.error('注册过程中发生错误:', error);
      return { success: false, message: '注册失败: ' + (error as Error).message };
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