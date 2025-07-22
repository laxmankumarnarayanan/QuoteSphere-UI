import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import StatusOverview from '../../template components/components/dashboard/StatusOverview';
import PrimaryButton from '../../template components/components/elements/PrimaryButton';
import { Plus } from 'lucide-react';

// Interface for deal status counts
interface DealStatusCount {
  status: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dealStatusCounts, setDealStatusCounts] = useState<DealStatusCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDealStatusCounts();
  }, []);

  const loadDealStatusCounts = async () => {
    setIsLoading(true);
    try {
      // Fetch deal status counts from the backend
      const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/status-counts');
      if (response.ok) {
        const data = await response.json();
        setDealStatusCounts(data);
      } else {
        // Fallback to mock data if API fails
        setDealStatusCounts([
          { status: 'Draft', count: 15 },
          { status: 'Submitted', count: 8 },
          { status: 'In Review', count: 12 },
          { status: 'Approved', count: 25 },
          { status: 'Rejected', count: 3 },
        ]);
      }
    } catch (error) {
      console.error('Error fetching deal status counts:', error);
      // Fallback to mock data
      setDealStatusCounts([
        { status: 'Draft', count: 15 },
        { status: 'Submitted', count: 8 },
        { status: 'In Review', count: 12 },
        { status: 'Approved', count: 25 },
        { status: 'Rejected', count: 3 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeal = () => {
    navigate('/deal-creation');
  };

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

        {/* Loading state for Section 1 */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 