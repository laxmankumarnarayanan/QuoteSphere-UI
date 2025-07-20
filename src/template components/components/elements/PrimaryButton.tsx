import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode; 
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  isLoading = false,
  disabled,
  size = 'md',
  icon,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm', 
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`
        font-semibold text-white rounded-lg shadow-md border border-transparent
        bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500
        hover:from-brand-700 hover:via-brand-600 hover:to-orange-600
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 
        transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:from-brand-600
        flex items-center justify-center
        ${sizeClasses[size]}
        ${className || ''}
      `}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         style={{ marginLeft: icon ? '-0.25rem' : '-0.5rem', marginRight: '0.75rem' }} 
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span className="mr-2 -ml-0.5 h-5 w-5">{icon}</span>}
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default PrimaryButton;