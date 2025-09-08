import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FlaskConical, BookOpen, Activity, Clock, Beaker, GraduationCap, Shield, Sparkles, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { strains, members, dutySchedules, media, theses, activityLogs } = useApp();
  const navigate = useNavigate();

  // 获取今日值日安排
  const today = new Date().toISOString().split('T')[0];
  const todayDuty = dutySchedules.find(schedule => schedule.date === today);

  // 获取最近活动记录
  const recentLogs = activityLogs.slice(0, 5);

  // 统计数据
  const totalRecords = strains.length + members.length + media.length + theses.length;

  const quickAccessCards = [
    {
      title: '菌种保藏',
      icon: FlaskConical,
      count: strains.length,
      recent: strains.length > 0 ? `最新: ${strains[0].name}` : '暂无数据',
      path: '/strains',
      color: 'from-blue-400 to-cyan-500',
      emoji: '🧪'
    },
    {
      title: '成员名单',
      icon: Users,
      count: members.length,
      recent: members.length > 0 ? `最新: ${members[0].name}` : '暂无数据',
      path: '/members',
      color: 'from-sky-400 to-blue-500',
      emoji: '👥'
    },
    {
      title: '值日安排',
      icon: Calendar,
      count: dutySchedules.length,
      recent: dutySchedules.length > 0 ? `最新安排` : '暂无安排',
      path: '/duty',
      color: 'from-cyan-400 to-teal-500',
      emoji: '📅'
    },
    {
      title: '培养基推荐',
      icon: Beaker,
      count: media.length,
      recent: media.length > 0 ? `最新: ${media[0].name}` : '暂无数据',
      path: '/media',
      color: 'from-indigo-400 to-blue-500',
      emoji: '🧫'
    },
    {
      title: '历届毕业论文',
      icon: GraduationCap,
      count: theses.length,
      recent: theses.length > 0 ? `最新: ${theses[0].title.slice(0, 10)}...` : '暂无数据',
      path: '/theses',
      color: 'from-blue-500 to-indigo-500',
      emoji: '🎓'
    }
  ];

  return (
    <div className="min-h-screen animated-gradient pb-20 relative overflow-hidden">
      {/* 光粒子背景 */}
      <div className="particles-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* 可爱的背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-5 right-5 text-3xl floating-element text-blue-400">💙</div>
        <div className="absolute top-20 left-10 text-2xl floating-element text-cyan-400" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-40 right-20 text-4xl floating-element text-sky-400" style={{animationDelay: '2s'}}>🌊</div>
        <div className="absolute top-1/3 right-1/4 text-2xl floating-element text-blue-500" style={{animationDelay: '3s'}}>🔮</div>
      </div>

      {/* 头部欢迎区域 */}
      <div className="cute-card mx-4 mt-4 cute-shadow animate-shimmer">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <span className="emoji-bounce">🧪</span> 实验室管理系统
              <Sparkles className="text-cyan-500 animate-wiggle" size={20} />
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="emoji-bounce">👋</span> 欢迎回来，{user?.username}
              <Heart className="text-blue-500 animate-pulse-cute" size={16} />
            </p>
          </div>
          <div className="text-right">
            <div className="cute-card bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 mb-1 mx-auto animate-pulse-cute" />
              <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                <span className="emoji-bounce">📅</span> 今天是
              </p>
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* 快速访问卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickAccessCards.map((card, index) => (
            <div 
              key={card.title}
              className="cute-card cursor-pointer card-hover animate-glow"
              onClick={() => navigate(card.path)}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`p-3 bg-gradient-to-r ${card.color} text-white rounded-xl mb-3 relative overflow-hidden`}>
                <div className="absolute top-1 right-1 text-lg emoji-bounce">{card.emoji}</div>
                <card.icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                {card.title}
                <span className="text-xs emoji-bounce">✨</span>
              </h3>
              <p className="text-2xl font-bold gradient-text mb-1">{card.count}</p>
              <p className="text-xs text-gray-500 truncate">{card.recent}</p>
            </div>
          ))}
        </div>

        {/* 今日值日提醒 */}
        {todayDuty && (
          <div className="cute-card bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 mb-6 bounce-in">
            <h3 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="emoji-bounce">📋</span> 今日值日安排
              <span className="emoji-bounce" style={{animationDelay: '0.5s'}}>⭐</span>
            </h3>
            <div className="space-y-2">
              <p className="text-cyan-700 flex items-center gap-2">
                <span className="emoji-bounce">👥</span> 值日人员: {todayDuty.members.join(', ')}
              </p>
              <p className="text-cyan-600 text-sm flex items-center gap-2">
                <span className="emoji-bounce">✅</span> 任务: {todayDuty.tasks.join(', ')}
              </p>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                todayDuty.status === 'completed' ? 'bg-green-100 text-green-800' :
                todayDuty.status === 'skipped' ? 'bg-red-100 text-red-800' :
                'bg-cyan-100 text-cyan-800'
              }`}>
                <span className="emoji-bounce">
                  {todayDuty.status === 'completed' ? '✅' : 
                   todayDuty.status === 'skipped' ? '❌' : '⏰'}
                </span>
                {todayDuty.status === 'completed' ? '已完成' : 
                 todayDuty.status === 'skipped' ? '已跳过' : '待完成'}
              </span>
            </div>
          </div>
        )}

        {/* 系统管理快捷入口 */}
        {user?.role === 'admin' && (
          <div 
            className="cute-card cursor-pointer card-hover mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 animate-glow"
            onClick={() => navigate('/admin')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl relative">
                  <Shield size={24} />
                  <div className="absolute -top-1 -right-1 text-sm emoji-bounce">👑</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="emoji-bounce">⚙️</span> 系统管理
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <span className="emoji-bounce">🔧</span> 管理系统用户和权限
                  </p>
                </div>
              </div>
              <div className="text-2xl emoji-bounce">✨</div>
            </div>
          </div>
        )}

        {/* 数据统计 */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="emoji-bounce">📊</span> 数据概览
          <Sparkles className="text-cyan-500 animate-wiggle" size={16} />
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="cute-card text-center bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl">
                <Activity size={20} />
              </div>
              <div className="text-lg emoji-bounce ml-2">📈</div>
            </div>
            <p className="text-xl font-bold gradient-text">{totalRecords}</p>
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
              <span className="emoji-bounce">💾</span> 总数据量
            </p>
          </div>
          <div className="cute-card text-center bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl">
                <Clock size={20} />
              </div>
              <div className="text-lg emoji-bounce ml-2">⚡</div>
            </div>
            <p className="text-xl font-bold gradient-text">{recentLogs.length}</p>
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
              <span className="emoji-bounce">🕒</span> 最近活动
            </p>
          </div>
        </div>

        {/* 最近活动 */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="emoji-bounce">🕒</span> 最近活动
          <span className="emoji-bounce" style={{animationDelay: '0.5s'}}>✨</span>
        </h2>
        <div className="space-y-3">
          {recentLogs.map((log, index) => (
            <div key={log.id} className="cute-card slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 rounded-xl">
                  <Activity size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <span className="emoji-bounce">📝</span> {log.details}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="emoji-bounce">👤</span> {log.username} 
                    <span className="emoji-bounce">•</span> {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentLogs.length === 0 && (
          <div className="cute-card text-center py-8">
            <div className="text-6xl emoji-bounce mb-4">📝</div>
            <p className="text-gray-500 flex items-center justify-center gap-2">
              <span className="emoji-bounce">💤</span> 暂无活动记录
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;