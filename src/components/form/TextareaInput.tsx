/**
 * TextareaInput.tsx
 * A reusable textarea input component with custom styling.
 * Updated to match TextInput behavior with floating label.
 */
import React, { useState } from "react";

type TextareaInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  rows?: number;
  maxLength?: number;
};

const TextareaInput: React.FC<TextareaInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 4,
  maxLength,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const isActive = focused || internalValue.length > 0;
  const charactersLeft = maxLength ? maxLength - internalValue.length : null;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="mb-4">
      <div className={`relative transition-all duration-200 ${error ? 'text-red-500' : ''}`}>
        {maxLength && (
          <div className="absolute right-3 top-2 text-[10px] text-gray-500">
            {charactersLeft} left
          </div>
        )}
        <div className="relative">
          <div className="absolute -top-[9px] left-[15px] right-[15px] h-[2px] bg-white dark:bg-gray-800" />
            <label 
              htmlFor={id || label}
              className={`
                absolute left-3 -top-[9px] px-1 text-xs bg-white dark:bg-gray-800 dark:text-white
                ${error ? 'text-red-500' : focused ? 'text-purple-500' : 'text-gray-500'}
              `}
            >
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`
              border rounded-md transition-all duration-200
              ${error ? 'border-red-500' : focused ? 'border-purple-500' : 'border-gray-300'}
            `}>
            <textarea
              {...props}
              id={id || label}
              value={internalValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className={`
                w-full bg-transparent outline-none appearance-none px-3 py-2
                text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 resize-y
                ${error ? 'text-red-500' : ''}
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
            />
            </div>
          </div>
        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

export default TextareaInput;