import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { customerService, Customer } from "../../../../services/customerService";

export const CustomerSelectionSection = (): JSX.Element => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getAllCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-[337px] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea]">
        <CardContent className="px-4 py-4">
          <div className="text-center text-gray-500">Loading customers...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-[337px] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea]">
        <CardContent className="px-4 py-4">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[337px] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] border-[#ebebea]">
      <CardHeader className="px-4 py-[19px]">
        <CardTitle className="font-semibold text-base text-[#242524] font-['Archivo',Helvetica]">
          Search Results ({customers.length})
        </CardTitle>
      </CardHeader>

      <div className="overflow-hidden">
        {customers.map((customer, index) => (
          <div key={customer.id}>
            <CardContent
              className={`px-3 py-[13px] ${selectedCustomerId === customer.id ? "bg-[#636ae81a]" : ""}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm text-[#242524] font-['Inter',Helvetica] leading-5">
                    {customer.customerName}
                  </div>
                  <div className="font-normal text-xs text-[#8c8d8b] font-['Inter',Helvetica] leading-4 mt-1">
                    Customer ID: {customer.customerCode}
                  </div>
                  <div className="font-normal text-xs text-[#8c8d8b] font-['Inter',Helvetica] leading-4 mt-1">
                    Industry: {customer.industry}
                  </div>
                  <div className="font-normal text-xs text-[#8c8d8b] font-['Inter',Helvetica] leading-4 mt-1">
                    Region: {customer.region}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className={`h-9 ${selectedCustomerId === customer.id ? "w-[85px]" : "w-[68px]"} rounded-md text-sm font-normal text-[#242524] font-['Inter',Helvetica]`}
                  onClick={() => handleSelectCustomer(customer.id)}
                >
                  {selectedCustomerId === customer.id ? "Selected" : "Select"}
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
