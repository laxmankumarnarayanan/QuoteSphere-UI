import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Customer } from "../../../../services/customerService";

interface CustomerDetailsSectionProps {
  selectedCustomer: Customer | null;
}

export const CustomerDetailsSection = ({ selectedCustomer }: CustomerDetailsSectionProps): JSX.Element => {
  if (!selectedCustomer) {
    return (
      <Card className="w-full shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea]">
        <CardContent className="px-4 py-4">
          <div className="text-center text-gray-500">Select a customer to view details</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea]">
      <CardHeader className="px-4 py-[19px]">
        <CardTitle className="font-semibold text-base text-[#242524] font-['Archivo',Helvetica]">
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-[#242524] font-['Inter',Helvetica]">Customer Name</h3>
            <p className="text-sm text-[#8c8d8b] font-['Inter',Helvetica] mt-1">{selectedCustomer.customerName}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-[#242524] font-['Inter',Helvetica]">Customer Code</h3>
            <p className="text-sm text-[#8c8d8b] font-['Inter',Helvetica] mt-1">{selectedCustomer.customerCode}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-[#242524] font-['Inter',Helvetica]">Industry</h3>
            <p className="text-sm text-[#8c8d8b] font-['Inter',Helvetica] mt-1">{selectedCustomer.industry}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-[#242524] font-['Inter',Helvetica]">Region</h3>
            <p className="text-sm text-[#8c8d8b] font-['Inter',Helvetica] mt-1">{selectedCustomer.region}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-[#242524] font-['Inter',Helvetica]">Status</h3>
            <p className="text-sm text-[#8c8d8b] font-['Inter',Helvetica] mt-1">{selectedCustomer.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
