import React from "react";

type WarningProps = {
  message: string;
  onClose?: () => void;
};

const Warning: React.FC<WarningProps> = ({ message, onClose }) => {
  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg flex justify-between items-center mb-4">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-orange-700 hover:text-orange-900 transition-colors duration-200"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Warning;
