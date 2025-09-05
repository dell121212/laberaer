import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { validateEmail, generateVerificationCode, sendVerificationEmail, storeVerificationCode, verifyCode } from '../utils/emailValidation';
import { User, AuthContextType } from '../types';

// 创建全局用户存储
const GLOBAL_USERS_KEY = 'global_users';
const CURRENT_USER_KEY = 'current_user';

const getGlobalUsers = (): User[] => {
  try {
    const users = localStorage.getItem(GLOBAL_USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const setGlobalUsers = (users: User[]) => {
  localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(users));
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingRegistration, setPendingRegistration] = useState<{
    username: string;
    email: string;
    password: string;
    verificationCode: string;
  } | null>(null);

  // 初始化管理员账户
  useEffect(() => {
    const users = getGlobalUsers();
    const adminExists = users.some(u => u.username === 'admin');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@sgxy.edu.cn',
        password: 'admin',
        role: 'admin',
        createdAt: new Date()
      };
      users.push(adminUser);
      setGlobalUsers(users);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = getGlobalUsers();
    const foundUser = users.find((u: User) => u.username === username && u.password === password);
    
    if (foundUser && !foundUser.isBlocked) {
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      return true;
    } else if (foundUser && foundUser.isBlocked) {
      throw new Error('账户已被限制登录，请联系管理员');
    }
    return false;
  };

  const sendVerificationCode = async (email: string): Promise<boolean> => {
    if (!validateEmail(email)) {
      return false;
    }
    
    const code = generateVerificationCode();
    const success = await sendVerificationEmail(email, code);
    
    if (success) {
      storeVerificationCode(email, code);
    }
    
    return success;
  };

  const register = async (username: string, email: string, password: string, verificationCode?: string): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    if (!validateEmail(email)) {
      return { success: false, message: '邮箱格式不正确' };
    }
    
    const users = getGlobalUsers();
    
    if (users.some((u: User) => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }
    
    if (users.some((u: User) => u.email === email)) {
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
    if (!verifyCode(email, verificationCode)) {
      return { success: false, message: '验证码错误或已过期' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role: 'member', // 所有新用户默认为普通成员
      createdAt: new Date()
    };

    users.push(newUser);
    setGlobalUsers(users);
    setPendingRegistration(null);
    return { success: true, message: '注册成功' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
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