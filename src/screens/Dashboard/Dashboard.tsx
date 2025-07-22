import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import StatusOverview from '../../template components/components/dashboard/StatusOverview';
import MetricCard from '../../template components/components/dashboard/MetricCard';
import Table from '../../template components/components/elements/Table';
import { 
  getDealStatusCounts, 
  getDashboardMetrics, 
  getAllDeals, 
  getMyDeals, 
  getDealsByStatus,
  DealStatusCount,
  DashboardMetric,
  DealTableRow
} from '../../services/dashboardService';
import Toggle from '../../template components/components/elements/Toggle';
import StatusBadge from '../../template components/components/elements/StatusBadge';

const Dashboard: React.FC = () => {
  const [dealStatusCounts, setDealStatusCounts] = useState<DealStatusCount[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>([]);
  const [allDeals, setAllDeals] = useState<DealTableRow[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealTableRow[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'review' | 'completed'>('all');
  const [isManagerView, setIsManagerView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterDeals();
  }, [activeFilter, allDeals, isManagerView]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statusCounts, metrics, deals] = await Promise.all([
        getDealStatusCounts(),
        getDashboardMetrics(),
        getAllDeals()
      ]);
      
      setDealStatusCounts(statusCounts);
      setDashboardMetrics(metrics);
      setAllDeals(deals);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDeals = async () => {
    if (activeFilter === 'all') {
      setFilteredDeals(allDeals);
    } else if (activeFilter === 'my' && isManagerView) {
      const myDeals = await getMyDeals('laxman.narayanan@fractalhive.com');
      setFilteredDeals(myDeals);
    } else if (activeFilter === 'review') {
      const reviewDeals = await getDealsByStatus('Submitted');
      setFilteredDeals(reviewDeals);
    } else if (activeFilter === 'completed') {
      const completedDeals = await getDealsByStatus('Approved');
      setFilteredDeals(completedDeals);
    }
  };

  const handleFilterChange = (filter: 'all' | 'my' | 'review' | 'completed') => {
    setActiveFilter(filter);
  };

  const tableColumns = [
    {
      key: 'dealId' as keyof DealTableRow,
      header: 'Deal ID',
      width: '120px',
      sortable: true,
    },
    {
      key: 'priority' as keyof DealTableRow,
      header: 'Priority',
      width: '100px',
      sortable: true,
      render: (row: DealTableRow) => (
        <StatusBadge 
          status={row.priority === 'High' ? 'Active' : 'Inactive'} 
        />
      ),
    },
    {
      key: 'customerName' as keyof DealTableRow,
      header: 'Customer Name',
      width: '200px',
      sortable: true,
    },
    {
      key: 'commitmentAmount' as keyof DealTableRow,
      header: 'Commitment Amount',
      width: '150px',
      sortable: true,
      align: 'right' as const,
    },
    {
      key: 'stage' as keyof DealTableRow,
      header: 'Stage',
      width: '120px',
      sortable: true,
      render: (row: DealTableRow) => (
        <StatusBadge status={row.stage as any} />
      ),
    },
    {
      key: 'status' as keyof DealTableRow,
      header: 'Status',
      width: '120px',
      sortable: true,
      render: (row: DealTableRow) => (
        <StatusBadge status={row.status as any} />
      ),
    },
  ];

  const filterButtons = [
    { id: 'all', label: 'All Deals', active: activeFilter === 'all' },
    { 
      id: 'my', 
      label: 'My Deals', 
      active: activeFilter === 'my',
      disabled: !isManagerView 
    },
    { id: 'review', label: 'In Review', active: activeFilter === 'review' },
    { id: 'completed', label: 'Completed', active: activeFilter === 'completed' },
  ];

  return (
    <Layout currentPath={[{ label: 'Dashboard', href: '/dashboard' }]}>
      <div className="space-y-6">
        {/* Section 1: Deal Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatusOverview
            title="Deal Status Overview"
            statusCounts={dealStatusCounts}
          />
        </div>

        {/* Section 2: Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>

        {/* Section 3: Deals Table */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          {/* Table Header with Filters */}
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-800 flex-shrink-0">Deals Overview</h2>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-start sm:justify-end flex-wrap">
              {/* Manager View Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Manager View</span>
                <Toggle
                  id="manager-view"
                  checked={isManagerView}
                  onChange={setIsManagerView}
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                {filterButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleFilterChange(button.id as any)}
                    disabled={button.disabled}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      button.active
                        ? 'bg-brand-500 text-white'
                        : button.disabled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <Table
            columns={tableColumns}
            data={filteredDeals}
            isLoading={isLoading}
            enableSorting={true}
            enableGlobalFilter={true}
            enablePagination={true}
            pageSize={10}
            className=""
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 