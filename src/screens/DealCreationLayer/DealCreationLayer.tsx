import { BellIcon, SearchIcon } from "lucide-react";
import React from "react";
import TextInput from "../../template components/components/form/TextInput";
import { CustomerDetailsSection } from "./sections/CustomerDetailsSection/CustomerDetailsSection";
import { CustomerSelectionSection } from "./sections/CustomerSelectionSection";
import { DealCreationSection } from "./sections/DealCreationSection/DealCreationSection";

// Step data for the progress stepper
const steps = [
  { number: 1, title: "Customer Selection", active: true },
  { number: 2, title: "Product Selection", active: false },
  { number: 3, title: "Collateral & Documentation", active: false },
  { number: 4, title: "Pricing and Fees", active: false },
  { number: 5, title: "Special Conditions", active: false },
];

export const DealCreationLayer = (): JSX.Element => {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <div className="flex-1">
      {/* Progress Stepper */}
      <div className="flex justify-center mt-8 px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center ${
                  step.active ? "bg-[#636ae8]" : "bg-[#f7f7f7]"
                }`}
              >
                <span
                  className={`font-medium text-sm ${
                    step.active ? "text-white" : "text-[#8c8d8b]"
                  }`}
                >
                  {step.number}
                </span>
              </div>
              <span
                className={`mt-2 text-sm text-center ${
                  step.active
                    ? "font-medium text-[#242524]"
                    : "font-normal text-[#8c8d8b]"
                }`}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex items-center mx-4">
                <div className="w-[123px] h-px bg-gray-200"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content */}
      <main className="mt-12 px-8">
        <h1 className="font-bold text-3xl text-[#242524] font-['Archivo',Helvetica] leading-9">
          New Deal Creation
        </h1>

        {/* Search and Results Layout */}
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

        {/* Additional Sections */}
        <div className="mt-8">
          <CustomerDetailsSection />
        </div>
      </main>
    </div>
  );
};
