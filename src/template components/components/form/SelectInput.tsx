/**
 * SelectInput.tsx
 * A reusable select input component with custom styling and floating label design.
 */
import React, { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
};

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFocus = () => {
    if (!disabled) {
      setFocused(true);
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
      setIsOpen(false);
    }, 200);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const isActive = focused || value !== '';

  return (
    <div className="relative mb-4">
      <div 
        className={`relative transition-all duration-200 ${error ? 'text-red-500' : ''}`}
        onBlur={handleBlur}
      >
        <div className="relative">
          <div className="absolute -top-[9px] left-[15px] right-[15px] h-[2px] bg-white dark:bg-gray-800" />
          <label 
            htmlFor={id}
            className={`
              absolute left-3 -top-[9px] px-1 text-xs bg-white dark:bg-gray-800 dark:text-white
              ${error ? 'text-red-500' : focused ? 'text-purple-500' : 'text-gray-500'}
            `}
          >
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div 
            className={`
              border rounded-md transition-all duration-200 cursor-pointer
              ${error ? 'border-red-500' : focused ? 'border-purple-500' : 'border-gray-300'}
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            `}
            onClick={handleFocus}
            tabIndex={0}
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className={`block truncate ${!value ? 'text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-white'}`}>
                {selectedOption?.label || placeholder || 'Select...'}
              </span>
              <span className="pointer-events-none">
                <svg
                  className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'} transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          {isOpen && !disabled && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer hover:bg-purple-50
                    ${option.value === value ? 'bg-purple-50 text-purple-700' : 'text-gray-800'}
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;