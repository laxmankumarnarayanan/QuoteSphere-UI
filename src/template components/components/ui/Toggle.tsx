// /mnt/data/banking-ui-components/Toggle.tsx
import React from "react";

type ToggleProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label }) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      {label && <span className="text-gray-700 font-semibold">{label}</span>}
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-200 ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
