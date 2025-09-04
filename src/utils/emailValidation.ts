// 邮箱验证工具
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 生成验证码
export const generateVerificationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 模拟发送验证邮件（实际项目中需要后端支持）
export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  // 实际发送邮件的模拟实现
  console.log(`发送验证码到 ${email}: ${code}`);
  
  // 在控制台显示验证码供测试使用
  alert(`验证码已发送到 ${email}\n\n测试用验证码: ${code}\n\n(实际项目中验证码会发送到邮箱)`);
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟发送成功（实际项目中应该调用真实的邮件服务）
  return true;
};

// 验证码存储（实际项目中应该存储在后端）
const verificationCodes = new Map<string, { code: string; timestamp: number }>();

export const storeVerificationCode = (email: string, code: string) => {
  verificationCodes.set(email, {
    code,
    timestamp: Date.now()
  });
};

export const verifyCode = (email: string, inputCode: string): boolean => {
  const stored = verificationCodes.get(email);
  if (!stored) return false;
  
  // 验证码5分钟内有效
  const isExpired = Date.now() - stored.timestamp > 5 * 60 * 1000;
  if (isExpired) {
    verificationCodes.delete(email);
    return false;
  }
  
  const isValid = stored.code === inputCode.toUpperCase();
  if (isValid) {
    verificationCodes.delete(email);
  }
  
  return isValid;
};