/**
 * Dashboard.tsx
 * Main dashboard component combining metrics and status overview.
 */
import React from "react";
import MetricCard from "./MetricCard";
import StatusOverview from "./StatusOverview";

const Dashboard: React.FC = () => {
  const metrics = [
    { value: "$45,231", label: "Total Revenue" },
    { value: "89%", label: "Team Productivity" },
    { value: "2,405", label: "Active Projects" },
  ];

  const statusCounts = [
    { status: "Active", count: 145 },
    { status: "On Leave", count: 23 },
    { status: "Inactive", count: 12 },
    { status: "Maternity Leave", count: 5 },
    { status: "Remote", count: 67 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} value={metric.value} label={metric.label} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusOverview
          title="Employee Status Overview"
          statusCounts={statusCounts}
        />
      </div>
    </div>
  );
};

export default Dashboard;
