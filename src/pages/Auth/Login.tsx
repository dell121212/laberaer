import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { codeManager } from '../../utils/emailService';
import { LogIn, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [resendCooldown, setResendCooldown] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { login, register, completePendingRegistration, pendingRegistration, sendVerificationCode } = useAuth();
  const navigate = useNavigate();

  // 团队展示图片（模拟数据，后续可替换为真实图片）
  const teamSlides = [
    {
      image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: '实验室环境',
      description: '现代化的实验设备和舒适的研究环境'
    },
    {
      image: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: '团队合作',
      description: '专业的研究团队，致力于食用菌创新研究'
    },
    {
      image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: '科研成果',
      description: '丰富的研究成果和学术论文发表'
    },
    {
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: '菌种培养',
      description: '专业的菌种保藏和培养技术'
    }
  ];

  // 重发验证码冷却计时器
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // 自动轮播
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [teamSlides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(username, password);
        if (success) {
          navigate('/lab');
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
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    // 检查是否可以重新发送
    const { canSend, waitTime } = codeManager.canResend(email);
    if (!canSend) {
      setError(`请等待 ${waitTime} 秒后再重新发送验证码`);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await sendVerificationCode(email);
      if (success) {
        setSuccess('验证码已重新发送到您的邮箱');
        setResendCooldown(60);
      } else {
        setError('验证码发送失败，请重试');
      }
    } catch (err) {
      setError('验证码发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamSlides.length) % teamSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-secondary-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="modern-card w-full max-w-md lg:max-w-2xl p-6 lg:p-8 animate-bounce-in relative z-10 shadow-2xl">
        {/* 团队展示轮播 */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="relative w-full h-48 lg:h-64 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {teamSlides.map((slide, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  <img 
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{slide.title}</h3>
                    <p className="text-sm opacity-90">{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 轮播控制按钮 */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* 轮播指示器 */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {teamSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2 animate-slide-in-left">🏫 韶关学院</h1>
          <h2 className="text-lg lg:text-xl font-semibold text-secondary-800 mb-2 animate-slide-in-right">🍄 食用菌创新团队</h2>
          <p className="text-sm lg:text-base text-secondary-600">🔬 科研创新 · 🤝 团队协作 · 📚 知识传承</p>
          
          {/* 邮箱验证提示 */}
          {!isLogin && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                📧 注册需要邮箱验证，验证码将通过弹窗显示
              </p>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-lg lg:text-xl font-semibold text-secondary-800 mb-2">
            {isLogin ? '登录系统' : '注册账号'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              👤 
              用户名
            </label>
            <p className="text-xs text-secondary-500 mb-2">用户名请输入姓名</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modern-input"
              placeholder="请输入您的真实姓名"
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
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || loading}
                  className="text-xs text-primary-600 hover:text-primary-700 disabled:text-secondary-400 
                           disabled:cursor-not-allowed transition-colors"
                >
                  {resendCooldown > 0 ? `重新发送 (${resendCooldown}s)` : '重新发送验证码'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-error-600 text-sm bg-error-50 p-3 rounded-xl border border-error-200 animate-slide-up">
              ❌ {error}
              <div className="mt-2 text-xs text-error-500">
                调试信息：请检查浏览器控制台查看详细错误
              </div>
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