/**
 * Toggle.tsx
 * A reusable toggle switch component with custom styling.
 */
import React from "react";

type ToggleProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const Toggle: React.FC<ToggleProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  // Size mappings
  const sizeClasses = {
    sm: {
      switch: "w-8 h-4",
      dot: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      switch: "w-11 h-6",
      dot: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      switch: "w-14 h-7",
      dot: "w-6 h-6",
      translate: "translate-x-7",
    },
  };

  return (
    <div className="flex items-center mb-2">
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        <div
          onClick={() => !disabled && onChange(!checked)}
          className={`relative ${
            checked ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${
            sizeClasses[size].switch
          } rounded-full transition-colors duration-300 ease-in-out flex items-center px-0.5`}
        >
          <div
            className={`${
              checked ? sizeClasses[size].translate : "translate-x-0"
            } ${
              sizeClasses[size].dot
            } bg-white dark:bg-gray-100 rounded-full shadow transform transition-transform duration-300 ease-in-out`}
          />
        </div>
        <label
          htmlFor={id}
          className={`ml-3 text-sm ${
            disabled
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-200 cursor-pointer"
          }`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default Toggle;