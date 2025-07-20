import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id: string;
  label: React.ReactNode; 
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  error?: string; 
  labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className,
  error,
  labelClassName,
}) => {
  const handleInteraction = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div className="flex items-start"> {}
        <div className="flex items-center h-5">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={() => !disabled && onChange(!checked)} 
            disabled={disabled}
            className="sr-only peer" 
          />
          <div
            onClick={handleInteraction}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleInteraction();}}
            tabIndex={disabled ? -1 : 0}
            role="checkbox"
            aria-checked={checked}
            aria-labelledby={`${id}-label`}
            className={`
              w-5 h-5 rounded border-2 transition-all duration-150 ease-in-out
              flex items-center justify-center flex-shrink-0
              peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-brand-400 
              ${disabled ? 'border-slate-300 bg-slate-100 cursor-not-allowed' : 'cursor-pointer border-slate-400 hover:border-brand-500'}
              ${checked ? 
                (disabled ? 'bg-brand-300 border-brand-300' : 'bg-brand-500 border-brand-500 hover:bg-brand-600 hover:border-brand-600') : 
                (disabled ? '' : 'bg-white')}
            `}
          >
            {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
        </div>
        <div className="ml-3 text-sm">
          <label
            id={`${id}-label`}
            htmlFor={id} 
            onClick={handleInteraction} 
            className={`
              font-medium
              ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 cursor-pointer'}
              ${error ? 'text-red-600' : ''}
              ${labelClassName || ''}
            `}
          >
            {label}
          </label>
        </div>
      </div>
      {error && !disabled && <p className="mt-1 text-xs text-red-600 ml-8">{error}</p>}
    </div>
  );
};

export default Checkbox;