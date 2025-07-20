import React from 'react';

interface ToggleProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelPosition?: 'left' | 'right';
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className,
  labelPosition = 'right',
}) => {
  const sizeClasses = {
    sm: { switch: 'w-9 h-5', dot: 'w-3.5 h-3.5', translate: 'translate-x-4' }, 
    md: { switch: 'w-11 h-6', dot: 'w-4 h-4', translate: 'translate-x-5' }, 
    lg: { switch: 'w-14 h-7', dot: 'w-5 h-5', translate: 'translate-x-7' }, 
  };

  const currentSize = sizeClasses[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  const switchElement = (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        disabled={disabled}
        id={id}
        className={`
            relative inline-flex items-center flex-shrink-0 rounded-full cursor-pointer
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500
            ${currentSize.switch}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${checked ? (disabled ? 'bg-brand-300' : 'bg-brand-500') : (disabled ? 'bg-slate-200' : 'bg-slate-300 hover:bg-slate-400')}
        `}
    >
        <span className="sr-only">Use setting</span>
        <span
            aria-hidden="true"
            className={`
                pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0
                transition duration-200 ease-in-out
                ${currentSize.dot}
                ${checked ? currentSize.translate : 'translate-x-0.5'} 
            `}
        />
    </button>
  );

  const labelElement = (
     <label
        htmlFor={id} 
        onClick={handleToggle} 
        className={`
            text-sm font-medium
            ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 cursor-pointer'}
            ${labelPosition === 'left' ? 'mr-3' : 'ml-3'}
        `}
    >
        {label}
    </label>
  );


  return (
    <div className={`flex items-center ${className || ''}`}>
      {labelPosition === 'left' && labelElement}
      {switchElement}
      {labelPosition === 'right' && labelElement}
    </div>
  );
};

export default Toggle;