import React, { useState, TextareaHTMLAttributes, useRef } from 'react';

interface TextareaInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'onFocus' | 'onBlur'> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  showCharCount?: boolean;
  inputClassName?: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className,
  onFocus,
  onBlur,
  rows = 3,
  maxLength,
  showCharCount = false,
  inputClassName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasValue = value && value.length > 0;
  const isLabelFloating = isFocused || hasValue || (placeholder && !isFocused && !hasValue);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (maxLength && val.length > maxLength) {
        val = val.substring(0, maxLength);
    }
    onChange(val);
  };

  const focusTextarea = () => textareaRef.current?.focus();
  const charactersLeft = maxLength ? maxLength - value.length : null;

  return (
    <div className={`relative ${className || ''} mb-2`}> 
      <div
        onClick={focusTextarea}
        className={`
          relative border rounded-lg transition-all duration-200 ease-in-out group
          ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white hover:border-slate-400'}
          ${error ? 'border-red-500 hover:border-red-600' :
            isFocused ? 'border-violet-500 ring-1 ring-violet-500 hover:border-violet-600' :
            'border-slate-300'}
        `}
      >
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isLabelFloating && placeholder ? placeholder : ' '}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            peer block w-full text-sm appearance-none outline-none rounded-lg bg-transparent
            text-slate-800 placeholder-slate-400 resize-y
            px-3.5 
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
            px-3.5
            ${error ? 'text-red-500' : isFocused ? 'text-violet-500' : 'text-slate-500'}
            ${isLabelFloating ? '-translate-y-3 scale-[0.8] top-3' : 'scale-100 top-1/2 -translate-y-1/2'}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>
      <div className="flex justify-between items-center mt-1.5 px-1"> 
        {error && <p className="text-xs text-red-600">{error}</p>}
        {showCharCount && maxLength && !disabled && (
          <p className={`text-xs ${charactersLeft !== null && charactersLeft < 0 ? 'text-red-500' : 'text-slate-500'} ml-auto`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextareaInput;