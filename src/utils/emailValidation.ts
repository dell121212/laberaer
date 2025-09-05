// 这个文件已被 emailService.ts 替代
// 保留此文件以防止导入错误，但所有功能已迁移到 emailService.ts

export { 
  validateEmail, 
  generateVerificationCode, 
  sendVerificationEmail,
  codeManager as verificationCodeManager 
} from './emailService';

// 兼容性函数
export const storeVerificationCode = (email: string, code: string) => {
  const { codeManager } = require('./emailService');
  codeManager.storeCode(email, code);
};

export const verifyCode = (email: string, inputCode: string): boolean => {
  const { codeManager } = require('./emailService');
  const result = codeManager.verifyCode(email, inputCode);
  return result.success;
};