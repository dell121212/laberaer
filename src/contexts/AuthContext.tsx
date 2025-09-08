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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 开始登录:', { username });

      // 硬编码的管理员账户验证
      if (username === 'admin' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@sgxy.edu.cn',
          role: 'admin',
          isBlocked: false,
          createdAt: new Date()
        };

        setUser(adminUser);
        localStorage.setItem('current_user', JSON.stringify(adminUser));
        console.log('✅ 管理员登录成功');
        return true;
      }

      // 使用service_role权限查询用户（绕过RLS）
      const { data: userData, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .limit(1);

      console.log('📊 数据库查询结果:', { userData, queryError });

      if (queryError) {
        console.error('❌ 查询错误:', queryError);
        return false;
      }

      if (!userData || userData.length === 0) {
        console.log('❌ 用户不存在');
        return false;
      }

      const userRecord = userData[0];

      // 验证密码
      if (userRecord.password !== password) {
        console.log('❌ 密码错误');
        return false;
      }

      if (userRecord.is_blocked) {
        console.log('❌ 用户被禁用');
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
      console.log('✅ 登录成功:', user);
      return true;

    } catch (error) {
      console.error('💥 登录异常:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('📝 开始注册:', { username, email });

      // 检查用户名是否已存在
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .limit(1);

      if (userCheckError) {
        console.error('❌ 检查用户名失败:', userCheckError);
        return { success: false, message: '检查用户名失败' };
      }

      if (existingUser && existingUser.length > 0) {
        return { success: false, message: '用户名已存在' };
      }

      // 检查邮箱是否已存在
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .limit(1);

      if (emailCheckError) {
        console.error('❌ 检查邮箱失败:', emailCheckError);
        return { success: false, message: '检查邮箱失败' };
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
        .select()
        .single();

      if (insertError) {
        console.error('❌ 创建用户失败:', insertError);
        return { success: false, message: '注册失败: ' + insertError.message };
      }

      console.log('✅ 注册成功:', newUser);
      return { success: true, message: '注册成功！请登录' };

    } catch (error) {
      console.error('💥 注册异常:', error);
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