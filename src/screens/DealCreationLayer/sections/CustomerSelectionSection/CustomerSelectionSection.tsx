import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

export const CustomerSelectionSection = (): JSX.Element => {
  // Customer data for mapping
  const customers = [
    {
      id: "CUST001",
      name: "Global Tech Solutions Inc.",
      segment: "Enterprise",
      type: "Customer",
    },
    {
      id: "CUST002",
      name: "Innovative Ventures Ltd.",
      segment: "SME",
      type: "Customer",
    },
    {
      id: "GROUP001",
      name: "Nexus Holdings Group",
      segment: "Holding",
      type: "Group",
      selected: true,
    },
    {
      id: "CUST003",
      name: "Phoenix Consulting",
      segment: "Startup",
      type: "Customer",
    },
    {
      id: "GROUP002",
      name: "Evergreen Financial Group",
      segment: "Holding",
      type: "Group",
    },
    {
      id: "CUST004",
      name: "Digital Marketing Hub",
      segment: "SME",
      type: "Customer",
    },
    {
      id: "CUST005",
      name: "Horizon Energy Solutions",
      segment: "Enterprise",
      type: "Customer",
    },
    {
      id: "GROUP003",
      name: "Starlight Investments",
      segment: "Holding",
      type: "Group",
    },
    {
      id: "CUST006",
      name: "Green Thumb Farming Co.",
      segment: "Agriculture",
      type: "Customer",
    },
    {
      id: "CUST007",
      name: "Oceanic Logistics Corp.",
      segment: "Enterprise",
      type: "Customer",
    },
  ];

  return (
    <Card className="w-full max-w-[337px] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea]">
      <CardHeader className="px-4 py-[19px]">
        <CardTitle className="font-semibold text-base text-[#242524] font-['Archivo',Helvetica]">
          Search Results (10)
        </CardTitle>
      </CardHeader>

      <div className="overflow-hidden">
        {customers.map((customer, index) => (
          <div key={customer.id}>
            <CardContent
              className={`px-3 py-[13px] ${customer.selected ? "bg-[#636ae81a]" : ""}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm text-[#242524] font-['Inter',Helvetica] leading-5">
                    {customer.name}
                  </div>
                  <div className="font-normal text-xs text-[#8c8d8b] font-['Inter',Helvetica] leading-4 mt-1">
                    {customer.type} ID: {customer.id}
                  </div>
                  <div className="font-normal text-xs text-[#8c8d8b] font-['Inter',Helvetica] leading-4 mt-1">
                    Segment: {customer.segment}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className={`h-9 ${customer.selected ? "w-[85px]" : "w-[68px]"} rounded-md text-sm font-normal text-[#242524] font-['Inter',Helvetica]`}
                >
                  {customer.selected ? "Selected" : "Select"}
                </Button>
              </div>
            </CardContent>
            {index < customers.length - 1 && <Separator className="mx-0" />}
          </div>
        ))}
      </div>
    </Card>
  );
};
