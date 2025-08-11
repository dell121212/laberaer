import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in custom-scrollbar" onClick={onClose}>
      <div className="modal-content animate-bounce-in custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3 sm:mb-4 sticky top-0 bg-white/95 
                       backdrop-blur-md z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 
                       border-b border-secondary-200/50">
          <h2 className="responsive-text-lg font-semibold text-secondary-900 gradient-text-enhanced">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-all duration-300 
                     hover:scale-110 touch-target"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="pb-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;