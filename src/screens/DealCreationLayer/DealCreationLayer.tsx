import { BellIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import TextInput from "@template/form/TextInput";
import PrimaryButton from "@template/elements/PrimaryButton";
import SecondaryButton from "@template/elements/SecondaryButton";
import { CustomerDetailsSection } from "./sections/CustomerDetailsSection/CustomerDetailsSection";
import { CustomerSelectionSection } from "./sections/CustomerSelectionSection/CustomerSelectionSection";
import { DealCreationSection } from "@sections/DealCreationSection/DealCreationSection";
import { Customer, CustomerDetails } from "../../services/customerService";
import { dealService, Deal } from '../../services/dealService';
import { ProductSelectionDropdowns } from "./ProductSelectionDropdowns";
import { CustomerInfoBanner } from "./CustomerInfoBanner";
import DealCollateralForm from "../../components/DealCollateralForm";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import SpecialConditionsSection from "./sections/SpecialConditionsSection";
import { DealFinancialStatus } from '../../services/dealFinancialStatusService';
import { DealCommitment, getDealCommitmentsByDealId } from '../../services/dealCommitmentService';
import DealPricingTable from '../../components/DealPricingTable';

// Step data for the progress stepper
const stepsData = [
 { number: 1, title: "Customer Selection" },
 { number: 2, title: "Product Selection" },
 { number: 3, title: "Collateral & Documentation" },
 { number: 4, title: "Pricing and Fees" },
 { number: 5, title: "Special Conditions" },
];

function DealDetailsContainer({ deal }: { deal: Deal | null }) {
 if (!deal) return null;
 return (
   <Card className="w-full shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea] mb-6">
     <CardHeader className="px-4 py-[19px]">
       <CardTitle className="font-semibold text-base text-[#242524] font-['Archivo',Helvetica]">
         Deal Details
       </CardTitle>
     </CardHeader>
     <CardContent className="px-4 py-4">
       <dl className="divide-y divide-gray-200">
         <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
           <dt className="text-sm font-medium text-gray-500">Deal ID</dt>
           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.dealId}</dd>
         </div>
         <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
           <dt className="text-sm font-medium text-gray-500">Deal Status</dt>
           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.dealStatus}</dd>
         </div>
         <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
           <dt className="text-sm font-medium text-gray-500">Created DateTime</dt>
           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.createdDateTime ? new Date(deal.createdDateTime).toLocaleString() : "-"}</dd>
         </div>
         <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
           <dt className="text-sm font-medium text-gray-500">Created By</dt>
           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.createdBy || deal.initiator || "-"}</dd>
         </div>
       </dl>
     </CardContent>
   </Card>
 );
}

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';
const AZURE_CONTAINER_URL = "https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer";

function FinancialStatusesDisplay({ 
 financialStatuses, 
 getViewUrl 
}: { 
 financialStatuses: DealFinancialStatus[];
 getViewUrl: (blobName: string) => Promise<string>;
}) {
 if (financialStatuses.length === 0) return null;

 const handleViewAttachment123 = async (fs: DealFinancialStatus) => {
   console.log('handleViewAttachment123 called', fs);
   if (!fs.storagePath) {
     console.log('No storage path found');
     return;
   }
   try {
     // Extract the exact blob name from the stored storagePath
     console.log('Storage Path:', fs.storagePath);
     const parts = fs.storagePath.split("/");
     const blobName = parts[parts.length - 1].split("?")[0];
     console.log('Extracted blob name:', blobName);
     
     // Use the getViewUrl prop to get the final URL with SAS
     const finalUrl = await getViewUrl(blobName);
     console.log('Final URL constructed:', finalUrl);
     window.open(finalUrl, "_blank", "noopener,noreferrer");
   } catch (error) {
     console.error('Error viewing attachment:', error);
     alert('Failed to open document. Please try again.');
   }
 };

 return (
   <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
     <div className="font-semibold text-violet-800 mb-2">Deal Financial Status</div>
     <div className="space-y-2">
       {financialStatuses.map((fs, i) => (
         <div key={fs.year + '-' + i} className="flex gap-6 items-center text-sm text-slate-800 bg-white p-3 rounded border">
           <span>Year: <span className="font-medium">{fs.year}</span></span>
           <span>Description: <span className="font-medium">{fs.description}</span></span>
           {fs.storagePath && (
             <button 
               type="button" 
               className="text-violet-700 underline hover:text-violet-900" 
               onClick={() => {
                 console.log('View button clicked for:', fs.storagePath);
                 handleViewAttachment123(fs);
               }}
             >
               View Document Attachment
             </button>
           )}
         </div>
       ))}
     </div>
   </div>
 );
}

export const DealCreationLayer = (): JSX.Element => {
 const [searchValue, setSearchValue] = React.useState("");
 const [currentStep, setCurrentStep] = useState(1);
 const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
 const [createdDeal, setCreatedDeal] = useState<Deal | null>(null);
 const [addedCombinations, setAddedCombinations] = useState<{
   productId: string;
   subProductId: string;
   productLabel: string;
   subProductLabel: string;
   businessDomainId?: string;
 }[]>([]);
 const [financialStatuses, setFinancialStatuses] = useState<DealFinancialStatus[]>([]);
 const [commitments, setCommitments] = useState<DealCommitment[]>([]);

 // Move getViewUrl function inside the component
 const getViewUrl = async (blobName: string) => {
   try {
     console.log('Getting SAS token for blob:', blobName);
     const res = await fetch(`${API_BASE_URL}/azure-sas/read-sas?blobName=${encodeURIComponent(blobName)}`);
     console.log('SAS response status:', res.status);
     if (!res.ok) {
       throw new Error(`Failed to get SAS token: ${res.status} ${res.statusText}`);
     }
     const sasToken = await res.text();
     console.log('SAS Token received:', sasToken ? 'Yes' : 'No', sasToken.substring(0, 20) + '...');
     
     if (!sasToken) {
       throw new Error('Empty SAS token received');
     }
     
     const finalUrl = `${AZURE_CONTAINER_URL}/${blobName}?${sasToken}`;
     console.log('Final URL constructed:', finalUrl);
     return finalUrl;
   } catch (error) {
     console.error('Error getting SAS token:', error);
     throw error;
   }
 };

 const handleNext = async () => {
   if (currentStep === 3 && createdDeal && addedCombinations.length > 0) {
     try {
       await Promise.all(
         addedCombinations.map(async (combo) => {
           const businessDomainId = combo.businessDomainId;
           const body = {
             dealId: createdDeal.dealId,
             businessDomainId,
             productId: combo.productId,
             subProductId: combo.subProductId,
           };
           await fetch(`${API_BASE_URL}/deal-pricing/populate`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(body),
           });
         })
       );
       setCurrentStep((prevStep) => Math.min(prevStep + 1, stepsData.length));
     } catch (error) {
       alert("Failed to populate pricing details. Please try again.");
       return;
     }
   } else if (currentStep === 1 && selectedCustomer) {
     try {
       const deal = await dealService.createDraftDeal(
         selectedCustomer.customer.customerID,
         selectedCustomer.customer.customerName,
         'initiator' // Replace with actual initiator (e.g., logged-in user)
       );
       setCreatedDeal(deal);
       await loadCommitments(deal.dealId);
       setCurrentStep((prevStep) => Math.min(prevStep + 1, stepsData.length));
     } catch (error) {
       // Optionally handle error (show notification, etc.)
       console.error('Failed to create deal:', error);
     }
   } else if (currentStep === 2 && createdDeal) {
     // Reload commitments when moving from Product Selection to Collateral & Documentation
     await loadCommitments(createdDeal.dealId);
     setCurrentStep((prevStep) => Math.min(prevStep + 1, stepsData.length));
   } else {
     setCurrentStep((prevStep) => Math.min(prevStep + 1, stepsData.length));
   }
 };

 const handleBack = () => {
   setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
 };

 const handleCustomerSelect = (customer: CustomerDetails | null) => {
   setSelectedCustomer(customer);
 };

 const loadCommitments = async (dealId: string) => {
   try {
     const commitmentsData = await getDealCommitmentsByDealId(dealId);
     setCommitments(commitmentsData);
   } catch (error) {
     console.error('Failed to load commitments:', error);
     setCommitments([]);
   }
 };

 // Reload commitments when deal is created or changes
 React.useEffect(() => {
   if (createdDeal?.dealId) {
     loadCommitments(createdDeal.dealId);
   }
 }, [createdDeal?.dealId]);

 return (
   <div className="flex-1">
     {/* Progress Stepper */}
     <div className="flex justify-center mt-8 px-4">
       {stepsData.map((step, index) => (
         <React.Fragment key={step.number}>
           <div className="flex flex-col items-center">
             <div
               className={`w-8 h-8 rounded-2xl flex items-center justify-center ${
                 currentStep >= step.number ? "bg-[#636ae8]" : "bg-[#f7f7f7]"
               }`}
             >
               <span
                 className={`font-medium text-sm ${
                   currentStep >= step.number ? "text-white" : "text-[#8c8d8b]"
                 }`}
               >
                 {step.number}
               </span>
             </div>
             <span
               className={`mt-2 text-sm text-center ${
                 currentStep >= step.number
                   ? "font-medium text-[#242524]"
                   : "font-normal text-[#8c8d8b]"
               }`}
             >
               {step.title}
             </span>
           </div>

           {index < stepsData.length - 1 && (
             <div className="flex items-center mx-4">
               <div className="w-[123px] h-px bg-gray-200"></div>
             </div>
           )}
         </React.Fragment>
       ))}
     </div>

     {/* Main Content - Conditionally render sections based on currentStep */}
     <main className="mt-12 px-8">
       <h1 className="font-bold text-3xl text-[#242524] font-['Archivo',Helvetica] leading-9">
         New Deal Creation
       </h1>

       {currentStep === 1 && (
         <div className="flex gap-6 mt-6">
           {/* Left Column - Search and Results */}
           <div className="flex flex-col gap-4">
             {/* Search Card */}
             <div className="w-[337px] border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] rounded-lg p-4">
               <div className="font-medium text-sm text-[#242524] mb-2">
                 Search:
               </div>
               <div className="relative w-full h-[75px] bg-white rounded-md border border-[#ebebea] flex items-center">
                 <SearchIcon className="absolute left-3 text-gray-400 h-4 w-4" />
                 <TextInput
                   id="customer-search"
                   label="Search"
                   value={searchValue}
                   onChange={setSearchValue}
                   placeholder="Search by Customer Name, ID, or Group ID"
                 />
               </div>
             </div>
             {/* Customer Selection Results */}
             <CustomerSelectionSection onCustomerSelect={handleCustomerSelect} searchValue={searchValue} />
           </div>
           {/* Right Column - Customer Details */}
           <div className="flex-1">
             <CustomerDetailsSection selectedCustomer={selectedCustomer} />
             {/* Navigation Buttons */}
             <div className="flex justify-end gap-4 mt-8">
               <SecondaryButton onClick={handleBack} disabled={currentStep === 1}>
                 Back
               </SecondaryButton>
               <PrimaryButton onClick={handleNext} disabled={!selectedCustomer || currentStep === stepsData.length}>
                 Next
               </PrimaryButton>
             </div>
           </div>
         </div>
       )}

       {currentStep === 2 && createdDeal && createdDeal.dealId && selectedCustomer && selectedCustomer.customer && selectedCustomer.customer.customerID && (
         <>
           <DealDetailsContainer deal={createdDeal} />
           <CustomerInfoBanner customer={selectedCustomer} />
           <ProductSelectionDropdowns 
             dealId={createdDeal.dealId} 
             customerId={selectedCustomer.customer.customerID}
             onNext={handleNext}
             onBack={handleBack}
             addedCombinations={addedCombinations}
             setAddedCombinations={setAddedCombinations}
             financialStatuses={financialStatuses}
             setFinancialStatuses={setFinancialStatuses}
             commitments={commitments}
             setCommitments={setCommitments}
           />
         </>
       )}
       {currentStep === 3 && (
         <>
           <DealDetailsContainer deal={createdDeal} />
           {selectedCustomer && <CustomerInfoBanner customer={selectedCustomer} />}
           <FinancialStatusesDisplay financialStatuses={financialStatuses} getViewUrl={getViewUrl} />
           {addedCombinations.length > 0 && (
             <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
               <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
               <div className="space-y-4">
                 {addedCombinations.map((combo, idx) => {
                   const comboKey = `${combo.productId}-${combo.subProductId}`;
                   const comboCommitments = commitments.filter(c => 
                     c.productID === combo.productId && c.subProductID === combo.subProductId
                   );
                   
                   return (
                     <div key={comboKey} className="bg-white p-3 rounded border">
                       <div className="flex gap-6 items-center mb-2">
                         <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                         <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                       </div>
                       {comboCommitments.length > 0 && (
                         <div className="mt-3 pl-4 border-l-2 border-violet-200">
                           <div className="font-medium text-violet-700 mb-1">Deal Commitments:</div>
                           <div className="space-y-1">
                             {comboCommitments.map((commitment, index) => (
                               <div key={commitment.commitmentNumber} className="flex gap-4 items-center text-sm text-slate-800 bg-gray-50 p-2 rounded">
                                 <span>Commitment #{commitment.commitmentNumber}:</span>
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
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
           {createdDeal && createdDeal.dealId && (
             <DealCollateralForm dealId={createdDeal.dealId} />
           )}
           {/* Navigation Buttons for Collateral & Documentation */}
           <div className="flex justify-end gap-4 mt-8">
             <SecondaryButton onClick={handleBack}>
               Back
             </SecondaryButton>
             <PrimaryButton onClick={handleNext}>
               Next
             </PrimaryButton>
           </div>
         </>
       )}
       {currentStep === 4 && (
         <>
           <DealDetailsContainer deal={createdDeal} />
           {selectedCustomer && <CustomerInfoBanner customer={selectedCustomer} />}
           <FinancialStatusesDisplay financialStatuses={financialStatuses} getViewUrl={getViewUrl} />
           {addedCombinations.length > 0 && (
             <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
               <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
               <div className="space-y-4">
                 {addedCombinations.map((combo, idx) => {
                   const comboKey = `${combo.productId}-${combo.subProductId}`;
                   const comboCommitments = commitments.filter(c => 
                     c.productID === combo.productId && c.subProductID === combo.subProductId
                   );
                   
                   return (
                     <div key={comboKey} className="bg-white p-3 rounded border">
                       <div className="flex gap-6 items-center mb-2">
                         <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                         <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                       </div>
                       {comboCommitments.length > 0 && (
                         <div className="mt-3 pl-4 border-l-2 border-violet-200">
                           <div className="font-medium text-violet-700 mb-1">Deal Commitments:</div>
                           <div className="space-y-1">
                             {comboCommitments.map((commitment, index) => (
                               <div key={commitment.commitmentNumber} className="flex gap-4 items-center text-sm text-slate-800 bg-gray-50 p-2 rounded">
                                 <span>Commitment #{commitment.commitmentNumber}:</span>
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
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
           {createdDeal && createdDeal.dealId && (
             <DealCollateralForm dealId={createdDeal.dealId} showForms={false} />
           )}
           <DealPricingTable dealId={createdDeal?.dealId || ''} />
           <div className="flex justify-end gap-4 mt-8">
             <SecondaryButton onClick={handleBack}>
               Back
             </SecondaryButton>
             <PrimaryButton onClick={handleNext}>
               Next
             </PrimaryButton>
           </div>
         </>
       )}
       {currentStep === 5 && (
         <>
           <DealDetailsContainer deal={createdDeal} />
           {selectedCustomer && <CustomerInfoBanner customer={selectedCustomer} />}
           <FinancialStatusesDisplay financialStatuses={financialStatuses} getViewUrl={getViewUrl} />
           {addedCombinations.length > 0 && (
             <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
               <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
               <div className="space-y-4">
                 {addedCombinations.map((combo, idx) => {
                   const comboKey = `${combo.productId}-${combo.subProductId}`;
                   const comboCommitments = commitments.filter(c => 
                     c.productID === combo.productId && c.subProductID === combo.subProductId
                   );
                   
                   return (
                     <div key={comboKey} className="bg-white p-3 rounded border">
                       <div className="flex gap-6 items-center mb-2">
                         <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                         <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                       </div>
                       {comboCommitments.length > 0 && (
                         <div className="mt-3 pl-4 border-l-2 border-violet-200">
                           <div className="font-medium text-violet-700 mb-1">Deal Commitments:</div>
                           <div className="space-y-1">
                             {comboCommitments.map((commitment, index) => (
                               <div key={commitment.commitmentNumber} className="flex gap-4 items-center text-sm text-slate-800 bg-gray-50 p-2 rounded">
                                 <span>Commitment #{commitment.commitmentNumber}:</span>
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
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
           {createdDeal && createdDeal.dealId && (
             <DealCollateralForm dealId={createdDeal.dealId} showForms={false} />
           )}
           {/* Show Pricing & Fees Details table here as well */}
           {createdDeal && createdDeal.dealId && (
             <DealPricingTable dealId={createdDeal.dealId} />
           )}
           {createdDeal && createdDeal.dealId && (
             <SpecialConditionsSection dealId={createdDeal.dealId} />
           )}
           <div className="flex justify-end gap-4 mt-8">
             <SecondaryButton onClick={handleBack}>
               Back
             </SecondaryButton>
             <PrimaryButton onClick={handleNext}>
               Next
             </PrimaryButton>
           </div>
         </>
       )}
     </main>
   </div>
 );
};