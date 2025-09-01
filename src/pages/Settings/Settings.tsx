import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Sun, Moon, Palette, Info, ArrowLeft } from 'lucide-react';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-700 dark:to-secondary-800 text-white p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/lab')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <SettingsIcon size={24} />
            <h1 className="text-xl font-bold">设置</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Theme Settings */}
        <div className="modern-card mb-6">
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
              <Palette size={20} />
              外观设置
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={20} className="text-secondary-600" /> : <Sun size={20} className="text-secondary-600" />}
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">主题模式</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    当前：{isDark ? '夜间模式' : '白天模式'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isDark ? 'bg-primary-600' : 'bg-secondary-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="modern-card mb-6">
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">快捷操作</h2>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={() => navigate('/strains')}
              className="w-full p-4 text-left bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                  🧪
                </div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">菌种保藏</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">管理菌种信息</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/members')}
              className="w-full p-4 text-left bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                  👥
                </div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">成员名单</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">查看团队成员</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/duty')}
              className="w-full p-4 text-left bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                  📅
                </div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">值日安排</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">查看值日计划</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/media')}
              className="w-full p-4 text-left bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                  🧫
                </div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">培养基推荐</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">查看培养基配方</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/theses')}
              className="w-full p-4 text-left bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                  🎓
                </div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">历届毕业论文</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">查看论文资料</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        {userLogs.length > 0 && (
          <div className="modern-card">
            <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                <Activity size={20} />
                最近操作
              </h2>
            </div>
            <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {userLogs.map((log) => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;