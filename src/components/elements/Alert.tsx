import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

type AlertVariant = 'error' | 'warning' | 'success' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  isDismissible?: boolean;
  className?: string;
}

const alertStyles = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700',
    IconComponent: XCircle,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800',
    messageColor: 'text-amber-700',
    IconComponent: AlertTriangle,
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700',
    IconComponent: CheckCircle2,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700',
    IconComponent: Info,
  },
};

const Alert: React.FC<AlertProps> = ({ variant, title, message, onClose, isDismissible = false, className }) => {
  const styles = alertStyles[variant];
  const { IconComponent } = styles;

  return (
    <div
      className={`p-4 border-l-4 rounded-md shadow-md ${styles.bg} ${styles.border} flex items-start space-x-3 transition-all duration-300 hover:shadow-lg ${className || ''}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.iconColor} pt-0.5`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-grow">
        {title && <h3 className={`text-base font-semibold ${styles.titleColor}`}>{title}</h3>}
        <p className={`text-sm ${styles.messageColor}`}>{message}</p>
      </div>
      {isDismissible && onClose && (
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md ${styles.messageColor} hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-50 focus:ring-${variant}-600`}
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export const ErrorAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="error" {...props} />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="warning" {...props} />
);

export const SuccessAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="success" {...props} />
);

export const InfoAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="info" {...props} />
);

export default Alert;