import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Beaker, 
  Users, 
  Calendar, 
  FlaskConical, 
  GraduationCap, 
  User, 
  Settings,
  Shield
} from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { path: '/home', icon: Home, label: '首页' },
    { path: '/strains', icon: Beaker, label: '菌种' },
    { path: '/members', icon: Users, label: '成员' },
    { path: '/duty', icon: Calendar, label: '值日' },
    { path: '/media', icon: FlaskConical, label: '培养基' },
    { path: '/theses', icon: GraduationCap, label: '论文' },
    { path: '/profile', icon: User, label: '个人' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  // 如果是管理员，添加管理面板
  if (user?.role === 'admin') {
    navItems.splice(-2, 0, { path: '/admin', icon: Shield, label: '管理' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 z-40">
      <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 text-xs
                         transition-all duration-300 rounded-xl min-h-[60px] relative overflow-hidden
                         ${isActive 
                           ? 'text-primary-500 bg-white/20 font-semibold' 
                           : 'text-gray-600 hover:text-primary-500 hover:bg-white/10'
                         }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="truncate max-w-[50px]">{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;