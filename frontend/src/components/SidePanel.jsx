import React from 'react';
import { X } from 'lucide-react';

const SidePanel = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-[400px]',
  showCloseButton = true,
  position = 'left',
}) => {
  if (!isOpen) return null;

  const positionStyles = position === 'left' ? 'left-0 border-r' : 'right-0 border-l';

  return (
    <div
      className={`
        hidden md:flex flex-col absolute top-0 bottom-0 ${positionStyles} ${width} 
        bg-white shadow-2xl z-40 border-gray-100 animate-fade-in overflow-hidden
      `}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          {title ? (
            <h3 className="text-lg font-bold text-primary font-sans">{title}</h3>
          ) : (
            <div />
          )}
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-primary transition-all active:scale-95"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default SidePanel;
