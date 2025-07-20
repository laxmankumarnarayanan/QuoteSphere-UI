import React, { ReactNode } from 'react';

interface MetricCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode; 
  trend?: 'up' | 'down' | 'neutral'; 
  trendValue?: string; 
  className?: string;
  onClick?: () => void; 
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  icon,
  trend,
  trendValue,
  className,
  onClick,
}) => {
  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-500',
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg p-5 transition-all duration-300 ease-in-out
        hover:shadow-xl hover:scale-[1.02]
        ${onClick ? 'cursor-pointer' : ''}
        ${className || ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <div className={`text-xs font-medium text-slate-500 uppercase tracking-wider`}>
          {label}
        </div>
        {icon && <div className="text-brand-500 opacity-80">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-2">
        {value}
      </div>
      {trend && trendValue && (
        <div className={`text-xs flex items-center ${trendClasses[trend]}`}>
          {}
          <span>{trendValue}</span>
          <span className="ml-1 text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;