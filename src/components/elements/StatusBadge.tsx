import React from 'react';

export type StatusType = 'Active' | 'On Leave' | 'Inactive' | 'Maternity Leave' | 'Remote' | string; 

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: StatusType): string => {
    switch (status.toLowerCase()) { 
      case 'active':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'on leave':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'inactive':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'maternity leave':
        return 'bg-sky-100 text-sky-700 border border-sky-300'; 
      case 'remote':
        return 'bg-indigo-100 text-indigo-700 border border-indigo-300'; 
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyles(status)} ${className || ''}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;