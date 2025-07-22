import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import StatusOverview from '../../template components/components/dashboard/StatusOverview';
import MetricCard from '../../template components/components/dashboard/MetricCard';
import Table from '../../template components/components/elements/Table';
import PrimaryButton from '../../template components/components/elements/PrimaryButton';
import StatusBadge from '../../template components/components/elements/StatusBadge';
import { Plus } from 'lucide-react';

// Interfaces
interface DealStatusCount {
  status: string;
  count: number;
}

interface DashboardMetric {
  value: string | number;
  label: string;
}

interface DealTableRow {
  id: string;
  dealId: string;
  priority: string;
  customerName: string;
  commitmentAmount: string;
  stage: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dealStatusCounts, setDealStatusCounts] = useState<DealStatusCount[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>([]);
  const [allDeals, setAllDeals] = useState<DealTableRow[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealTableRow[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'review' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterDeals();
  }, [activeFilter, allDeals]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load Section 1: Deal Status Counts
      const statusResponse = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/status-counts');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setDealStatusCounts(statusData);
      } else {
        setDealStatusCounts([
          { status: 'Draft', count: 15 },
          { status: 'Submitted', count: 8 },
          { status: 'In Review', count: 12 },
          { status: 'Approved', count: 25 },
          { status: 'Rejected', count: 3 },
        ]);
      }

      // Load Section 2: Dashboard Metrics (placeholder data for now)
      setDashboardMetrics([
        { value: '8', label: 'Awaiting Approval' },
        { value: '12', label: 'Ready for Signature' },
        { value: '15', label: 'Under Review' },
        { value: '25', label: 'Closed This Quarter' },
      ]);

      // Load Section 3: All Deals
      const dealsResponse = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/all');
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();
        setAllDeals(dealsData);
      } else {
        // Fallback to mock data
        setAllDeals(generateMockDealData());
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set fallback data
      setDealStatusCounts([
        { status: 'Draft', count: 15 },
        { status: 'Submitted', count: 8 },
        { status: 'In Review', count: 12 },
        { status: 'Approved', count: 25 },
        { status: 'Rejected', count: 3 },
      ]);
      setDashboardMetrics([
        { value: '8', label: 'Awaiting Approval' },
        { value: '12', label: 'Ready for Signature' },
        { value: '15', label: 'Under Review' },
        { value: '25', label: 'Closed This Quarter' },
      ]);
      setAllDeals(generateMockDealData());
    } finally {
      setIsLoading(false);
    }
  };

  const filterDeals = async () => {
    if (activeFilter === 'all') {
      setFilteredDeals(allDeals);
    } else if (activeFilter === 'my') {
      try {
        const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/by-initiator/laxman.narayanan@fractalhive.com');
        if (response.ok) {
          const data = await response.json();
          setFilteredDeals(data);
        } else {
          setFilteredDeals(allDeals.filter(deal => Math.random() > 0.5)); // Random filter for demo
        }
      } catch (error) {
        setFilteredDeals(allDeals.filter(deal => Math.random() > 0.5));
      }
    } else if (activeFilter === 'review') {
      try {
        const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/by-status/Submitted');
        if (response.ok) {
          const data = await response.json();
          setFilteredDeals(data);
        } else {
          setFilteredDeals(allDeals.filter(deal => deal.status === 'Submitted'));
        }
      } catch (error) {
        setFilteredDeals(allDeals.filter(deal => deal.status === 'Submitted'));
      }
    } else if (activeFilter === 'completed') {
      try {
        const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/by-status/Approved');
        if (response.ok) {
          const data = await response.json();
          setFilteredDeals(data);
        } else {
          setFilteredDeals(allDeals.filter(deal => deal.status === 'Approved'));
        }
      } catch (error) {
        setFilteredDeals(allDeals.filter(deal => deal.status === 'Approved'));
      }
    }
  };

  const handleFilterChange = (filter: 'all' | 'my' | 'review' | 'completed') => {
    setActiveFilter(filter);
  };

  const handleCreateDeal = () => {
    navigate('/deal-creation');
  };

  // Helper function to generate mock data
  const generateMockDealData = (): DealTableRow[] => {
    const mockDeals: DealTableRow[] = [];
    const statuses = ['Draft', 'Submitted', 'In Review', 'Approved', 'Rejected'];
    const stages = ['Initial', 'Under Review', 'Approved', 'Closed'];
    const priorities = ['High', 'Low'];
    
    for (let i = 1; i <= 20; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const currencies = ['USD', 'EUR', 'GBP', 'INR'];
      const currency = currencies[Math.floor(Math.random() * currencies.length)];
      const amount = Math.floor(Math.random() * 1000000) + 100000;
      
      mockDeals.push({
        id: `deal-${i}`,
        dealId: `DEAL-${String(i).padStart(4, '0')}`,
        priority,
        customerName: `Customer ${i}`,
        commitmentAmount: `${currency} ${amount.toLocaleString()}`,
        stage,
        status,
      });
    }
    
    return mockDeals;
  };

  // Table columns configuration
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
    { id: 'my', label: 'My Deals', active: activeFilter === 'my' },
    { id: 'review', label: 'In Review', active: activeFilter === 'review' },
    { id: 'completed', label: 'Completed', active: activeFilter === 'completed' },
  ];

  return (
    <Layout currentPath={[{ label: 'Dashboard', href: '/dashboard' }]}>
      <div className="space-y-6">
        {/* Header with Create Deal Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome to QuoteSphere - Your Deal Management Hub</p>
          </div>
          <PrimaryButton
            onClick={handleCreateDeal}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Deal
          </PrimaryButton>
        </div>

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
            <div className="flex items-center gap-2">
              {filterButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => handleFilterChange(button.id as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    button.active
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {button.label}
                </button>
              ))}
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