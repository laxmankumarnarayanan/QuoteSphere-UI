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
    <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
      <div className="font-semibold text-violet-800 mb-2 text-base font-['Archivo',Helvetica]">Deal Details</div>
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium text-gray-500 w-32">Deal ID</span>
          <span className="text-sm text-gray-900 font-medium">{deal.dealId}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium text-gray-500 w-32">Deal Status</span>
          <span className="text-sm text-gray-900 font-medium">{deal.dealStatus}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium text-gray-500 w-32">Created DateTime</span>
          <span className="text-sm text-gray-900 font-medium">{deal.createdDateTime ? new Date(deal.createdDateTime).toLocaleString() : "-"}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium text-gray-500 w-32">Created By</span>
          <span className="text-sm text-gray-900 font-medium">{deal.createdBy || deal.initiator || "-"}</span>
        </div>
      </div>
    </div>
  );
}

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';
const AZURE_CONTAINER_URL = "https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer";

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
 const [commitments, setCommitments] = useState<DealCommitment[]>([]);

 // Collapsible state for Deal Details and Customer Details
 const [dealDetailsCollapsed, setDealDetailsCollapsed] = useState(true);
 const [customerDetailsCollapsed, setCustomerDetailsCollapsed] = useState(true);

 // Collapsible state for Collateral & Documentation step
 const [dealDetailsCollapsedDoc, setDealDetailsCollapsedDoc] = useState(true);
 const [customerDetailsCollapsedDoc, setCustomerDetailsCollapsedDoc] = useState(true);
 const [comboCollapsedDoc, setComboCollapsedDoc] = useState<{ [key: string]: boolean }>({});

 // Collapsible state for Pricing and Fees step
 const [dealDetailsCollapsedPricing, setDealDetailsCollapsedPricing] = useState(true);
 const [customerDetailsCollapsedPricing, setCustomerDetailsCollapsedPricing] = useState(true);
 const [comboCollapsedPricing, setComboCollapsedPricing] = useState<{ [key: string]: boolean }>({});
 const [collateralsCollapsedPricing, setCollateralsCollapsedPricing] = useState(true);
 const [documentsCollapsedPricing, setDocumentsCollapsedPricing] = useState(true);

 // Collapsible state for Special Conditions step
 const [dealDetailsCollapsedSpecial, setDealDetailsCollapsedSpecial] = useState(true);
 const [customerDetailsCollapsedSpecial, setCustomerDetailsCollapsedSpecial] = useState(true);
 const [comboCollapsedSpecial, setComboCollapsedSpecial] = useState<{ [key: string]: boolean }>({});
 const [collateralsCollapsedSpecial, setCollateralsCollapsedSpecial] = useState(true);
 const [documentsCollapsedSpecial, setDocumentsCollapsedSpecial] = useState(true);
 const [pricingCollapsedSpecial, setPricingCollapsedSpecial] = useState(true);

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
     <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 flex justify-center px-4">
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
           {/* Collapsible Deal Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setDealDetailsCollapsed((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Deal Details
               </div>
               <div className="flex items-center gap-2">
                 {dealDetailsCollapsed ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${dealDetailsCollapsed ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!dealDetailsCollapsed && (
               <DealDetailsContainer deal={createdDeal} />
             )}
           </div>
           {/* Collapsible Customer Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setCustomerDetailsCollapsed((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Selected Customer Details
               </div>
               <div className="flex items-center gap-2">
                 {customerDetailsCollapsed && selectedCustomer?.customer?.customerName ? (
                   <span className="text-sm text-gray-700">Customer Name: <span className="font-semibold">{selectedCustomer.customer.customerName}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${customerDetailsCollapsed ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!customerDetailsCollapsed && (
               <CustomerInfoBanner customer={selectedCustomer} />
             )}
           </div>
           <ProductSelectionDropdowns 
             dealId={createdDeal.dealId} 
             customerId={selectedCustomer.customer.customerID}
             onNext={handleNext}
             onBack={handleBack}
             addedCombinations={addedCombinations}
             setAddedCombinations={setAddedCombinations}
             commitments={commitments}
             setCommitments={setCommitments}
           />
         </>
       )}
       {currentStep === 3 && (
         <>
           {/* Collapsible Deal Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setDealDetailsCollapsedDoc((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Deal Details
               </div>
               <div className="flex items-center gap-2">
                 {dealDetailsCollapsedDoc && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${dealDetailsCollapsedDoc ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!dealDetailsCollapsedDoc && (
               <DealDetailsContainer deal={createdDeal} />
             )}
           </div>
           {/* Collapsible Customer Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setCustomerDetailsCollapsedDoc((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Selected Customer Details
               </div>
               <div className="flex items-center gap-2">
                 {customerDetailsCollapsedDoc && selectedCustomer?.customer?.customerName ? (
                   <span className="text-sm text-gray-700">Customer Name: <span className="font-semibold">{selectedCustomer.customer.customerName}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${customerDetailsCollapsedDoc ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!customerDetailsCollapsedDoc && selectedCustomer && (
               <CustomerInfoBanner customer={selectedCustomer} />
             )}
           </div>
           {/* Collapsible Added Product-SubProduct Combinations */}
           {addedCombinations.length > 0 && (
             <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
               <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
               <div className="space-y-4">
                 {addedCombinations.map((combo, idx) => {
                   const comboKey = `${combo.productId}-${combo.subProductId}`;
                   const comboCommitments = commitments.filter(c => 
                     c.productID === combo.productId && c.subProductID === combo.subProductId
                   );
                   const isCollapsed = comboCollapsedDoc[comboKey] ?? true;
                   return (
                     <div key={comboKey} className="bg-white p-3 rounded border">
                       <div
                         className="flex items-center justify-between cursor-pointer select-none border-b pb-2 mb-2"
                         onClick={() => setComboCollapsedDoc(prev => ({ ...prev, [comboKey]: !isCollapsed }))}
                       >
                         <div className="flex gap-6 items-center">
                           <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                           <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                         </div>
                         <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-90' : ''}`}>▶</span>
                       </div>
                       {!isCollapsed && comboCommitments.length > 0 && (
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
           {/* Collapsible Deal Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setDealDetailsCollapsedPricing((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Deal Details
               </div>
               <div className="flex items-center gap-2">
                 {dealDetailsCollapsedPricing && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${dealDetailsCollapsedPricing ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!dealDetailsCollapsedPricing && (
               <DealDetailsContainer deal={createdDeal} />
             )}
           </div>
           {/* Collapsible Customer Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setCustomerDetailsCollapsedPricing((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Selected Customer Details
               </div>
               <div className="flex items-center gap-2">
                 {customerDetailsCollapsedPricing && selectedCustomer?.customer?.customerName ? (
                   <span className="text-sm text-gray-700">Customer Name: <span className="font-semibold">{selectedCustomer.customer.customerName}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${customerDetailsCollapsedPricing ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!customerDetailsCollapsedPricing && selectedCustomer && (
               <CustomerInfoBanner customer={selectedCustomer} />
             )}
           </div>
           {/* Collapsible Added Product-SubProduct Combinations */}
           {addedCombinations.length > 0 && (
             <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
               <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
               <div className="space-y-4">
                 {addedCombinations.map((combo, idx) => {
                   const comboKey = `${combo.productId}-${combo.subProductId}`;
                   const comboCommitments = commitments.filter(c => 
                     c.productID === combo.productId && c.subProductID === combo.subProductId
                   );
                   const isCollapsed = comboCollapsedPricing[comboKey] ?? true;
                   return (
                     <div key={comboKey} className="bg-white p-3 rounded border">
                       <div
                         className="flex items-center justify-between cursor-pointer select-none border-b pb-2 mb-2"
                         onClick={() => setComboCollapsedPricing(prev => ({ ...prev, [comboKey]: !isCollapsed }))}
                       >
                         <div className="flex gap-6 items-center">
                           <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                           <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                         </div>
                         <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-90' : ''}`}>▶</span>
                       </div>
                       {!isCollapsed && comboCommitments.length > 0 && (
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
           {/* Collapsible Collaterals */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setCollateralsCollapsedPricing((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Collaterals
               </div>
               <div className="flex items-center gap-2">
                 {collateralsCollapsedPricing && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${collateralsCollapsedPricing ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!collateralsCollapsedPricing && (
               <DealCollateralForm dealId={createdDeal?.dealId || ''} showForms={false} showCollaterals={true} showDocuments={false} />
             )}
           </div>
           {/* Collapsible Documents */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setDocumentsCollapsedPricing((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Documents
               </div>
               <div className="flex items-center gap-2">
                 {documentsCollapsedPricing && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${documentsCollapsedPricing ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!documentsCollapsedPricing && (
               <DealCollateralForm dealId={createdDeal?.dealId || ''} showForms={false} showCollaterals={false} showDocuments={true} />
             )}
           </div>
           {/* Pricing & Fees Table */}
           <DealPricingTable dealId={createdDeal?.dealId || ''} />
           {/* Navigation Buttons for Pricing and Fees */}
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
           {/* Collapsible Deal Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setDealDetailsCollapsedSpecial((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Deal Details
               </div>
               <div className="flex items-center gap-2">
                 {dealDetailsCollapsedSpecial && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${dealDetailsCollapsedSpecial ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!dealDetailsCollapsedSpecial && (
               <DealDetailsContainer deal={createdDeal} />
             )}
           </div>
           {/* Collapsible Customer Details */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setCustomerDetailsCollapsedSpecial((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Selected Customer Details
               </div>
               <div className="flex items-center gap-2">
                 {customerDetailsCollapsedSpecial && selectedCustomer?.customer?.customerName ? (
                   <span className="text-sm text-gray-700">Customer Name: <span className="font-semibold">{selectedCustomer.customer.customerName}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${customerDetailsCollapsedSpecial ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!customerDetailsCollapsedSpecial && selectedCustomer && (
               <CustomerInfoBanner customer={selectedCustomer} />
             )}
           </div>
           {/* Collapsible Added Product-SubProduct Combinations */}
           {addedCombinations.length > 0 && (
             <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
               <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
               <div className="space-y-4">
                 {addedCombinations.map((combo, idx) => {
                   const comboKey = `${combo.productId}-${combo.subProductId}`;
                   const comboCommitments = commitments.filter(c => 
                     c.productID === combo.productId && c.subProductID === combo.subProductId
                   );
                   const isCollapsed = comboCollapsedSpecial[comboKey] ?? true;
                   return (
                     <div key={comboKey} className="bg-white p-3 rounded border">
                       <div
                         className="flex items-center justify-between cursor-pointer select-none border-b pb-2 mb-2"
                         onClick={() => setComboCollapsedSpecial(prev => ({ ...prev, [comboKey]: !isCollapsed }))}
                       >
                         <div className="flex gap-6 items-center">
                           <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                           <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                         </div>
                         <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-90' : ''}`}>▶</span>
                       </div>
                       {!isCollapsed && comboCommitments.length > 0 && (
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
           {/* Collapsible Collaterals */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setCollateralsCollapsedSpecial((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Collaterals
               </div>
               <div className="flex items-center gap-2">
                 {collateralsCollapsedSpecial && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${collateralsCollapsedSpecial ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!collateralsCollapsedSpecial && (
               <DealCollateralForm dealId={createdDeal?.dealId || ''} showForms={false} showCollaterals={true} showDocuments={false} />
             )}
           </div>
           {/* Collapsible Documents */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setDocumentsCollapsedSpecial((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Documents
               </div>
               <div className="flex items-center gap-2">
                 {documentsCollapsedSpecial && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${documentsCollapsedSpecial ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!documentsCollapsedSpecial && (
               <DealCollateralForm dealId={createdDeal?.dealId || ''} showForms={false} showCollaterals={false} showDocuments={true} />
             )}
           </div>
           {/* Collapsible Pricing & Fees */}
           <div className="mb-4">
             <div
               className="flex items-center justify-between cursor-pointer border border-violet-200 rounded-lg bg-violet-50 px-4 py-3 select-none"
               onClick={() => setPricingCollapsedSpecial((prev) => !prev)}
             >
               <div className="font-semibold text-violet-800 text-base font-['Archivo',Helvetica]">
                 Pricing & Fees
               </div>
               <div className="flex items-center gap-2">
                 {pricingCollapsedSpecial && createdDeal?.dealId ? (
                   <span className="text-sm text-gray-700">Deal ID: <span className="font-semibold">{createdDeal.dealId}</span></span>
                 ) : null}
                 <span className={`transition-transform duration-200 ${pricingCollapsedSpecial ? 'rotate-90' : ''}`}>▶</span>
               </div>
             </div>
             {!pricingCollapsedSpecial && (
               <DealPricingTable dealId={createdDeal?.dealId || ''} />
             )}
           </div>
           {/* Special Conditions Section */}
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