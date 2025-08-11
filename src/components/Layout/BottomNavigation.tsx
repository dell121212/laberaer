import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Beaker, Users, Calendar, FlaskConical, Activity } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/lab', icon: Home, label: '实验室' },
    { path: '/strains', icon: Beaker, label: '菌种保藏' },
    { path: '/members', icon: Users, label: '成员名单' },
    { path: '/duty', icon: Calendar, label: '值日' },
    { path: '/media', icon: FlaskConical, label: '培养基' },
  ];

  // 只有管理员可以看到操作记录
  if (user?.role === 'admin') {
    navItems.push({ path: '/logs', icon: Activity, label: '操作记录' });
  }
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl 
                   border-t border-secondary-200/50 dark:border-secondary-700/50 px-2 py-1 z-40 shadow-2xl 
                   safe-area-padding safe-area-bottom transition-colors duration-300">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item group touch-target ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon 
              size={20} 
              className="mb-1 group-hover:scale-110 transition-transform duration-300 sm:mb-0.5" 
            />
            <span className="text-xs sm:text-xs leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;