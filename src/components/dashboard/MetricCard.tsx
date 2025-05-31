/**
 * MetricCard.tsx
 * A component for displaying key metrics in a clean, modern card layout.
 */
import React from 'react';

interface MetricCardProps {
  value: string | number;
  label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </div>
      </div>
    </div>
  );
}

export default MetricCard