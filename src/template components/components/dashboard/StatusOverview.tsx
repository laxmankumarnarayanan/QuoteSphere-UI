/**
 * StatusOverview.tsx
 * A component for displaying status counts with badges.
 */
import React from 'react';
import { StatusBadge } from '../';

interface StatusCount {
  status: string;
  count: number;
}

interface StatusOverviewProps {
  title: string;
  statusCounts: StatusCount[];
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ title, statusCounts }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {statusCounts.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <StatusBadge status={item.status as any} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusOverview