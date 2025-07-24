import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { ArrowLeft, Clock, User, FileText, CheckCircle, Building, Package, Shield, FileText as FileTextIcon, DollarSign } from 'lucide-react';

// Import sections from DealCreationLayer with correct paths
import { CustomerDetailsSection } from '../DealCreationLayer/sections/CustomerDetailsSection/CustomerDetailsSection';
import SpecialConditionsSection from '../DealCreationLayer/sections/SpecialConditionsSection';
import ProductSelectionDropdowns from '../DealCreationLayer/ProductSelectionDropdowns';
import DealCollateralForm from '../../components/DealCollateralForm';

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
  createdDateTime?: string;
  lastUpdatedDateTime?: string;
}

interface DealProduct {
  dealId: string;
  productId: string;
  productName: string;
  subProductId: string;
  subProductName: string;
  accountNumber?: string;
}

interface DealCollateral {
  dealId: string;
  collateralId: string;
  collateralType: string;
  collateralValue: number;
  currency: string;
  description: string;
}

interface DealDocument {
  dealId: string;
  documentId: string;
  documentType: string;
  documentName: string;
  description: string;
  storageFilePath: string;
}

interface DealPricing {
  dealId: string;
  priceId: string;
  priceDescription: string;
  currency: string;
  standardPrice: number;
  finalPrice: number;
  feeType: string;
}

const AssignmentDetails: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [dealProducts, setDealProducts] = useState<DealProduct[]>([]);
  const [dealCollaterals, setDealCollaterals] = useState<DealCollateral[]>([]);
  const [dealDocuments, setDealDocuments] = useState<DealDocument[]>([]);
  const [dealPricing, setDealPricing] = useState<DealPricing[]>([]);
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
      
      // Fetch deal details and related data
      if (assignmentData.dealId) {
        await Promise.all([
          fetchDealData(assignmentData.dealId),
          fetchDealProducts(assignmentData.dealId),
          fetchDealCollaterals(assignmentData.dealId),
          fetchDealDocuments(assignmentData.dealId),
          fetchDealPricing(assignmentData.dealId)
        ]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDealData = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setDealData(data);
      }
    } catch (error) {
      console.error('Error fetching deal data:', error);
    }
  };

  const fetchDealProducts = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-products/deal/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setDealProducts(data);
      }
    } catch (error) {
      console.error('Error fetching deal products:', error);
    }
  };

  const fetchDealCollaterals = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-collaterals/deal/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setDealCollaterals(data);
      }
    } catch (error) {
      console.error('Error fetching deal collaterals:', error);
    }
  };

  const fetchDealDocuments = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-documents/deal/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setDealDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching deal documents:', error);
    }
  };

  const fetchDealPricing = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-pricing/deal/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setDealPricing(data);
      }
    } catch (error) {
      console.error('Error fetching deal pricing:', error);
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
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Deal Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Deal ID</span>
                    <p className="text-gray-900 font-mono text-sm">{dealData.dealId}</p>
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
                  {dealData.createdDateTime && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Created Date</span>
                      <p className="text-gray-900">{formatDateTime(dealData.createdDateTime)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Selected Customer Details
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Added Product-SubProduct Combinations
                </h3>
              </div>
              <div className="p-6">
                {dealProducts.length > 0 ? (
                  <div className="space-y-4">
                    {dealProducts.map((product, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Product</span>
                            <p className="text-gray-900">{product.productName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Sub-Product</span>
                            <p className="text-gray-900">{product.subProductName}</p>
                          </div>
                          {product.accountNumber && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Account Number</span>
                              <p className="text-gray-900">{product.accountNumber}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No product combinations found for this deal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Collaterals Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Collaterals
                </h3>
              </div>
              <div className="p-6">
                {dealCollaterals.length > 0 ? (
                  <div className="space-y-4">
                    {dealCollaterals.map((collateral, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Type</span>
                            <p className="text-gray-900">{collateral.collateralType}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Value</span>
                            <p className="text-gray-900">{collateral.collateralValue} {collateral.currency}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Description</span>
                            <p className="text-gray-900">{collateral.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No collaterals found for this deal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileTextIcon className="w-5 h-5 mr-2" />
                  Documents
                </h3>
              </div>
              <div className="p-6">
                {dealDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {dealDocuments.map((document, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Document Type</span>
                            <p className="text-gray-900">{document.documentType}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Document Name</span>
                            <p className="text-gray-900">{document.documentName}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-sm font-medium text-gray-700">Description</span>
                            <p className="text-gray-900">{document.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No documents found for this deal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Fees Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing & Fees
                </h3>
              </div>
              <div className="p-6">
                {dealPricing.length > 0 ? (
                  <div className="space-y-4">
                    {dealPricing.map((pricing, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Description</span>
                            <p className="text-gray-900">{pricing.priceDescription}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Currency</span>
                            <p className="text-gray-900">{pricing.currency}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Standard Price</span>
                            <p className="text-gray-900">{pricing.standardPrice}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Final Price</span>
                            <p className="text-gray-900">{pricing.finalPrice}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Fee Type</span>
                            <p className="text-gray-900">{pricing.feeType}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No pricing information found for this deal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Conditions Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Special Conditions
                </h3>
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