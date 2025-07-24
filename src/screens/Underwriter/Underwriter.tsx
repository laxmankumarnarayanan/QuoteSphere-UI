import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { UserPlus } from 'lucide-react';
import { underwriterService } from '../../services/underwriterService';

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
  const [assigningDealId, setAssigningDealId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmittedDeals();
  }, []);

  const fetchSubmittedDeals = async () => {
    try {
      setLoading(true);
      const deals = await underwriterService.getSubmittedDeals();
      setDeals(deals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDeal = async (dealId: string) => {
    try {
      setAssigningDealId(dealId);
      
      // You can customize the priority here if needed
      const priority = "Medium"; // Default priority
      
      await underwriterService.assignDealToUnderwriter(dealId, priority);
      
      // Show success message
      alert('Deal assigned successfully!');
      // Refresh the deals list
      fetchSubmittedDeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign deal');
    } finally {
      setAssigningDealId(null);
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
          <p className="text-gray-600">Review and assign submitted deals</p>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleAssignDeal(deal.dealId)}
                          disabled={assigningDealId === deal.dealId}
                          className={`text-brand-600 hover:text-brand-900 flex items-center ${
                            assigningDealId === deal.dealId ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Assign Deal"
                        >
                          {assigningDealId === deal.dealId ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600"></div>
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                          <span className="ml-1">Assign</span>
                        </button>
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