import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = 'max-h-[85vh]',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden flex items-end justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
      
      <div className="absolute inset-0" onClick={onClose} />

  
      <div
        className={`relative w-full ${snapPoints} bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up z-10`}
      >
   
        <div className="flex justify-center py-2.5 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" />
        </div>

       
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 pb-3.5 border-b border-gray-50">
            {title ? (
              <h3 className="text-base font-bold text-primary">{title}</h3>
            ) : (
              <div />
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-primary transition-all active:scale-90"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

  
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
