import React, { useState, InputHTMLAttributes, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onFocus' | 'onBlur' | 'type'> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | string;
  error?: string;
  leadingIcon?: React.ReactNode;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  leadingIcon,
  className,
  onFocus,
  onBlur,
  inputClassName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const nonTextualInputTypes = ['date', 'time', 'datetime-local', 'month', 'week', 'color'];
  const isLabelFloating = isFocused || hasValue || (placeholder && !isFocused && !hasValue) || nonTextualInputTypes.includes(type);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  const isPasswordType = type === 'password';
  const focusInput = () => inputRef.current?.focus();

  return (
    <div className={`relative ${className || ''} mb-2`}> 
      <div
        onClick={focusInput}
        className={`
          relative border rounded-lg transition-all duration-200 ease-in-out group
          flex items-center
          ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white hover:border-slate-400'}
          ${error ? 'border-red-500 hover:border-red-600' :
            isFocused ? 'border-brand-500 ring-1 ring-brand-500 hover:border-brand-600' :
            'border-slate-300'}
        `}
      >
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400 peer-focus:text-brand-500"> 
            {React.cloneElement(leadingIcon as React.ReactElement, { className: 'w-5 h-5' })}
          </div>
        )}
        <input
          ref={inputRef}
          type={isPasswordType && showPassword ? 'text' : type}
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isLabelFloating && placeholder ? placeholder : ' '}
          required={required}
          disabled={disabled}
          className={`
            peer block w-full text-sm appearance-none outline-none rounded-lg bg-transparent
            text-slate-800 placeholder-slate-400
            ${leadingIcon ? 'pl-11' : 'px-3.5'} 
            ${isPasswordType ? 'pr-10' : 'pr-3.5'}
            ${isLabelFloating ? 'pt-6 pb-2' : 'py-3.5'} 
            ${disabled ? 'cursor-not-allowed' : ''}
            ${inputClassName || ''}
          `}
          {...props}
        />
        <label
          htmlFor={id}
          className={`
            absolute text-sm left-0 transition-all duration-200 ease-in-out pointer-events-none
            transform origin-[0]
            ${leadingIcon ? 'pl-11' : 'pl-3.5'} 
            ${error ? 'text-red-500' :
              isFocused ? 'text-brand-500' :
              'text-slate-500'}
            ${isLabelFloating ?
              '-translate-y-3 scale-[0.8] top-3' : 
              'scale-100 top-1/2 -translate-y-1/2'}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
         {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-brand-500 focus:outline-none z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 px-1">{error}</p>}
    </div>
  );
};

export default TextInput;