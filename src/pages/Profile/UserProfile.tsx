import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { User, Calendar, Mail, Shield, Activity, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { activityLogs } = useApp();

  if (!user) return null;

  const userLogs = activityLogs.filter(log => log.userId === user.id).slice(0, 10);

  const stats = {
    totalActions: activityLogs.filter(log => log.userId === user.id).length,
    recentActions: activityLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo && log.userId === user.id;
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-primary-100">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-500/20 text-accent-100 text-sm rounded-full border border-accent-400/30">
                    <Shield size={14} />
                    管理员
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full border border-white/30">
                    <User size={14} />
                    普通成员
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="modern-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{stats.totalActions}</p>
            <p className="text-secondary-600 dark:text-secondary-400">总操作次数</p>
          </div>

          <div className="modern-card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{stats.recentActions}</p>
            <p className="text-secondary-600 dark:text-secondary-400">本周操作</p>
          </div>

          <div className="modern-card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-1">
              {format(new Date(user.createdAt), 'yyyy年MM月', { locale: zhCN })}
            </p>
            <p className="text-secondary-600 dark:text-secondary-400">加入时间</p>
          </div>
        </div>

        {/* Account Info */}
        <div className="modern-card mb-8">
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
              <User size={20} />
              账户信息
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <User size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">用户名</p>
                <p className="font-medium text-secondary-800 dark:text-secondary-200">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">邮箱</p>
                <p className="font-medium text-secondary-800 dark:text-secondary-200">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">注册时间</p>
                <p className="font-medium text-secondary-800 dark:text-secondary-200">
                  {format(new Date(user.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="modern-card mb-8">
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
              <Activity size={20} />
              最近操作
            </h2>
          </div>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {userLogs.length > 0 ? (
              userLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">{log.action}</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{log.module} · {log.details}</p>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-500">
                      {format(new Date(log.timestamp), 'MM-dd HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Activity size={48} className="mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
                <p className="text-secondary-500 dark:text-secondary-400">暂无操作记录</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={logout}
            className="bg-error-600 hover:bg-error-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-soft hover:shadow-medium active:scale-95"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;