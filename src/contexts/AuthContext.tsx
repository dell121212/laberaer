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
        console.log('从本地存储恢复用户:', userData);
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('开始登录流程:', { username, password: '***' });
      
      // 测试数据库连接
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      console.log('数据库连接测试:', { testData, testError });
      
      if (testError) {
        console.error('数据库连接失败:', testError);
        alert('数据库连接失败，请检查网络连接');
        return false;
      }

      // 查询用户
      const { data: userData, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      console.log('用户查询结果:', { userData, queryError });

      if (queryError) {
        console.error('查询用户失败:', queryError);
        alert('查询用户失败: ' + queryError.message);
        return false;
      }

      if (!userData || userData.length === 0) {
        console.log('用户名或密码错误');
        alert('用户名或密码错误');
        return false;
      }

      const userRecord = userData[0];
      console.log('找到用户记录:', userRecord);

      if (userRecord.is_blocked) {
        alert('账户已被限制，请联系管理员');
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
      alert('登录失败: ' + (error as Error).message);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('开始注册流程:', { username, email, password: '***' });

      // 检查用户名是否已存在
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username);

      console.log('用户名检查结果:', { existingUser, userCheckError });

      if (userCheckError) {
        console.error('检查用户名失败:', userCheckError);
        return { success: false, message: '检查用户名失败: ' + userCheckError.message };
      }

      if (existingUser && existingUser.length > 0) {
        return { success: false, message: '用户名已存在' };
      }

      // 检查邮箱是否已存在
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      console.log('邮箱检查结果:', { existingEmail, emailCheckError });

      if (emailCheckError) {
        console.error('检查邮箱失败:', emailCheckError);
        return { success: false, message: '检查邮箱失败: ' + emailCheckError.message };
      }

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

      console.log('用户创建结果:', { newUser, insertError });

      if (insertError) {
        console.error('创建用户失败:', insertError);
        return { success: false, message: '注册失败: ' + insertError.message };
      }

      if (!newUser || newUser.length === 0) {
        return { success: false, message: '注册失败，请重试' };
      }

      console.log('注册成功:', newUser[0]);
      return { success: true, message: '注册成功！请登录' };
    } catch (error) {
      console.error('注册过程中发生错误:', error);
      return { success: false, message: '注册失败: ' + (error as Error).message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    console.log('用户已登出');
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