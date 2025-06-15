/**
 * Slider.tsx
 * A reusable slider component with custom styling.
 */
import React, { useState } from "react";

type SliderProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  warning?: string;
};

const Slider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  valuePrefix = "",
  valueSuffix = "",
  warning = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            disabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {label}
        </label>
        {showValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {valuePrefix}
            {value}
            {valueSuffix}
          </span>
        )}
      </div>
      <div className="relative">
        <div
          className={`h-2 bg-purple-500/20 dark:bg-purple-500/10 rounded-full ${
            disabled ? "opacity-50" : ""
          }`}
        >
          <div
            className="absolute h-2 bg-purple-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`absolute top-0 w-full h-2 cursor-pointer appearance-none bg-transparent ${
            disabled ? "cursor-not-allowed" : ""
          }
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-0
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:duration-200
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:transition-transform
          [&::-moz-range-thumb]:duration-200
          [&::-moz-range-thumb]:hover:scale-110`}
        />
      </div>
      {warning && (
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{warning}</p>
      )}
    </div>
  );
};

export default Slider;