import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { validateEmail, generateVerificationCode, sendVerificationEmail, storeVerificationCode, verifyCode } from '../utils/emailValidation';
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

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
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
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
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
    localStorage.setItem('users', JSON.stringify(users));
    setPendingRegistration(null);
    return { success: true, message: '注册成功' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
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