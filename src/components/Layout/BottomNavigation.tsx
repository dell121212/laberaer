import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
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
    { path: '/profile', icon: User, label: '个人' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  // 如果是管理员，添加管理面板
  if (user?.role === 'admin') {
    navItems.splice(-1, 0, { path: '/admin', icon: Shield, label: '管理' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
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
                           ? 'text-blue-600 bg-blue-50 font-semibold' 
                           : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                         }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="truncate max-w-[50px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;