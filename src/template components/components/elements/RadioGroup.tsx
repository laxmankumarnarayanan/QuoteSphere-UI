import React from 'react';
import { CheckCircle2 } from 'lucide-react'; 

interface RadioOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean; 
  error?: string;
  required?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridCols?: number; 
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  selectedValue,
  onChange,
  disabled = false,
  error,
  required = false,
  layout = 'vertical',
  gridCols = 2,
  className,
}) => {

  const layoutClasses = {
    vertical: 'space-y-3',
    horizontal: 'flex flex-wrap gap-x-6 gap-y-3 items-center',
    grid: `grid gap-3 grid-cols-1 sm:grid-cols-${gridCols}`,
  };

  return (
    <fieldset className={`mb-1 ${className || ''}`}>
      {label && (
        <legend className="block text-sm font-semibold text-slate-800 mb-2.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </legend>
      )}
      <div className={`${layoutClasses[layout]}`}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <div
              key={option.id}
              onClick={() => !isDisabled && onChange(option.value)}
              onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !isDisabled) onChange(option.value);}}
              tabIndex={isDisabled ? -1 : 0}
              role="radio"
              aria-checked={isSelected}
              aria-labelledby={`${option.id}-label`}
              aria-describedby={option.description ? `${option.id}-desc` : undefined}
              className={`
                relative flex items-start p-3.5 border rounded-lg transition-all duration-200
                focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-violet-400 
                ${isSelected ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500' : 'bg-white border-slate-300 hover:border-slate-400'}
                ${isDisabled ? 'opacity-70 cursor-not-allowed bg-slate-50 !border-slate-200' : 'cursor-pointer hover:shadow-sm'}
              `}
            >
              
              <div className="flex items-center h-5 mt-0.5 mr-3 flex-shrink-0">
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all duration-150
                    ${isSelected ? 
                      (isDisabled ? 'border-violet-300 bg-violet-300' : 'border-violet-500 bg-violet-500') : 
                      (isDisabled ? 'border-slate-300 bg-slate-100' : 'border-slate-400 bg-white group-hover:border-violet-400')}
                  `}
                >
                  {isSelected && <div className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-white opacity-70' : 'bg-white'}`}></div>}
                </div>
                 
                <input
                    id={option.id}
                    name={name}
                    type="radio"
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => !isDisabled && onChange(e.target.value)}
                    disabled={isDisabled}
                    className="sr-only"
                />
              </div>

              <div className="text-sm flex-grow">
                <label
                  id={`${option.id}-label`}
                  className={`font-medium ${isSelected ? 'text-violet-700' : 'text-slate-800'} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p id={`${option.id}-desc`} className={`mt-0.5 ${isSelected ? 'text-violet-600' : 'text-slate-500'}`}>
                    {option.description}
                  </p>
                )}
              </div>
              {isSelected && !isDisabled && (
                  <CheckCircle2 className="w-5 h-5 text-violet-500 absolute top-3.5 right-3.5" />
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 px-1">{error}</p>}
    </fieldset>
  );
};

export default RadioGroup;