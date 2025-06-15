import React from "react";

type RadioButtonGroupProps = {
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  title?: string;
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selectedValue,
  onChange,
  title,
}) => {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm mb-4">
      {title && <h4 className="text-lg font-semibold mb-2 text-gray-700">{title}</h4>}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="radio-group"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
