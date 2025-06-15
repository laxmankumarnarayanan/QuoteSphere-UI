// /mnt/data/banking-ui-components/TextInput.tsx
import React from "react";

type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number";
  disabled?: boolean;
  required?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder = "Enter text...",
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="text-gray-700 font-semibold mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
      />
    </div>
  );
};

export default TextInput;
