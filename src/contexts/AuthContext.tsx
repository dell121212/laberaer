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
    verificationCode: string;
  } | null>(null);

  // 检查用户登录状态
  useEffect(() => {
    const checkUser = async () => {
      // 确保管理员账户存在
      await ensureAdminUser();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // 从数据库获取用户详细信息
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (userData) {
          const userObj: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: userData.role as 'admin' | 'member',
            isBlocked: userData.is_blocked,
            createdAt: new Date(userData.created_at)
          };
          setUser(userObj);
        }
      }
    };

    checkUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (userData) {
          const userObj: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: userData.role as 'admin' | 'member',
            isBlocked: userData.is_blocked,
            createdAt: new Date(userData.created_at)
          };
          setUser(userObj);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 确保管理员账户存在
  const ensureAdminUser = async () => {
    try {
      // 检查管理员账户是否存在
      const { data: adminExists } = await supabase
        .from('users')
        .select('id')
        .eq('username', 'admin')
        .single();

      if (!adminExists) {
        // 创建管理员账户
        const { error } = await supabase
          .from('users')
          .insert({
            username: 'admin',
            email: 'admin@sgxy.edu.cn',
            password: 'admin',
            role: 'admin',
            is_blocked: false
          });

        if (error) {
          console.error('创建管理员账户失败:', error);
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
      // 特殊处理管理员账户
      if (username === 'admin' && password === 'admin') {
        // 直接从数据库获取管理员信息
        const { data: adminData, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', 'admin')
          .single();

        if (adminData) {
          const userObj: User = {
            id: adminData.id,
            username: adminData.username,
            email: adminData.email,
            password: adminData.password,
            role: adminData.role as 'admin' | 'member',
            isBlocked: adminData.is_blocked,
            createdAt: new Date(adminData.created_at)
          };
          setUser(userObj);
          return true;
        }
      }

      // 从数据库查找用户
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !userData) {
        return false;
      }

      if (userData.is_blocked) {
        throw new Error('账户已被限制登录，请联系管理员');
      }

      // 使用Supabase Auth登录
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      });

      if (signInError) {
        // 如果Supabase Auth中没有该用户，创建一个
        const { error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: password
        });

        if (signUpError) {
          console.error('Auth signup error:', signUpError);
          return false;
        }
      }

      const userObj: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role as 'admin' | 'member',
        isBlocked: userData.is_blocked,
        createdAt: new Date(userData.created_at)
      };

      setUser(userObj);
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
      // 检查Supabase配置
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://your-project-ref.supabase.co') {
        return { 
          success: false, 
          message: '系统配置未完成，请联系管理员配置Supabase数据库连接' 
        };
      }

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
          setPendingRegistration({ username, email, password, verificationCode: '' });
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

      // 在数据库中创建用户
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password,
          role: 'member'
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        return { success: false, message: '注册失败，请重试' };
      }

      // 在Supabase Auth中创建用户
      const { error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        // 即使Auth注册失败，数据库中的用户记录仍然有效
      }

      setPendingRegistration(null);
      return { success: true, message: '注册成功' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: '注册失败，请重试' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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