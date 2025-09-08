import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, UserPlus, Heart, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
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
        const result = await register(username, email, password);
        if (result.success) {
          setSuccess('注册成功！请登录');
          setIsLogin(true);
          setUsername('');
          setEmail('');
          setPassword('');
        } else {
          setError(result.message || '注册失败');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* 可爱的背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl emoji-bounce">🌸</div>
        <div className="absolute top-20 right-20 text-4xl emoji-bounce" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="absolute bottom-20 left-20 text-5xl emoji-bounce" style={{animationDelay: '1s'}}>🦄</div>
        <div className="absolute bottom-10 right-10 text-3xl emoji-bounce" style={{animationDelay: '1.5s'}}>💖</div>
        <div className="absolute top-1/2 left-1/4 text-2xl emoji-bounce" style={{animationDelay: '2s'}}>🌈</div>
        <div className="absolute top-1/3 right-1/3 text-4xl emoji-bounce" style={{animationDelay: '2.5s'}}>🎀</div>
      </div>

      <div className="cute-card w-full max-w-md bounce-in cute-shadow">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-2">
              🏫 韶关学院
              <Heart className="text-pink-500 animate-pulse-cute" size={24} />
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-purple-600 mb-2 flex items-center justify-center gap-2">
            🍄 食用菌创新团队
            <Sparkles className="text-yellow-500 animate-wiggle" size={20} />
          </h2>
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <span className="emoji-bounce">🔬</span> 科研创新 
            <span className="emoji-bounce" style={{animationDelay: '0.3s'}}>🤝</span> 团队协作 
            <span className="emoji-bounce" style={{animationDelay: '0.6s'}}>📚</span> 知识传承
          </p>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
            {isLogin ? (
              <>
                <span className="emoji-bounce">🔑</span> 登录系统
              </>
            ) : (
              <>
                <span className="emoji-bounce">🌟</span> 注册账号
              </>
            )}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span className="emoji-bounce">👤</span> 用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="cute-input"
              placeholder="请输入您的真实姓名"
              required
            />
          </div>

          {!isLogin && (
            <div className="slide-up">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <span className="emoji-bounce">📧</span> 邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cute-input"
                placeholder="请输入邮箱地址"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span className="emoji-bounce">🔒</span> 密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cute-input"
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200 bounce-in">
              <span className="emoji-bounce">❌</span> {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-xl border border-green-200 bounce-in">
              <span className="emoji-bounce">✅</span> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cute-button flex items-center justify-center gap-2 cute-hover"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span className="loading-dots">处理中</span>
              </div>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? '登录' : '注册'}
                <span className="emoji-bounce">{isLogin ? '🚀' : '🌟'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium cute-hover inline-flex items-center gap-2"
          >
            {isLogin ? (
              <>
                <span className="emoji-bounce">🌈</span> 没有账号？立即注册
              </>
            ) : (
              <>
                <span className="emoji-bounce">💫</span> 已有账号？返回登录
              </>
            )}
          </button>
        </div>
        
        {/* 底部信息 */}
        <div className="mt-8 pt-6 border-t border-pink-200 text-center text-xs text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span className="emoji-bounce">💻</span> 制作人：陈凯 
            <span className="emoji-bounce" style={{animationDelay: '0.5s'}}>👨‍🏫</span> 指导老师：刘主
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;