import React, { useState, ChangeEvent, FocusEvent, MouseEvent } from 'react';

interface SliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValueTooltip?: 'always' | 'onHover' | 'never';
  valuePrefix?: string;
  valueSuffix?: string;
  warning?: string; 
  className?: string;
  showMinMaxLabels?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValueTooltip = 'onHover',
  valuePrefix = '',
  valueSuffix = '',
  warning,
  className,
  showMinMaxLabels = false,
}) => {
  const [isFocused, setIsFocused] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); 

  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = `${valuePrefix}${value}${valueSuffix}`;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const showTooltip = 
    showValueTooltip === 'always' || 
    (showValueTooltip === 'onHover' && (isHovered || isFocused));

  return (
    <div className={`mb-1 ${className || ''}`}>
      <div className="flex justify-between items-center mb-1.5">
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}
        >
          {label}
        </label>
        {showValueTooltip === 'never' && ( 
             <span className={`text-sm font-medium ${disabled ? 'text-slate-400' : 'text-violet-600'}`}>
                {displayValue}
            </span>
        )}
      </div>
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative h-2 rounded-full ${disabled ? 'bg-slate-200' : 'bg-violet-100'}`}>
          <div
            className={`absolute h-2 rounded-full ${disabled ? 'bg-slate-300' : 'bg-violet-500'}`}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            absolute top-0 left-0 w-full h-2 m-0 p-0 appearance-none bg-transparent
            focus:outline-none group
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-300
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:shadow-lg
            ${disabled ? '[&::-webkit-slider-thumb]:bg-slate-200 [&::-webkit-slider-thumb]:border-slate-300' : '[&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:border-violet-500 group-hover:[&::-webkit-slider-thumb]:bg-violet-600'}
            
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-slate-300
            [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:hover:shadow-lg
             ${disabled ? '[&::-moz-range-thumb]:bg-slate-200 [&::-moz-range-thumb]:border-slate-300' : '[&::-moz-range-thumb]:bg-violet-500 [&::-moz-range-thumb]:border-violet-500 group-hover:[&::-moz-range-thumb]:bg-violet-600'}
          `}
        />
         {showTooltip && (
          <div 
            className="absolute z-10 px-2 py-1 text-xs text-white bg-slate-700 rounded-md shadow-lg pointer-events-none transition-opacity duration-150"
            style={{
              left: `calc(${Math.max(2, Math.min(98, percentage))}% - 10px)`, 
              bottom: '100%', 
              marginBottom: '10px',
              opacity: (isHovered || isFocused) ? 1 : 0,
              transform: 'translateX(-50%)',
            }}
          >
            {displayValue}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-700"></div>
          </div>
        )}
      </div>
      {showMinMaxLabels && (
        <div className="flex justify-between text-xs text-slate-500 mt-1.5 px-0.5">
            <span>{valuePrefix}{min}{valueSuffix}</span>
            <span>{valuePrefix}{max}{valueSuffix}</span>
        </div>
      )}
      {warning && !disabled && (
        <p className="mt-1.5 text-xs text-amber-600">{warning}</p>
      )}
    </div>
  );
};

export default Slider;