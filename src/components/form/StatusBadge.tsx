/**
 * StatusBadge.tsx
 * A reusable badge component for displaying status with different color schemes.
 */
import React from 'react';

type StatusType = 'Active' | 'On Leave' | 'Inactive' | 'Maternity Leave' | 'Remote';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'; // green with dark green text
      case 'On Leave':
        return 'bg-[#FDF4E7] text-[#8B4513]'; // beige-yellow with dark brown text
      case 'Inactive':
        return 'bg-red-400 text-white'; // soft red with white text
      case 'Maternity Leave':
        return 'bg-blue-100 text-blue-800'; // light blue with dark blue text
      case 'Remote':
        return 'bg-gray-200 text-gray-900'; // grey with black text
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;