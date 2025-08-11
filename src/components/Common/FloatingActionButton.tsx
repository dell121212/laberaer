import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="floating-action group touch-target"
      aria-label="添加新项目"
    >
      <Plus 
        size={20} 
        className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" 
      />
    </button>
  );
};

export default FloatingActionButton;