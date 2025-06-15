import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, variant: ToastVariant, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig = {
  success: { bg: 'bg-green-500', IconComponent: CheckCircle2, text: 'text-white', bar: 'bg-green-600' },
  error: { bg: 'bg-red-500', IconComponent: XCircle, text: 'text-white', bar: 'bg-red-600' },
  warning: { bg: 'bg-amber-500', IconComponent: AlertTriangle, text: 'text-white', bar: 'bg-amber-600' },
  info: { bg: 'bg-blue-500', IconComponent: Info, text: 'text-white', bar: 'bg-blue-600' },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant, title?: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 11);
    setToasts((prevToasts) => [{ id, message, variant, title, duration }, ...prevToasts]); 
    
    if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
    }
  }, []);

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div aria-live="assertive" className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-[100] space-y-3">
        {toasts.map((toast) => {
          const styles = toastConfig[toast.variant];
          const { IconComponent } = styles;
          return (
            <div
              key={toast.id}
              className={`
                max-w-sm w-full ${styles.bg} ${styles.text} rounded-lg shadow-2xl pointer-events-auto overflow-hidden
                transition-all duration-300 transform
                animate-toast-in-right
              `}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    {toast.title && <h3 className="text-sm font-semibold">{toast.title}</h3>}
                    <p className="text-sm">{toast.message}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => removeToast(toast.id)}
                      className={`
                        inline-flex p-1 rounded-md hover:bg-white/20 focus:outline-none 
                        focus:ring-2 focus:ring-white/50
                      `}
                    >
                      <span className="sr-only">Close</span>
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              {toast.duration && toast.duration > 0 && (
                 <div className={`h-1 ${styles.bar} animate-toast-timer`} style={{ animationDuration: `${toast.duration}ms` }}></div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

/* Add this to your global CSS for animations:
@keyframes toast-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-toast-in-right {
  animation: toast-in-right 0.3s ease-out forwards;
}

@keyframes toast-timer {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
.animate-toast-timer {
  animation: toast-timer linear forwards;
}
*/