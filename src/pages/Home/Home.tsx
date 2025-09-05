import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FlaskConical, BookOpen, Activity, Clock, Beaker, GraduationCap, Shield } from 'lucide-react';

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
      color: 'bg-emerald-500'
    },
    {
      title: '成员名单',
      icon: Users,
      count: members.length,
      recent: members.length > 0 ? `最新: ${members[0].name}` : '暂无数据',
      path: '/members',
      color: 'bg-blue-500'
    },
    {
      title: '值日安排',
      icon: Calendar,
      count: dutySchedules.length,
      recent: dutySchedules.length > 0 ? `最新安排` : '暂无安排',
      path: '/duty',
      color: 'bg-purple-500'
    },
    {
      title: '培养基推荐',
      icon: Beaker,
      count: media.length,
      recent: media.length > 0 ? `最新: ${media[0].name}` : '暂无数据',
      path: '/media',
      color: 'bg-orange-500'
    },
    {
      title: '历届毕业论文',
      icon: GraduationCap,
      count: theses.length,
      recent: theses.length > 0 ? `最新: ${theses[0].title.slice(0, 10)}...` : '暂无数据',
      path: '/theses',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部欢迎区域 */}
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🧪 实验室管理系统</h1>
            <p className="text-gray-600">欢迎回来，{user?.username}</p>
          </div>
          <div className="text-right">
            <div className="p-3 rounded-lg bg-blue-50">
              <Clock className="w-6 h-6 text-blue-600 mb-1 mx-auto" />
              <p className="text-xs text-gray-600">今天是</p>
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
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(card.path)}
            >
              <div className={`p-3 ${card.color} text-white rounded-lg mb-3`}>
                <card.icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.count}</p>
              <p className="text-xs text-gray-500 truncate">{card.recent}</p>
            </div>
          ))}
        </div>

        {/* 今日值日提醒 */}
        {todayDuty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              今日值日安排
            </h3>
            <div className="space-y-2">
              <p className="text-yellow-700">
                值日人员: {todayDuty.members.join(', ')}
              </p>
              <p className="text-yellow-600 text-sm">
                任务: {todayDuty.tasks.join(', ')}
              </p>
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                todayDuty.status === 'completed' ? 'bg-green-100 text-green-800' :
                todayDuty.status === 'skipped' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {todayDuty.status === 'completed' ? '已完成' : 
                 todayDuty.status === 'skipped' ? '已跳过' : '待完成'}
              </span>
            </div>
          </div>
        )}

        {/* 系统管理快捷入口 */}
        {user?.role === 'admin' && (
          <div 
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow mb-6"
            onClick={() => navigate('/admin')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500 text-white rounded-lg">
                  <Shield size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">系统管理</h3>
                  <p className="text-gray-600 text-sm">管理系统用户和权限</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 数据统计 */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 数据概览</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Activity size={20} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{totalRecords}</p>
            <p className="text-xs text-gray-600">总数据量</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{recentLogs.length}</p>
            <p className="text-xs text-gray-600">最近活动</p>
          </div>
        </div>

        {/* 最近活动 */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🕒 最近活动</h2>
        <div className="space-y-3">
          {recentLogs.map((log, index) => (
            <div key={log.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                  <Activity size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{log.details}</p>
                  <p className="text-xs text-gray-500">
                    {log.username} • {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentLogs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无活动记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;