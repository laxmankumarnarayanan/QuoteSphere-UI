/**
 * TextInput.tsx
 * A reusable text input component with custom styling.
 * Updated to properly handle props spreading for additional input attributes.
 */
import React, { useState } from "react";

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  error,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const isActive = focused || internalValue.length > 0;

  const handleFocus = () => {
    setFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative mb-4">
      <div 
        className={`relative transition-all duration-200 ${error ? 'text-red-500' : ''}`}
      >
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
          <input
            {...props}
            id={id || label}
            type={type}
            value={internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`
              w-full bg-transparent outline-none appearance-none px-3 py-2
              text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600
              ${error ? 'text-red-500' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          />
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default TextInput;