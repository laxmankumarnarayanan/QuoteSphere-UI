// /mnt/data/banking-ui-components/TextareaInput.tsx
import React from "react";

type TextareaInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
};

const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  placeholder = "Enter text here...",
  value,
  onChange,
  rows = 4,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="text-gray-700 font-semibold mb-1">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-y"
      />
    </div>
  );
};

export default TextareaInput;
