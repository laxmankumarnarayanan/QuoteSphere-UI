import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode; 
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
        font-semibold rounded-lg border-2 border-brand-500 text-brand-500
        bg-white
        hover:bg-brand-50 hover:text-brand-600 hover:border-brand-600
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-400
        transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-500
        flex items-center justify-center
        ${sizeClasses[size]}
        ${className || ''}
      `}
      {...props}
    >
      {isLoading && (
         <svg className="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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

export default SecondaryButton;