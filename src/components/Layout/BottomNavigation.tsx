import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  User, 
  Settings,
  Shield,
  Heart
} from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { path: '/home', icon: Home, label: '首页', emoji: '🏠' },
    { path: '/profile', icon: User, label: '个人', emoji: '👤' },
    { path: '/settings', icon: Settings, label: '设置', emoji: '⚙️' },
  ];

  // 如果是管理员，添加管理面板
  if (user?.role === 'admin') {
    navItems.splice(-1, 0, { path: '/admin', icon: Shield, label: '管理', emoji: '👑' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect backdrop-blur-lg border-t border-blue-200 z-40">
      <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 text-xs
                         transition-all duration-300 rounded-2xl min-h-[60px] relative overflow-hidden
                         cute-hover group
                         ${isActive 
                           ? 'text-white bg-gradient-to-r from-blue-400 to-cyan-500 font-semibold shadow-lg' 
                           : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                         }`}
            >
              <div className="relative">
                <Icon size={20} className="mb-1" />
                <div className={`absolute -top-1 -right-2 text-sm transition-all duration-300 ${
                  isActive ? 'emoji-bounce' : 'group-hover:animate-wiggle'
                }`}>
                  {item.emoji}
                </div>
              </div>
              <span className="truncate max-w-[50px]">{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-20 rounded-2xl animate-pulse-cute" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* 可爱的底部装饰 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <Heart className="text-blue-400 animate-pulse-cute" size={12} />
      </div>
    </div>
  );
};

export default BottomNavigation;