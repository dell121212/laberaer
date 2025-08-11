import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, completePendingRegistration, pendingRegistration } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(username, password);
        if (success) {
          navigate('/home');
        } else {
          setError('用户名或密码错误');
        }
      } else {
        if (showVerification || pendingRegistration) {
          // 完成验证码验证
          const result = await completePendingRegistration(verificationCode);
          if (result.success) {
            setSuccess('注册成功！请登录');
            setShowVerification(false);
            setIsLogin(true);
            setUsername('');
            setEmail('');
            setPassword('');
            setVerificationCode('');
          } else {
            setError(result.message);
          }
        } else {
          // 发送验证码
          const result = await register(username, email, password);
          if (result.success) {
            setSuccess('注册成功！请登录');
            setIsLogin(true);
            setUsername('');
            setEmail('');
            setPassword('');
          } else if (result.needsVerification) {
            setShowVerification(true);
            setSuccess(result.message || '');
            setError('');
          } else {
            setError(result.message || '注册失败');
          }
        }
      }
    } catch (err) {
      setError('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-secondary-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="modern-card w-full max-w-md p-8 animate-bounce-in relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-large pulse-glow">
            <LogIn className="text-white animate-pulse" size={36} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2 animate-slide-in-left">🏫 韶关学院</h1>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2 animate-slide-in-right">🍄 食用菌创新团队</h2>
          <p className="text-secondary-600">🔬 科研创新 · 🤝 团队协作 · 📚 知识传承</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              👤 
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modern-input"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                📧 
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modern-input"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              🔒 
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modern-input"
              required
            />
          </div>

          {(!isLogin && (showVerification || pendingRegistration)) && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                🔢 
                验证码
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="modern-input"
                placeholder="请输入邮箱收到的验证码"
                required
              />
              <p className="text-xs text-secondary-500 mt-1">
                验证码已发送到您的邮箱，请查收（5分钟内有效）
              </p>
            </div>
          )}

          {error && (
            <div className="text-error-600 text-sm bg-error-50 p-3 rounded-xl border border-error-200 animate-slide-up">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="text-success-600 text-sm bg-success-50 p-3 rounded-xl border border-success-200 animate-slide-up">
              ✅ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 shadow-glow-hover"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? '登录' : (showVerification || pendingRegistration) ? '验证并注册' : '发送验证码'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowVerification(false);
              setError('');
              setSuccess('');
              setVerificationCode('');
            }}
            className="text-secondary-600 hover:text-primary-600 text-sm font-medium transition-colors"
          >
            {isLogin ? '没有账号？立即注册' : (showVerification || pendingRegistration) ? '返回登录' : '已有账号？返回登录'}
          </button>
        </div>
        
        {/* 底部信息 */}
        <div className="mt-8 pt-6 border-t border-secondary-200 text-center text-xs text-secondary-500">
          <p>💻 制作人：陈凯 | 👨‍🏫 指导老师：刘主</p>
        </div>
      </div>
    </div>
  );
};

export default Login;