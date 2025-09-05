import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../../components/Common/SearchBar';
import { 
  Beaker, 
  Users, 
  Calendar, 
  FlaskConical, 
  GraduationCap,
  Activity,
  Settings,
  TrendingUp,
  Clock,
  UserCheck,
  Sparkles,
  ChevronRight,
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import DutyReminderModal from '../../components/DutyReminderModal';

const Home: React.FC = () => {
  const { strains, members, dutySchedules, media, theses, activityLogs } = useApp();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDutyReminder, setShowDutyReminder] = useState(false);

  // 检查用户是否在成员名单中
  React.useEffect(() => {
    if (user) {
      const userInMembers = members.find(member => member.name === user.username);
      if (!userInMembers) {
        alert('您不在成员名单中，请联系管理员添加您的信息');
        navigate('/members');
        return;
      }

      // 检查今日值日安排
      const today = new Date();
      const todayDuty = dutySchedules.find(schedule => 
        schedule.date === format(today, 'yyyy-MM-dd') && 
        schedule.members.includes(user.username)
      );

      if (todayDuty && todayDuty.status === 'pending') {
        setShowDutyReminder(true);
      }
    }
  }, [user, members, dutySchedules, navigate]);
  const today = new Date();
  const todayDuty = dutySchedules.find(schedule => 
    schedule.date === format(today, 'yyyy-MM-dd')
  );

  const recentStrains = strains
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 3);

  const recentMembers = members
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    .slice(0, 3);

  const recentMedia = media
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  const recentTheses = theses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  const recentLogs = activityLogs
    .filter(log => {
      const logDate = new Date(log.timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return logDate >= thirtyDaysAgo;
    })
    .slice(0, 5);

  const moduleCards = [
    {
      title: '菌种保藏',
      count: strains.length,
      icon: Beaker,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      recent: recentStrains.length > 0 ? `最近添加：${recentStrains[0].name}` : '暂无数据',
      path: '/strains'
    },
    {
      title: '成员名单',
      count: members.length,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      recent: recentMembers.length > 0 ? `最近加入：${recentMembers[0].name}` : '暂无数据',
      path: '/members'
    },
    {
      title: '值日安排',
      count: dutySchedules.length,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      recent: todayDuty ? `今日值日：${todayDuty.members.join(', ')}` : '今日无值日安排',
      path: '/duty'
    },
    {
      title: '培养基推荐',
      count: media.length,
      icon: FlaskConical,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      recent: recentMedia.length > 0 ? `最新推荐：${recentMedia[0].name}` : '暂无数据',
      path: '/media'
    },
    {
      title: '历届毕业论文',
      count: theses.length,
      icon: GraduationCap,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      recent: recentTheses.length > 0 ? `最新论文：${recentTheses[0].title}` : '暂无数据',
      path: '/theses'
    },
    {
      title: '操作记录',
      count: recentLogs.length,
      icon: Activity,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      recent: recentLogs.length > 0 ? `最近操作：${recentLogs[0].action}` : '暂无记录',
      path: '/logs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800 pb-20 safe-area-padding transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 dark:from-primary-700 dark:via-primary-800 dark:to-accent-700 text-white 
                     p-4 sm:p-6 pb-6 sm:pb-8 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full 
                       -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full 
                       translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12"></div>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
            <div>
              <h1 className="responsive-text-xl font-bold animate-slide-in-left">🧪 实验室</h1>
              <p className="text-primary-100 text-sm sm:text-base">{user?.username}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 
                               text-xs rounded-full border border-white/30 animate-pulse-slow">
                  ✨ 
                  管理员
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                title={isDark ? '切换到白天模式' : '切换到夜间模式'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
            <div className="text-right animate-slide-in-right">
              <p className="text-xs sm:text-sm text-primary-200">今天是</p>
              <p className="font-medium text-sm sm:text-base">
                {format(today, 'MM月dd日 EEEE', { locale: zhCN })}
              </p>
            </div>
          </div>
          
          <div className="relative z-10">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜索菌种、成员、培养基..."
            />
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="max-w-md lg:max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 -mt-3 sm:-mt-4">
        <div className="responsive-grid-2 mb-6 sm:mb-8">
          {moduleCards.map((card, index) => (
            <div 
              key={card.title} 
              className="modern-card cursor-pointer animate-fade-in card-hover-effect group touch-target" 
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(card.path)}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${card.color} 
                               shadow-soft group-hover:shadow-glow transition-all duration-300`}>
                  <card.icon 
                    size={16} 
                    className="sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <ChevronRight 
                  size={14} 
                  className="sm:w-4 sm:h-4 text-secondary-400 group-hover:text-primary-500 
                           group-hover:translate-x-1 transition-all duration-300" 
                />
              </div>
              <div className="mb-1 sm:mb-2">
                <span className="text-xl sm:text-2xl font-bold text-secondary-900 
                               group-hover:gradient-text-enhanced transition-all duration-300">
                  {card.count}
                </span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-secondary-800 mb-1 
                           group-hover:text-secondary-900 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-xs text-secondary-600 truncate leading-tight">{card.recent}</p>
            </div>
          ))}
        </div>

        {/* Today's Duty */}
        {todayDuty && (
          <div className="mb-4 sm:mb-6">
            <div className="modern-card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/50 dark:to-primary-800/50 border-primary-200 dark:border-primary-700 pulse-glow">
              <h3 className="font-semibold text-sm sm:text-base text-primary-900 mb-2 
                           flex items-center gap-2 animate-pulse">
                🔔
                <UserCheck size={14} className="sm:w-4 sm:h-4" />
                今日值日提醒
              </h3>
              <div className="space-y-2">
                <p className="text-primary-800 text-sm sm:text-base">
                  值日人员：{todayDuty.members.join(', ')}
                </p>
                <p className="text-primary-700 text-xs sm:text-sm">
                  任务：{todayDuty.tasks.join(', ')}
                </p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs touch-target ${
                  todayDuty.status === 'completed' ? 'bg-success-100 text-success-800' :
                  todayDuty.status === 'skipped' ? 'bg-error-100 text-error-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  <Clock size={10} className="sm:w-3 sm:h-3" />
                  <span>
                    {todayDuty.status === 'completed' ? '已完成' : 
                     todayDuty.status === 'skipped' ? '已跳过' : '待执行'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}


      {/* 值日提醒弹窗 */}
      {showDutyReminder && (
        <DutyReminderModal
          onClose={() => setShowDutyReminder(false)}
          dutySchedule={dutySchedules.find(schedule => 
            schedule.date === format(new Date(), 'yyyy-MM-dd') && 
            schedule.members.includes(user?.username || '')
          )}
        />
      )}
        {/* Quick Stats */}
        <div className="mb-6 sm:mb-8">
          {/* Admin Panel Link */}
          {user?.role === 'admin' && (
            <div className="mb-4 sm:mb-6">
              <div 
                className="modern-card cursor-pointer bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/50 dark:to-accent-800/50
                         border-accent-200 dark:border-accent-700 hover:from-accent-100 hover:to-accent-200 dark:hover:from-accent-800/70 dark:hover:to-accent-700/70
                         transition-all duration-300 card-hover-effect group touch-target"
                onClick={() => navigate('/admin')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-accent-600 to-accent-700 
                                 text-white rounded-lg sm:rounded-xl group-hover:shadow-glow 
                                 transition-all duration-300">
                    <Shield 
                      size={16} 
                      className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-purple-900 
                                 dark:text-accent-100 group-hover:gradient-text-enhanced transition-all duration-300">
                      🛡️ 后台管理
                    </h3>
                    <p className="text-accent-700 dark:text-accent-300 text-xs sm:text-sm">管理系统用户和权限</p>
                  </div>
                  <ChevronRight
                    size={14} 
                    className="sm:w-4 sm:h-4 text-accent-600 dark:text-accent-400 group-hover:translate-x-1 
                             transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>
          )}

          <h2 className="responsive-text-lg font-semibold text-secondary-900 mb-3 sm:mb-4 
                       flex items-center gap-2">
            ✨
            <Sparkles size={16} className="sm:w-5 sm:h-5" />
            数据概览
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="modern-card text-center card-hover-effect group touch-target">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-success-100 to-success-200 
                               text-success-600 rounded-lg group-hover:shadow-glow 
                               transition-all duration-300">
                  <TrendingUp 
                    size={14} 
                    className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base sm:text-lg font-bold text-secondary-900 
                               group-hover:gradient-text-enhanced transition-all duration-300">
                    {strains.length + members.length + media.length + theses.length}
                  </p>
                  <p className="text-xs text-secondary-600">总数据量</p>
                </div>
              </div>
            </div>
            
            <div className="modern-card text-center card-hover-effect group touch-target">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary-100 to-primary-200 
                               text-primary-600 rounded-lg group-hover:shadow-glow 
                               transition-all duration-300">
                  <Activity 
                    size={14} 
                    className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base sm:text-lg font-bold text-secondary-900 
                               group-hover:gradient-text-enhanced transition-all duration-300">
                    {recentLogs.length}
                  </p>
                  <p className="text-xs text-secondary-600">30天活动</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6 sm:mb-8">
          <h2 className="responsive-text-lg font-semibold text-secondary-900 mb-3 sm:mb-4 
                       flex items-center gap-2">
            🕒 最近更新
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {recentLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="modern-card card-hover-effect group touch-target">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-secondary-100 to-secondary-200 
                                 text-secondary-600 rounded-lg group-hover:shadow-glow 
                                 transition-all duration-300">
                    <Activity 
                      size={12} 
                      className="sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base text-secondary-800 
                                 group-hover:text-secondary-900 transition-colors duration-300">
                      {log.username} {log.action}
                    </p>
                    <p className="text-xs text-secondary-600 leading-tight">
                      {log.module} · {format(new Date(log.timestamp), 'MM月dd日 HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className="text-center py-4 sm:py-6 border-t border-secondary-200/50">
          <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
            💻 制作人：陈凯 | 👨‍🏫 指导老师：刘主
          </p>
          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1 leading-relaxed">
            🏫 韶关学院食用菌创新团队 © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;