import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  validateEmail, 
  generateVerificationCode, 
  sendVerificationEmail,
  codeManager 
} from '../utils/emailService';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingRegistration, setPendingRegistration] = useState<{
    username: string;
    email: string;
    password: string;
  } | null>(null);

  // 初始化时检查本地存储的用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('current_user');
      }
    }
  }, []);

  // 确保管理员账户存在
  const ensureAdminExists = async () => {
    try {
      // 检查管理员是否存在
      const { data: existingAdmin, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'admin')
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // 管理员不存在，创建管理员账户
        console.log('创建管理员账户...');
        const { data: newAdmin, error: createError } = await supabase
          .from('users')
          .insert({
            username: 'admin',
            email: 'admin@sgxy.edu.cn',
            password: 'admin',
            role: 'admin'
          })
          .select()
          .single();

        if (createError) {
          console.error('创建管理员失败:', createError);
        } else {
          console.log('管理员账户创建成功:', newAdmin);
        }
      } else if (existingAdmin) {
        console.log('管理员账户已存在:', existingAdmin);
      }
    } catch (error) {
      console.error('检查管理员账户时出错:', error);
    }
  };

  // 初始化时确保管理员存在
  useEffect(() => {
    ensureAdminExists();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('尝试登录:', { username });
      
      // 查询用户
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .single();

      console.log('数据库查询结果:', { userData, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('用户不存在');
          return false;
        }
        console.error('数据库查询错误:', error);
        return false;
      }

      if (!userData) {
        console.log('用户数据为空');
        return false;
      }

      if (userData.password !== password.trim()) {
        console.log('密码错误');
        return false;
      }

      if (userData.is_blocked) {
        throw new Error('账户已被限制登录，请联系管理员');
      }

      // 转换数据格式
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        isBlocked: userData.is_blocked || false,
        createdAt: new Date(userData.created_at)
      };

      console.log('登录成功:', user);
      setUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const sendVerificationCode = async (email: string): Promise<boolean> => {
    if (!validateEmail(email)) {
      return false;
    }
    
    // 检查是否可以重新发送
    const { canSend, waitTime } = codeManager.canResend(email);
    if (!canSend) {
      alert(`请等待 ${waitTime} 秒后再重新发送验证码`);
      return false;
    }
    
    const code = generateVerificationCode();
    const success = await sendVerificationEmail(email, code, '用户');
    
    if (success) {
      codeManager.storeCode(email, code);
    }
    
    return success;
  };

  const register = async (username: string, email: string, password: string, verificationCode?: string): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, message: '邮箱格式不正确' };
      }
      
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
        return { success: false, message: '该邮箱已被注册' };
      }

      // 如果没有提供验证码，发送验证码
      if (!verificationCode) {
        const codeSent = await sendVerificationCode(email);
        if (codeSent) {
          setPendingRegistration({ username, email, password });
          return { success: false, needsVerification: true, message: '验证码已发送到您的邮箱' };
        } else {
          return { success: false, message: '验证码发送失败，请重试' };
        }
      }

      // 验证验证码
      const verifyResult = codeManager.verifyCode(email, verificationCode);
      if (!verifyResult.success) {
        return { success: false, message: verifyResult.message };
      }

      // 创建新用户 - 使用 RPC 函数绕过 RLS
      const { data: newUser, error } = await supabase
        .rpc('create_user', {
          p_username: username,
          p_email: email,
          p_password: password,
          p_role: 'member'
        });

      if (error) {
        console.error('注册错误:', error);
        return { success: false, message: '注册失败，请重试' };
      }

      setPendingRegistration(null);
      return { success: true, message: '注册成功' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: '注册失败，请重试' };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  const completePendingRegistration = async (verificationCode: string): Promise<{ success: boolean; message: string }> => {
    if (!pendingRegistration) {
      return { success: false, message: '没有待验证的注册信息' };
    }

    const result = await register(
      pendingRegistration.username,
      pendingRegistration.email,
      pendingRegistration.password,
      verificationCode
    );

    return { success: result.success, message: result.message || '' };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      sendVerificationCode,
      completePendingRegistration,
      pendingRegistration: !!pendingRegistration
    }}>
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