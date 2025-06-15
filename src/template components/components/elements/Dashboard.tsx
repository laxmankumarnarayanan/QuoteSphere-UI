import React from 'react';
import MetricCard from './MetricCard';
import StatusOverview from './StatusOverview';
import { Users, Briefcase, DollarSign, BarChart2 } from 'lucide-react'; 




interface DashboardMetric {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

interface DashboardStatusCount {
    status: string; 
    count: number;
}
interface DashboardProps {
  metrics?: DashboardMetric[];
  statusOverviewTitle?: string;
  statusCounts?: DashboardStatusCount[];
  className?: string;
}

const defaultMetrics: DashboardMetric[] = [
    { value: "$125,670", label: "Total Revenue", icon: <DollarSign size={20}/>, trend: "up", trendValue: "+12.5%" },
    { value: "1,280", label: "Active Users", icon: <Users size={20}/>, trend: "up", trendValue: "+80" },
    { value: "35", label: "Open Projects", icon: <Briefcase size={20}/>, trend: "neutral", trendValue: "-2" },
    { value: "72%", label: "Task Completion", icon: <BarChart2 size={20}/>, trend: "down", trendValue: "-3%" },
];

const defaultStatusCounts: DashboardStatusCount[] = [
    { status: "Active", count: 145 },
    { status: "On Leave", count: 23 },
    { status: "Inactive", count: 12 },
    { status: "Remote", count: 67 },
];


const Dashboard: React.FC<DashboardProps> = ({
    metrics = defaultMetrics,
    statusOverviewTitle = "Employee Status Overview",
    statusCounts = defaultStatusCounts,
    className
}) => {
  return (
    <div className={`space-y-6 ${className || ''}`}>

      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((metric, index) => (
            <MetricCard
                key={index}
                value={metric.value}
                label={metric.label}
                icon={metric.icon}
                trend={metric.trend}
                trendValue={metric.trendValue}
            />
            ))}
        </div>
      )}

      {statusCounts.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5"> 
            <StatusOverview
                title={statusOverviewTitle}
                statusCounts={statusCounts}
            />
           
        </div>
      )}
    </div>
  );
};

export default Dashboard;