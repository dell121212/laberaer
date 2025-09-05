import emailjs from 'emailjs-com';

// EmailJS 配置
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ov4ajko';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_verification';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'dM_PUilQ-JgdKdyAP';

// 初始化 EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// 邮箱验证
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 生成6位数字验证码
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送验证邮件
export const sendVerificationEmail = async (email: string, code: string, username: string): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: email,
      to_name: username,
      verification_code: code,
      from_name: '韶关学院食用菌创新团队',
      message: `您的验证码是：${code}，有效期为5分钟。请勿将验证码告诉他人。`,
      reply_to: 'noreply@sgxy.edu.cn'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('邮件发送成功:', response);
    return response.status === 200;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
};

// 验证码存储管理
class VerificationCodeManager {
  private codes = new Map<string, { code: string; timestamp: number; attempts: number }>();
  private readonly EXPIRY_TIME = 5 * 60 * 1000; // 5分钟
  private readonly MAX_ATTEMPTS = 3; // 最大尝试次数

  // 存储验证码
  storeCode(email: string, code: string): void {
    this.codes.set(email, {
      code,
      timestamp: Date.now(),
      attempts: 0
    });
  }

  // 验证验证码
  verifyCode(email: string, inputCode: string): { success: boolean; message: string } {
    const stored = this.codes.get(email);
    
    if (!stored) {
      return { success: false, message: '验证码不存在或已过期' };
    }

    // 检查是否过期
    if (Date.now() - stored.timestamp > this.EXPIRY_TIME) {
      this.codes.delete(email);
      return { success: false, message: '验证码已过期，请重新获取' };
    }

    // 检查尝试次数
    if (stored.attempts >= this.MAX_ATTEMPTS) {
      this.codes.delete(email);
      return { success: false, message: '验证码尝试次数过多，请重新获取' };
    }

    // 验证码错误
    if (stored.code !== inputCode.trim()) {
      stored.attempts++;
      return { 
        success: false, 
        message: `验证码错误，还可尝试 ${this.MAX_ATTEMPTS - stored.attempts} 次` 
      };
    }

    // 验证成功，删除验证码
    this.codes.delete(email);
    return { success: true, message: '验证成功' };
  }

  // 清理过期验证码
  cleanup(): void {
    const now = Date.now();
    for (const [email, data] of this.codes.entries()) {
      if (now - data.timestamp > this.EXPIRY_TIME) {
        this.codes.delete(email);
      }
    }
  }

  // 检查是否可以重新发送
  canResend(email: string): { canSend: boolean; waitTime: number } {
    const stored = this.codes.get(email);
    if (!stored) {
      return { canSend: true, waitTime: 0 };
    }

    const elapsed = Date.now() - stored.timestamp;
    const minInterval = 60 * 1000; // 1分钟间隔

    if (elapsed < minInterval) {
      return { 
        canSend: false, 
        waitTime: Math.ceil((minInterval - elapsed) / 1000) 
      };
    }

    return { canSend: true, waitTime: 0 };
  }
}

// 创建全局验证码管理器实例
export const codeManager = new VerificationCodeManager();

// 定期清理过期验证码
setInterval(() => {
  codeManager.cleanup();
}, 60 * 1000); // 每分钟清理一次