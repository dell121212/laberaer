import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  Users, 
  Shield, 
  Trash2, 
  Edit2, 
  Search, 
  UserCheck, 
  UserX,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // 检查管理员权限
    if (!user || user.role !== 'admin') {
      alert('只有管理员可以访问后台管理');
      navigate('/home');
      return;
    }

    // 加载用户数据
    loadUsers();
  }, [user, navigate]);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('global_users') || '[]');
    setUsers(savedUsers);
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('确定要删除这个用户吗？此操作不可恢复。')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('global_users', JSON.stringify(updatedUsers));
    }
  };

  const handleToggleRole = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, role: u.role === 'admin' ? 'member' : 'admin' as 'admin' | 'member' }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('global_users', JSON.stringify(updatedUsers));
    
    // 更新当前用户信息（如果修改的是当前用户）
    if (userId === user.id) {
      const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
      if (updatedCurrentUser) {
        localStorage.setItem('current_user', JSON.stringify(updatedCurrentUser));
      }
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, isBlocked: !u.isBlocked }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('global_users', JSON.stringify(updatedUsers));
  };
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    memberUsers: users.filter(u => u.role === 'member').length,
    blockedUsers: users.filter(u => u.isBlocked).length,
    recentUsers: users.filter(u => {
      const userDate = new Date(u.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return userDate >= weekAgo;
    }).length
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-700 dark:to-accent-800 text-white p-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} />
            <h1 className="text-xl font-bold">后台管理</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户名或邮箱..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="modern-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl mx-auto mb-2">
              <Users size={24} />
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.totalUsers}</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">总用户数</p>
          </div>

          <div className="modern-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400 rounded-xl mx-auto mb-2">
              <Shield size={24} />
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.adminUsers}</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">管理员</p>
          </div>

          <div className="modern-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400 rounded-xl mx-auto mb-2">
              <UserCheck size={24} />
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.memberUsers}</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">普通成员</p>
          </div>

          <div className="modern-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-error-100 dark:bg-error-900 text-error-600 dark:text-error-400 rounded-xl mx-auto mb-2">
              <UserX size={24} />
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.blockedUsers}</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">被限制用户</p>
          </div>

          <div className="modern-card p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400 rounded-xl mx-auto mb-2">
              <Activity size={24} />
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.recentUsers}</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">本周新增</p>
          </div>
        </div>

        {/* Users List */}
        <div className="modern-card">
          <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
              <Users size={20} />
              用户管理
            </h2>
          </div>

          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {filteredUsers.map((u) => (
              <div key={u.id} className="p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold ${u.isBlocked ? 'opacity-50' : ''}`}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2 ${u.isBlocked ? 'opacity-50' : ''}`}>
                        {u.username}
                        {u.isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300 text-xs rounded-full">
                            🚫 已限制
                          </span>
                        )}
                        {u.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-xs rounded-full">
                            <Shield size={12} />
                            管理员
                          </span>
                        )}
                      </h3>
                      <p className={`text-secondary-600 dark:text-secondary-400 text-sm ${u.isBlocked ? 'opacity-50' : ''}`}>{u.email}</p>
                      <p className={`text-secondary-500 dark:text-secondary-500 text-xs ${u.isBlocked ? 'opacity-50' : ''}`}>
                        注册时间：{format(new Date(u.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        u.isBlocked 
                          ? 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400 hover:bg-success-200 dark:hover:bg-success-800' 
                          : 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400 hover:bg-warning-200 dark:hover:bg-warning-800'
                      }`}
                      title={u.isBlocked ? '解除限制' : '限制登录'}
                      disabled={u.id === user.id}
                    >
                      {u.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                    </button>

                    <button
                      onClick={() => handleToggleRole(u.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        u.role === 'admin' 
                          ? 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400 hover:bg-warning-200 dark:hover:bg-warning-800' 
                          : 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400 hover:bg-success-200 dark:hover:bg-success-800'
                      }`}
                      title={u.role === 'admin' ? '设为普通用户' : '设为管理员'}
                    >
                      {u.role === 'admin' ? <Shield size={16} /> : <UserCheck size={16} />}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 bg-error-100 dark:bg-error-900 text-error-600 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-800 rounded-lg transition-colors"
                      title="删除用户"
                      disabled={u.id === user.id}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users size={48} className="mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
              <p className="text-secondary-500 dark:text-secondary-400">没有找到匹配的用户</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/lab')}
            className="btn-secondary"
          >
            返回实验室
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;