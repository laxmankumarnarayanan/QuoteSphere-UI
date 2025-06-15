import React from 'react';
import StatusBadge, { StatusType } from './StatusBadge'; 

interface StatusCount {
  status: StatusType;
  count: number;
}

interface StatusOverviewProps {
  title: string;
  statusCounts: StatusCount[];
  className?: string;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ title, statusCounts, className }) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg p-5 transition-all duration-300 ease-in-out
        hover:shadow-xl 
        ${className || ''}
      `}
    >
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {statusCounts.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <StatusBadge status={item.status} />
            <span className="text-sm font-medium text-slate-600">
              {item.count}
            </span>
          </div>
        ))}
         {statusCounts.length === 0 && (
            <p className="text-sm text-slate-500">No status data available.</p>
        )}
      </div>
    </div>
  );
};

export default StatusOverview;