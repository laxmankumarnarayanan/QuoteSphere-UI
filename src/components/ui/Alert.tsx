import React from "react";

type AlertProps = {
  type: "error" | "warning" | "info" | "success";
  message: string;
  onClose?: () => void;
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-700 border-red-400";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-400";
      case "success":
        return "bg-green-100 text-green-700 border-green-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${getAlertStyles(type)} rounded-lg flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
