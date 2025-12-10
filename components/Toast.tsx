
import React, { useEffect } from 'react';
import { Icons } from './Icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: Icons.Check,
    error: Icons.X,
    info: Icons.Megaphone // Using megaphone as info icon proxy
  };

  const Icon = icons[type];

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white transform transition-all duration-300 animate-fade-in-up ${bgColors[type]}`}>
      <div className="bg-white/20 p-1 rounded-full">
        <Icon size={20} />
      </div>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">
        <Icons.X size={16} />
      </button>
    </div>
  );
};
