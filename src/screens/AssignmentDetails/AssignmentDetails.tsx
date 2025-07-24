import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { ArrowLeft, Clock, User, FileText, CheckCircle } from 'lucide-react';

// Import sections from DealCreationLayer with correct paths
import { CustomerDetailsSection } from '../DealCreationLayer/sections/CustomerDetailsSection/CustomerDetailsSection';
import { CustomerSelectionSection } from '../DealCreationLayer/sections/CustomerSelectionSection/CustomerSelectionSection';
import { DealCreationSection } from '../DealCreationLayer/sections/DealCreationSection/DealCreationSection';
import { SearchSection } from '../DealCreationLayer/sections/SearchSection/SearchSection';
import SpecialConditionsSection from '../DealCreationLayer/sections/SpecialConditionsSection'; // Changed to default import

interface AssignmentDetails {
  assignmentId: string;
  underwriterUserId: string;
  assignedDateTime: string;
  assignmentStatus: string;
  dealId: string;
}

interface DealData {
  dealId: string;
  customerId: string;
  customerName: string;
  dealStatus: string;
  dealPhase: string;
  initiator: string;
  // Add other deal fields as needed
}

const AssignmentDetails: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails();
    }
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch assignment details
      const assignmentResponse = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/underwriter-assignments/${assignmentId}`);
      
      if (!assignmentResponse.ok) {
        throw new Error('Failed to fetch assignment details');
      }
      
      const assignmentData = await assignmentResponse.json();
      setAssignment(assignmentData);
      
      // Fetch deal details
      if (assignmentData.dealId) {
        const dealResponse = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal/${assignmentData.dealId}`);
        
        if (dealResponse.ok) {
          const dealData = await dealResponse.json();
          setDealData(dealData);
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Assigned':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Layout currentPath={[{ label: 'Assignment Details', href: `/assignment/${assignmentId}` }]}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignment details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPath={[{ label: 'Assignment Details', href: `/assignment/${assignmentId}` }]}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAssignmentDetails}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!assignment) {
    return (
      <Layout currentPath={[{ label: 'Assignment Details', href: `/assignment/${assignmentId}` }]}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-gray-600">Assignment not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPath={[{ label: 'Assignment Details', href: `/assignment/${assignmentId}` }]}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/underwriter')}
            className="flex items-center text-brand-600 hover:text-brand-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Underwriter Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignment Details</h1>
          <p className="text-gray-600">Review assignment information and deal details</p>
        </div>

        {/* Assignment Information Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Assignment Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Assignment ID</span>
              <span className="text-gray-900 font-mono text-sm">{assignment.assignmentId}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Underwriter User ID</span>
              <span className="text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-1" />
                {assignment.underwriterUserId}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Assigned Date Time</span>
              <span className="text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDateTime(assignment.assignedDateTime)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Assignment Status</span>
              <span className="text-gray-900 flex items-center">
                {getStatusIcon(assignment.assignmentStatus)}
                <span className="ml-1">{assignment.assignmentStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Deal Details Sections */}
        {dealData && (
          <div className="space-y-6">
            {/* Deal Details Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Deal Details</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Deal ID</span>
                    <p className="text-gray-900">{dealData.dealId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Customer Name</span>
                    <p className="text-gray-900">{dealData.customerName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Deal Status</span>
                    <p className="text-gray-900">{dealData.dealStatus}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Deal Phase</span>
                    <p className="text-gray-900">{dealData.dealPhase}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Initiator</span>
                    <p className="text-gray-900">{dealData.initiator}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Selected Customer Details</h3>
              </div>
              <div className="p-6">
                <CustomerDetailsSection 
                  selectedCustomer={dealData}
                  onCustomerSelect={() => {}} // No-op for read-only view
                  isReadOnly={true}
                />
              </div>
            </div>

            {/* Product-SubProduct Combinations Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Added Product-SubProduct Combinations</h3>
              </div>
              <div className="p-6">
                {/* Import and use the product combinations section from DealCreationLayer */}
                <div className="text-gray-500 text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Product combinations will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Collaterals Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Collaterals</h3>
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Collaterals will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Documents will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Pricing & Fees Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Fees</h3>
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Pricing and fees will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Special Conditions Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Special Conditions</h3>
              </div>
              <div className="p-6">
                <SpecialConditionsSection 
                  dealId={dealData.dealId}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignmentDetails; 