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
  }[]>([]);

  const handleNext = async () => {
    if (currentStep === 1 && selectedCustomer) {
      try {
        const deal = await dealService.createDraftDeal(
          selectedCustomer.customer.customerID,
          selectedCustomer.customer.customerName,
          'initiator' // Replace with actual initiator (e.g., logged-in user)
        );
        setCreatedDeal(deal);
        setCurrentStep((prevStep) => Math.min(prevStep + 1, stepsData.length));
      } catch (error) {
        // Optionally handle error (show notification, etc.)
        console.error('Failed to create deal:', error);
      }
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

        {currentStep === 2 && createdDeal && createdDeal.dealId && (
          <>
            <DealDetailsContainer deal={createdDeal} />
            {selectedCustomer && <CustomerInfoBanner customer={selectedCustomer} />}
            <ProductSelectionDropdowns 
              dealId={createdDeal.dealId} 
              onNext={handleNext}
              onBack={handleBack}
              addedCombinations={addedCombinations}
              setAddedCombinations={setAddedCombinations}
            />
          </>
        )}
        {currentStep === 3 && (
          <>
            <DealDetailsContainer deal={createdDeal} />
            {selectedCustomer && <CustomerInfoBanner customer={selectedCustomer} />}
            {addedCombinations.length > 0 && (
              <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
                <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
                <ul className="space-y-2">
                  {addedCombinations.map((combo, idx) => (
                    <li key={combo.productId + '-' + combo.subProductId} className="flex gap-6 items-center">
                      <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                      <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                    </li>
                  ))}
                </ul>
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
            {addedCombinations.length > 0 && (
              <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
                <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
                <ul className="space-y-2">
                  {addedCombinations.map((combo, idx) => (
                    <li key={combo.productId + '-' + combo.subProductId} className="flex gap-6 items-center">
                      <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                      <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {createdDeal && createdDeal.dealId && (
              <DealCollateralForm dealId={createdDeal.dealId} showForms={false} />
            )}
            <div>Pricing and Fees Section Goes Here (Placeholder)</div>
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
            {addedCombinations.length > 0 && (
              <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
                <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
                <ul className="space-y-2">
                  {addedCombinations.map((combo, idx) => (
                    <li key={combo.productId + '-' + combo.subProductId} className="flex gap-6 items-center">
                      <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                      <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {createdDeal && createdDeal.dealId && (
              <DealCollateralForm dealId={createdDeal.dealId} showForms={false} />
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
