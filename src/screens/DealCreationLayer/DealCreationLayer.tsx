import { BellIcon, SearchIcon } from "lucide-react";
import React from "react";
import TextInput from "../../template components/components/form/TextInput";
import PrimaryButton from "../../template components/components/elements/PrimaryButton";
import SecondaryButton from "../../template components/components/elements/SecondaryButton";
import { CustomerDetailsSection } from "./sections/CustomerDetailsSection/CustomerDetailsSection";
import { CustomerSelectionSection } from "./sections/CustomerSelectionSection";
import { DealCreationSection } from "./sections/DealCreationSection/DealCreationSection";

// Step data for the progress stepper
const stepsData = [
  { number: 1, title: "Customer Selection" },
  { number: 2, title: "Product Selection" },
  { number: 3, title: "Collateral & Documentation" },
  { number: 4, title: "Pricing and Fees" },
  { number: 5, title: "Special Conditions" },
];

export const DealCreationLayer = (): JSX.Element => {
  const [searchValue, setSearchValue] = React.useState("");
  const [currentStep, setCurrentStep] = React.useState(1);

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, stepsData.length));
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
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
              <CustomerSelectionSection />
            </div>
            {/* Right Column - Customer Details */}
            <div className="flex-1">
              <DealCreationSection />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>Product Selection Section Goes Here (Placeholder)</div>
        )}
        {currentStep === 3 && (
          <div>Collateral & Documentation Section Goes Here (Placeholder)</div>
        )}
        {currentStep === 4 && (
          <div>Pricing and Fees Section Goes Here (Placeholder)</div>
        )}
        {currentStep === 5 && (
          <div>Special Conditions Section Goes Here (Placeholder)</div>
        )}

        {/* Additional Sections - CustomerDetailsSection is assumed to be always visible for now */}
        <div className="mt-8">
          <CustomerDetailsSection />
        </div>
      </main>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-8 px-8 pb-8">
        <SecondaryButton onClick={handleBack} disabled={currentStep === 1}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={handleNext} disabled={currentStep === stepsData.length}>
          Next
        </PrimaryButton>
      </div>
    </div>
  );
};
