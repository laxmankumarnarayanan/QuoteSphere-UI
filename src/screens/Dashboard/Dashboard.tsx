import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import PrimaryButton from '../../template components/components/elements/PrimaryButton';
import { Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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

        {/* Simple Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-500">Total Deals</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-500">Awaiting Approval</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-500">Under Review</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900">25</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>

        {/* Simple Table */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Deals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Deal ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-900">DEAL-0001</td>
                  <td className="px-4 py-3 text-sm text-slate-900">Customer A</td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approved</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">$500,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-900">DEAL-0002</td>
                  <td className="px-4 py-3 text-sm text-slate-900">Customer B</td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">In Review</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">$750,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-900">DEAL-0003</td>
                  <td className="px-4 py-3 text-sm text-slate-900">Customer C</td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Submitted</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">$300,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 