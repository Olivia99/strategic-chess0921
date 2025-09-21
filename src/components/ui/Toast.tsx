'use client';

import React, { useEffect, useState, useCallback } from 'react';

export type ToastType = 'info' | 'warning' | 'error' | 'success';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  }, [onClose, toast.id]);

  useEffect(() => {
    setIsVisible(true);
    
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, handleClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border transform transition-all duration-300 z-50";
    const visibilityStyles = isVisible 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0";
    
    const typeStyles = {
      info: "border-blue-200 bg-blue-50",
      warning: "border-yellow-200 bg-yellow-50", 
      error: "border-red-200 bg-red-50",
      success: "border-green-200 bg-green-50"
    };

    return `${baseStyles} ${visibilityStyles} ${typeStyles[toast.type]}`;
  };

  const getIconStyles = () => {
    const typeStyles = {
      info: "text-blue-500",
      warning: "text-yellow-500",
      error: "text-red-500", 
      success: "text-green-500"
    };
    return typeStyles[toast.type];
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`text-lg mr-3 ${getIconStyles()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {toast.title}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {toast.message}
            </p>
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ marginTop: index * 80 + 'px' }}>
          <Toast toast={toast} onClose={onRemoveToast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;