import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Users, FlaskConical, BookOpen, Activity, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { strains, members, dutySchedules, media, theses, activityLogs } = useApp();

  // 获取今日值日安排
  const today = new Date().toISOString().split('T')[0];
  const todayDuty = dutySchedules.find(schedule => schedule.date === today);

  // 获取最近30天的活动记录
  const recentLogs = activityLogs.slice(0, 5);

  // 统计数据
  const totalRecords = strains.length + members.length + media.length + theses.length;
  const recentActivities = activityLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return logDate >= thirtyDaysAgo;
  }).length;

  const quickAccessCards = [
    {
      title: '菌种保藏',
      icon: FlaskConical,
      count: strains.length,
      recent: strains.length > 0 ? `最新: ${strains[0].name}` : '暂无数据',
      path: '/strains',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: '成员名单',
      icon: Users,
      count: members.length,
      recent: members.length > 0 ? `最新: ${members[0].name}` : '暂无数据',
      path: '/members',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: '培养基推荐',
      icon: FlaskConical,
      count: media.length,
      recent: media.length > 0 ? `最新: ${media[0].name}` : '暂无数据',
      path: '/media',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: '历届毕业论文',
      icon: BookOpen,
      count: theses.length,
      recent: theses.length > 0 ? `最新: ${theses[0].title}` : '暂无数据',
      path: '/theses',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen pb-20 safe-area-padding relative overflow-hidden">
      {/* 粒子背景效果 */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* 主要内容 */}
      <div className="relative p-4 sm:p-6 pb-6 sm:pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full 
                       -translate-y-16 translate-x-16 sm:-translate-y-20 sm:translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full 
                       translate-y-12 -translate-x-12 sm:translate-y-16 sm:-translate-x-16 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10">
          {/* 头部欢迎区域 */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="animate-slide-in-left">
              <h1 className="cyber-text-xl font-bold animate-slide-in-left gradient-text-cyber">🧪 实验室</h1>
              <p className="text-white/80 text-sm sm:text-base">{user?.username}</p>
            </div>
            <div className="text-right animate-slide-in-right">
              <div 
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110"
                style={{ animationDelay: '0.3s' }}
              >
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 mb-1" />
                <p className="text-xs sm:text-sm text-white/60">今天是</p>
                <p className="text-sm sm:text-base font-medium text-white">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* 快速访问卡片 */}
          <div className="cyber-grid-2 mb-6 sm:mb-8">
            {quickAccessCards.map((card, index) => (
              <div 
                key={card.title}
                className="glass-card cursor-pointer animate-fade-in-up card-hover-effect group touch-target" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`p-3 sm:p-4 bg-gradient-to-r ${card.gradient} text-white rounded-lg sm:rounded-xl 
                               shadow-lg group-hover:neon-glow transition-all duration-500 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
                    <card.icon 
                      className="sm:w-5 sm:h-5 text-white group-hover:scale-125 transition-transform duration-500 relative z-10" 
                    />
                    <div 
                      className="sm:w-4 sm:h-4 text-white/40 group-hover:text-purple-400 
                               group-hover:translate-x-2 transition-all duration-500" 
                    />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1 
                               group-hover:gradient-text-cyber transition-all duration-500 text-white">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg sm:text-xl font-bold text-white/90">{card.count}</span>
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="font-semibold text-sm sm:text-base text-white/90 mb-1 
                               group-hover:text-white transition-colors duration-500">
                    {card.title}
                  </h3>
                  <p className="text-xs text-white/60 truncate leading-tight group-hover:text-white/80 transition-colors duration-300">{card.recent}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 今日值日提醒 */}
          {todayDuty && (
            <div className="glass-card bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30 pulse-glow">
              <h3 className="font-semibold text-sm sm:text-base text-white mb-2 
                           animate-slide-in-left flex items-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                今日值日安排
              </h3>
              <div className="space-y-2">
                <p className="text-white/90 text-sm sm:text-base">
                  值日人员: {todayDuty.members.join(', ')}
                </p>
                <p className="text-white/80 text-xs sm:text-sm">
                  任务: {todayDuty.tasks.join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs ${
                    todayDuty.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                    todayDuty.status === 'skipped' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                    'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                  }`}>
                    {todayDuty.status === 'completed' ? '已完成' : 
                     todayDuty.status === 'skipped' ? '已跳过' : '待完成'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 系统管理快捷入口 */}
          {user?.role === 'admin' && (
            <div 
              className="glass-card cursor-pointer bg-gradient-to-r from-purple-500/20 to-pink-500/20
                         border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30
                         transition-all duration-500 card-hover-effect group touch-target neon-glow"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-pink-600 
                                 text-white rounded-lg sm:rounded-xl group-hover:neon-glow 
                                 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Activity 
                      className="sm:w-5 sm:h-5 group-hover:scale-125 transition-transform duration-500 relative z-10" 
                    />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h3 className="font-semibold text-sm sm:text-base text-white 
                                 group-hover:gradient-text-cyber transition-all duration-500">
                      系统管理
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm">管理系统用户和权限</p>
                  </div>
                </div>
                <div 
                  className="sm:w-4 sm:h-4 text-white/60 group-hover:text-purple-400 group-hover:translate-x-2 
                           transition-all duration-500" 
                />
              </div>
            </div>
          )}

          {/* 数据统计 */}
          <h2 className="cyber-text-lg font-semibold text-white mb-3 sm:mb-4 
                       animate-slide-in-left gradient-text-cyber" 
              style={{ animationDelay: '0.4s' }}>
            📊 数据概览
          </h2>
          <div className="cyber-grid-2 mb-6 sm:mb-8">
            <div className="glass-card text-center card-hover-effect group touch-target">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-400 to-emerald-500 
                               text-white rounded-lg group-hover:neon-glow 
                               transition-all duration-500">
                  <Activity 
                    className="sm:w-4 sm:h-4 group-hover:scale-125 transition-transform duration-500" 
                  />
                </div>
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-white 
                             group-hover:gradient-text-cyber transition-all duration-500">
                  {totalRecords}
                </p>
                <p className="text-xs text-white/60">总数据量</p>
              </div>
            </div>
            <div className="glass-card text-center card-hover-effect group touch-target">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-400 to-purple-500 
                               text-white rounded-lg group-hover:neon-glow 
                               transition-all duration-500">
                  <Clock 
                    className="sm:w-4 sm:h-4 group-hover:scale-125 transition-transform duration-500" 
                  />
                </div>
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-white 
                             group-hover:gradient-text-cyber transition-all duration-500">
                  {recentActivities}
                </p>
                <p className="text-xs text-white/60">30天活动</p>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <h2 className="cyber-text-lg font-semibold text-white mb-3 sm:mb-4 
                       animate-slide-in-left gradient-text-cyber" 
              style={{ animationDelay: '0.5s' }}>
            🕒 最近活动
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {recentLogs.map((log, index) => (
              <div key={log.id} className="glass-card card-hover-effect group touch-target">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-gray-400 to-gray-500 
                                 text-white rounded-lg group-hover:neon-glow 
                                 transition-all duration-500">
                    <Activity 
                      className="sm:w-3.5 sm:h-3.5 group-hover:scale-125 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-white/90 
                                 group-hover:text-white transition-colors duration-500">
                      {log.details}
                    </p>
                    <p className="text-xs text-white/60 leading-tight">
                      {log.username} • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="text-center py-4 sm:py-6 border-t border-white/20">
            <p className="text-xs text-white/60 leading-relaxed">
              🧬 实验室管理系统 • 让科研更高效
            </p>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              Version 2.0 • Made with ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;