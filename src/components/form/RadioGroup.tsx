/**
 * RadioGroup.tsx
 * A reusable radio group component with custom styling.
 */
import React from "react";

type Option = {
  id: string;
  label: string;
  value: string;
};

type RadioGroupProps = {
  name: string;
  label: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  error?: string;
  required?: boolean;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  selectedValue,
  onChange,
  disabled = false,
  direction = "vertical",
  error,
  required = false,
}) => {
  return (
    <div className="relative mb-4">
      <div className={`relative transition-all duration-200 ${error ? 'text-red-500' : ''}`}>
        <div className="relative">
          <div className="absolute -top-[9px] left-[15px] right-[15px] h-[2px] bg-white dark:bg-gray-800" />
          <label 
            className={`
              absolute left-3 -top-[9px] px-1 text-xs bg-white dark:bg-gray-800 dark:text-white
              ${error ? 'text-red-500' : 'text-gray-500'}
            `}
          >
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className={`
            border rounded-md transition-all duration-200 px-3 py-2
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}>
            <div
              className={`flex ${
                direction === "horizontal" ? "flex-row space-x-4" : "flex-col space-y-2"
              }`}
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id={option.id}
                      name={name}
                      type="radio"
                      value={option.value}
                      checked={selectedValue === option.value}
                      onChange={(e) => onChange(e.target.value)}
                      disabled={disabled}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                        selectedValue === option.value
                          ? "border-purple-500"
                          : "border-gray-300"
                      } ${
                        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() => !disabled && onChange(option.value)}
                    >
                      {selectedValue === option.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <label
                      htmlFor={option.id}
                      className={`ml-2 text-sm ${
                        disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 dark:text-white cursor-pointer"
                      }`}
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;