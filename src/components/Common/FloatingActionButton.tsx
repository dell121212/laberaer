import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 
                 hover:from-primary-600 hover:to-primary-700 text-white rounded-full 
                 shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-90 z-30
                 flex items-center justify-center border-2 border-white/20"
    >
      <Plus size={24} />
    </button>
  );
};

export default FloatingActionButton;