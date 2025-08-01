import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { ArrowLeft, Clock, User, FileText, CheckCircle, Building, Package, Shield, FileText as FileTextIcon, DollarSign, Download, Eye } from 'lucide-react';

// Import sections from DealCreationLayer with correct paths
import { CustomerDetailsSection } from '../DealCreationLayer/sections/CustomerDetailsSection/CustomerDetailsSection';
import SpecialConditionsSection from '../DealCreationLayer/sections/SpecialConditionsSection';
import { CustomerDetails, customerService } from '../../services/customerService';
import { UnderwriterFinancialAnalysisSection } from '../../components/UnderwriterFinancialAnalysisSection';
import { UnderwriterDocumentsSection } from '../../components/UnderwriterDocumentsSection';
import { LegalDealDocumentsSection } from '../../components/LegalDealDocumentsSection';
import { LegalDealCommentsSection } from '../../components/LegalDealCommentsSection';
import DealPricingTable from '../../components/DealPricingTable';
import DealRatesTable from '../../components/DealRatesTable';

interface LegalAssignmentDetails {
  assignmentId: string;
  assignedDateTime: string;
  assignmentStatus: string;
  dealId: string;
  priority: string;
  status: string;
}

interface DealData {
  id: string;
  dealId: string;
  customerId: string;
  customerName: string;
  initiator: string;
  dealPhase: string;
  status: string;
}

interface ProductSubProductCombination {
  dealId: string; // Add this field
  productId: string;
  productDescription: string;
  accountNumber?: string;
  subProducts: Array<{
    subProductId: string;
    subProductDescription: string;
    commitments: Array<{
      currency: string;
      commitmentAmount: number;
      tenure: number;
      description: string;
    }>;
  }>;
}

interface DealCollateral {
  id: {
    dealID: string;
    collateralID: number;
  };
  collateralType: string;
  collateralValue: number;
  currency: string;
  description: string;
  storagePath?: string;
}

interface DealDocument {
  id: {
    dealID: string;
    documentID: number;
  };
  documentCategory: string;
  documentType: string;
  documentName: string;
  description: string;
  storageFilePath?: string;
}

interface DealPricing {
  id: {
    dealId: string;
    businessDomainId: string;
    productId: string;
    subProductId: string;
    priceId: string;
  };
  priceDescription: string;
  currency: string;
  standardPrice: number;
  preferentialType: string;
  discountPercentage: number;
  finalPrice: number;
  feeType: string;
  feePercentage: number;
  flatFeeAmount: number;
  feeCap: number;
  maxDiscountAmount: number;
  calculatedFeeAmount: number;
  totalCommitmentAmount: number;
  discountAmount: number;
}

const LegalAssignmentDetails: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignmentDetails, setAssignmentDetails] = useState<LegalAssignmentDetails | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [productCombinations, setProductCombinations] = useState<ProductSubProductCombination[]>([]);
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
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-assignments/${assignmentId}`);
      if (response.ok) {
        const data = await response.json();
        setAssignmentDetails(data);
        if (data.dealId) {
          await Promise.all([
            fetchDealData(data.dealId),
            fetchProductCombinations(data.dealId),
            fetchDealCollaterals(data.dealId),
            fetchDealDocuments(data.dealId),
            fetchDealPricing(data.dealId)
          ]);
        }
      } else {
        setError('Failed to fetch assignment details');
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      setError('Error fetching assignment details');
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
        // Fetch customer details after getting deal data
        if (data.customerId) {
          await fetchCustomerDetails(data.customerId);
        }
      }
    } catch (error) {
      console.error('Error fetching deal data:', error);
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      console.log('Fetching customer details for ID:', customerId);
      const customerData = await customerService.getCustomerDetails(customerId);
      console.log('Customer details received:', customerData);
      setCustomerDetails(customerData);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const fetchProductCombinations = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-products/deal/${dealId}/with-details`);
      if (response.ok) {
        const data = await response.json();
        setProductCombinations(data);
      }
    } catch (error) {
      console.error('Error fetching product combinations:', error);
    }
  };

  const fetchDealCollaterals = async (dealId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-collateral/deal/${dealId}`);
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
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/deal-pricing`);
      if (response.ok) {
        const allPricing = await response.json();
        const filteredPricing = allPricing.filter((pricing: any) => pricing.id.dealId === dealId);
        setDealPricing(filteredPricing);
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

  const downloadFile = async (storagePath: string, fileName: string) => {
    try {
      // Check if storagePath already contains the full URL
      let blobName = storagePath;
      if (storagePath.includes('https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/')) {
        // Extract just the blob name from the full URL
        blobName = storagePath.replace('https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/', '');
      }
      
      // Get SAS token for the file
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/azure-sas/read-sas?blobName=${encodeURIComponent(blobName)}`);
      if (!response.ok) {
        throw new Error('Failed to get SAS token');
      }
      const sasToken = await response.text();
      
      // Construct the full URL with SAS token
      const fullUrl = `https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/${blobName}?${sasToken}`;
      
      // Open in new tab
      window.open(fullUrl, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout currentPath={[{ label: 'Legal Assignment Details', href: `/legal-assignment/${assignmentId}` }]}>
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
      <Layout currentPath={[{ label: 'Legal Assignment Details', href: `/legal-assignment/${assignmentId}` }]}>
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

  if (!assignmentDetails) {
    return (
      <Layout currentPath={[{ label: 'Legal Assignment Details', href: `/legal-assignment/${assignmentId}` }]}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-gray-600">Assignment not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPath={[
      { label: 'Legal', href: '/legal' },
      { label: 'Assignment Details', href: `/legal-assignment/${assignmentId}` }
    ]}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/legal')}
            className="flex items-center text-brand-600 hover:text-brand-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Legal Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Legal Assignment Details</h1>
          <p className="text-gray-600">Review assignment information and deal details (Read Only)</p>
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
              <span className="text-gray-900 font-mono text-sm">{assignmentDetails.assignmentId}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Assigned Date Time</span>
              <span className="text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDateTime(assignmentDetails.assignedDateTime)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Assignment Status</span>
              <span className="text-gray-900 flex items-center">
                {getStatusIcon(assignmentDetails.assignmentStatus)}
                <span className="ml-1">{assignmentDetails.assignmentStatus}</span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Priority</span>
              <span className="text-gray-900 flex items-center">
                <span className="ml-1">{assignmentDetails.priority}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Deal Details */}
        {dealData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Deal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Deal ID</p>
                <p className="font-medium">{dealData.dealId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer ID</p>
                <p className="font-medium">{dealData.customerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{dealData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Initiator</p>
                <p className="font-medium">{dealData.initiator}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deal Phase</p>
                <p className="font-medium">{dealData.dealPhase}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{dealData.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Customer Details */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Selected Customer Details
            </h3>
          </div>
          <div className="p-6">
            {customerDetails ? (
              <CustomerDetailsSection 
                selectedCustomer={customerDetails}
                onCustomerSelect={() => {}} // No-op for read-only view
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading customer details...</p>
              </div>
            )}
          </div>
        </div>

        {/* Added Product-SubProduct Combinations */}
        <div className="mb-6 border border-brand-200 rounded-lg bg-brand-50 p-4">
          <div className="font-semibold text-brand-800 mb-2">Added Product-SubProduct Combinations:</div>
          {productCombinations.length > 0 ? (
            <div className="space-y-4">
              {productCombinations.map((product, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="mb-3">
                    <div className="flex gap-6 items-center mb-2">
                      <span className="text-sm font-medium text-brand-900">Product: <span className="font-normal text-slate-800">{product.productDescription || 'No description'}</span></span>
                      {product.accountNumber && (
                        <span className="text-sm font-medium text-brand-900">Account: <span className="font-normal text-slate-800">{product.accountNumber}</span></span>
                      )}
                    </div>
                    
                    {product.subProducts && product.subProducts.length > 0 ? (
                      <div className="space-y-3">
                        {product.subProducts.map((subProduct, subIndex) => (
                          <div key={subIndex} className="border-l-2 border-brand-200 pl-4">
                            <div className="flex gap-6 items-center mb-2">
                              <span className="text-sm font-medium text-brand-900">SubProduct: <span className="font-normal text-slate-800">{subProduct.subProductDescription || 'No description'}</span></span>
                            </div>
                            
                            {subProduct.commitments && subProduct.commitments.length > 0 && (
                              <div className="mt-3 pl-4 border-l-2 border-brand-200">
                                <div className="font-medium text-brand-700 mb-1">Deal Commitments:</div>
                                <div className="space-y-1">
                                  {subProduct.commitments.map((commitment, commitIndex) => (
                                    <div key={commitIndex} className="flex gap-4 items-center text-sm text-slate-800 bg-gray-50 p-2 rounded">
                                      <span>Commitment #{commitIndex + 1}:</span>
                                      <span>Currency: <span className="font-medium">{commitment.currency}</span></span>
                                      <span>Amount: <span className="font-medium">{commitment.commitmentAmount}</span></span>
                                      <span>Tenure: <span className="font-medium">{commitment.tenure}</span></span>
                                      {commitment.description && (
                                        <span>Description: <span className="font-medium">{commitment.description}</span></span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Pricing and Fees Details within each combination */}
                            <div className="mt-4">
                              <DealPricingTable 
                                dealId={assignmentDetails?.dealId || ''} 
                                productId={product.productId}
                                subProductId={subProduct.subProductId}
                              />
                            </div>

                            {/* Rate Details within each combination */}
                            <div className="mt-4">
                              <DealRatesTable 
                                dealId={assignmentDetails?.dealId || ''} 
                                productId={product.productId}
                                subProductId={subProduct.subProductId}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No sub-products found for this product</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No product combinations found</p>
          )}
        </div>

        {/* Collaterals Section */}
        <div className="mb-6 border border-brand-200 rounded-lg bg-brand-50 p-4">
          <div className="font-semibold text-brand-800 mb-2">Collaterals:</div>
          {dealCollaterals.length > 0 ? (
            <div className="space-y-4">
              {dealCollaterals.map((collateral, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-brand-900">Type: </span>
                      <span className="text-sm text-slate-800">{collateral.collateralType}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Value: </span>
                      <span className="text-sm text-slate-800">{collateral.collateralValue} {collateral.currency}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Description: </span>
                      <span className="text-sm text-slate-800">{collateral.description}</span>
                    </div>
                  </div>
                  {collateral.storagePath && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => downloadFile(collateral.storagePath!, `collateral-${index + 1}.pdf`)}
                        className="flex items-center gap-2 px-3 py-1 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No collaterals found</p>
          )}
        </div>

        {/* Documents Section */}
        <div className="mb-6 border border-brand-200 rounded-lg bg-brand-50 p-4">
          <div className="font-semibold text-brand-800 mb-2">Documents:</div>
          {dealDocuments.length > 0 ? (
            <div className="space-y-4">
              {dealDocuments.map((document, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-brand-900">Document Type: </span>
                      <span className="text-sm text-slate-800">{document.documentType}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Document Name: </span>
                      <span className="text-sm text-slate-800">{document.documentName}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-brand-900">Description: </span>
                      <span className="text-sm text-slate-800">{document.description}</span>
                    </div>
                  </div>
                  {document.storageFilePath && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => downloadFile(document.storageFilePath!, document.documentName)}
                        className="flex items-center gap-2 px-3 py-1 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No documents found</p>
          )}
        </div>

        {/* Pricing & Fees Section */}
        <div className="mb-6 border border-brand-200 rounded-lg bg-brand-50 p-4">
          <div className="font-semibold text-brand-800 mb-2">Pricing & Fees:</div>
          {dealPricing.length > 0 ? (
            <div className="space-y-4">
              {dealPricing.map((pricing, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-brand-900">Description: </span>
                      <span className="text-sm text-slate-800">{pricing.priceDescription}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Currency: </span>
                      <span className="text-sm text-slate-800">{pricing.currency}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Standard Price: </span>
                      <span className="text-sm text-slate-800">{pricing.standardPrice}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Final Price: </span>
                      <span className="text-sm text-slate-800">{pricing.finalPrice}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Fee Type: </span>
                      <span className="text-sm text-slate-800">{pricing.feeType}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Fee Percentage: </span>
                      <span className="text-sm text-slate-800">{pricing.feePercentage}%</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Flat Fee Amount: </span>
                      <span className="text-sm text-slate-800">{pricing.flatFeeAmount}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-brand-900">Calculated Fee: </span>
                      <span className="text-sm text-slate-800">{pricing.calculatedFeeAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pricing information found</p>
          )}
        </div>

        {/* Special Conditions Section */}
        <div className="mb-6 border border-brand-200 rounded-lg bg-brand-50 p-4">
          <div className="font-semibold text-brand-800 mb-2">Special Conditions:</div>
          <div className="bg-white p-3 rounded border">
            <SpecialConditionsSection 
              dealId={assignmentDetails.dealId}
              readOnly={true}
            />
          </div>
        </div>

        {/* Underwriter Financial Analysis Section (Read Only) */}
        <div className="mb-6">
          <UnderwriterFinancialAnalysisSection 
            dealId={assignmentDetails.dealId}
            assignmentId={assignmentDetails.assignmentId}
            readOnly={true}
          />
        </div>

        {/* Underwriter Documents Section (Read Only) */}
        <div className="mb-6">
          <UnderwriterDocumentsSection 
            dealId={assignmentDetails.dealId}
            assignmentId={assignmentDetails.assignmentId}
            readOnly={true}
          />
        </div>

        {/* Legal Documents Section */}
        <div className="mb-6">
          <LegalDealDocumentsSection 
            dealId={assignmentDetails.dealId}
            assignmentId={assignmentDetails.assignmentId}
            readOnly={false}
          />
        </div>

        {/* Legal Comments Section */}
        <div className="mb-6">
          <LegalDealCommentsSection 
            dealId={assignmentDetails.dealId}
            assignmentId={assignmentDetails.assignmentId}
            readOnly={false}
          />
        </div>

        {/* Submit Legal Analysis Button */}
        <div className="flex justify-end">
          <button
            onClick={() => alert("The Legal Analysis is submitted. Please update the DealPhase and DealStatus in the Deal table as needed")}
            className="px-6 py-3 text-base font-semibold text-white rounded-lg shadow-md border border-transparent bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-brand-500 flex items-center justify-center"
          >
            Submit Legal Analysis
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LegalAssignmentDetails; 