import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface UnderwriterDeal {
  id: string;
  dealId: string;
  customerId: string;
  customerName: string;
  initiator: string;
  totalCommitmentAmount: string;
  dealPhase: string;
  status: string;
}

const Underwriter: React.FC = () => {
  const [deals, setDeals] = useState<UnderwriterDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmittedDeals();
  }, []);

  const fetchSubmittedDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/dashboard/deal/by-status/Submitted');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submitted deals');
      }
      
      const data = await response.json();
      
      // Transform the data to match our interface
      const transformedDeals: UnderwriterDeal[] = data.map((deal: any) => ({
        id: deal.id,
        dealId: deal.dealId,
        customerId: deal.customerId || 'N/A',
        customerName: deal.customerName,
        initiator: deal.initiator || 'N/A',
        totalCommitmentAmount: deal.commitmentAmount || 'N/A',
        dealPhase: deal.stage || 'Initial',
        status: deal.status
      }));
      
      setDeals(transformedDeals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDeal = (dealId: string) => {
    // Navigate to deal details page
    window.open(`/deal-details/${dealId}`, '_blank');
  };

  const handleApproveDeal = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealStatus: 'Approved',
          lastUpdatedBy: 'Underwriter'
        }),
      });

      if (response.ok) {
        // Refresh the deals list
        fetchSubmittedDeals();
      } else {
        throw new Error('Failed to approve deal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve deal');
    }
  };

  const handleRejectDeal = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealStatus: 'Rejected',
          lastUpdatedBy: 'Underwriter'
        }),
      });

      if (response.ok) {
        // Refresh the deals list
        fetchSubmittedDeals();
      } else {
        throw new Error('Failed to reject deal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject deal');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Layout currentPath={[{ label: 'Underwriter', href: '/underwriter' }]}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submitted deals...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPath={[{ label: 'Underwriter', href: '/underwriter' }]}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchSubmittedDeals}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPath={[{ label: 'Underwriter', href: '/underwriter' }]}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Underwriter Dashboard</h1>
          <p className="text-gray-600">Review and approve submitted deals</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Submitted Deals ({deals.length})</h2>
          </div>

          {deals.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No deals are currently submitted for review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Initiator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Commitment Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal Phase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deal.initiator}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.dealId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.customerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.totalCommitmentAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.dealPhase}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(deal.status)}
                          <span className="ml-2 text-sm text-gray-900">{deal.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDeal(deal.dealId)}
                            className="text-brand-600 hover:text-brand-900 flex items-center"
                            title="View Deal"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveDeal(deal.dealId)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Approve Deal"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectDeal(deal.dealId)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Reject Deal"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Underwriter; 