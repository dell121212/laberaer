import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // 获取所有用户数据
  const getAllUsers = (): User[] => {
    try {
      const users = localStorage.getItem('global_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  };

  // 保存用户数据
  const saveUser = (userData: User) => {
    const users = getAllUsers();
    const existingIndex = users.findIndex(u => u.id === userData.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    
    localStorage.setItem('global_users', JSON.stringify(users));
  };

  // 初始化管理员账户
  const initializeAdmin = () => {
    const users = getAllUsers();
    const adminExists = users.find(u => u.username === 'admin');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@sgxy.edu.cn',
        password: 'admin',
        role: 'admin',
        isBlocked: false,
        createdAt: new Date()
      };
      
      saveUser(adminUser);
      console.log('管理员账户已创建');
    }
  };

  // 初始化时创建管理员账户
  useEffect(() => {
    initializeAdmin();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('尝试登录:', { username, password });
      
      const users = getAllUsers();
      const user = users.find(u => u.username.trim() === username.trim());
      
      console.log('找到用户:', user);
      
      if (!user) {
        console.log('用户不存在');
        return false;
      }

      if (user.password !== password.trim()) {
        console.log('密码错误');
        return false;
      }

      if (user.isBlocked) {
        throw new Error('账户已被限制登录，请联系管理员');
      }

      console.log('登录成功');
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
      
      const users = getAllUsers();
      
      // 检查用户名是否已存在
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return { success: false, message: '用户名已存在' };
      }

      // 检查邮箱是否已存在
      const existingEmail = users.find(u => u.email === email);
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

      // 创建新用户
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        email,
        password,
        role: 'member',
        isBlocked: false,
        createdAt: new Date()
      };

      saveUser(newUser);
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