import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

// Customer data
const customerData = {
  name: "Nexus Holdings",
  customerId: "CUST001",
  segment: "Holding",
  status: "Active",
  onboardedDate: "2020-01-10",
  taxCode: "TX-GRP1234567",
  riskRating: "Medium",
  industryCode: "Holding",
  address: "200 Financial Center, Business District, London, UK",
  parentCustomerId: "CUST231",
  cif: "GRP123",
  groupId: "GRP333",
};

// Child customers data
const childCustomers = [
  {
    name: "DEN Networks Ltd",
    customerId: "CIF000012345",
    onboardedDate: "2022-01-15",
    segment: "Group A",
    riskRating: 4,
    taxCode: "TX01",
  },
  {
    name: "NVIDIA",
    customerId: "CIF000068689",
    onboardedDate: "2023-03-22",
    segment: "Group B",
    riskRating: 3,
    taxCode: "TX02",
  },
  {
    name: "Infosys",
    customerId: "CIF000003698",
    onboardedDate: "2021-07-30",
    segment: "Group A",
    riskRating: 4,
    taxCode: "TX01",
  },
  {
    name: "ITC",
    customerId: "CIF000078459",
    onboardedDate: "2022-05-10",
    segment: "Group C",
    riskRating: 1,
    taxCode: "TX03",
  },
];

// Contacts data
const contacts = [
  {
    name: "Catherine Miller (CFO)",
    address: "200 Financial Center",
    phone: "+44 (0) 20 1234 5678",
    email: "c.miller@nexusholdings.com",
  },
];

// Guarantors data
const guarantors = [
  {
    name: "David Brown",
    address: "50 External St, London",
    phone: "+44 (0) 20 9876 5432",
    email: "david.b@external.com",
  },
];

// Related accounts data
const relatedAccounts = [
  {
    name: "Group Consolidated Account",
    accountNumber: "ACC-NEX-GRP-MAIN",
  },
];

export const DealCreationSection = (): JSX.Element => {
  // Function to render risk rating stars
  const renderRiskRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-5 h-5 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-[911px] shadow-sm">
      <CardContent className="p-6">
        {/* Customer Header */}
        <div className="flex items-start gap-4 pb-4">
          <Avatar className="h-12 w-12 bg-[#ced0f8]">
            <AvatarImage src="/image.png" alt="Customer" />
            <AvatarFallback>NH</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-xl text-[#242524] font-['Archivo',Helvetica]">
              {customerData.name}
            </h2>
            <p className="text-sm text-[#8c8d8b] font-['Inter',Helvetica]">
              Customer ID: {customerData.customerId}
            </p>
          </div>
        </div>
        <Separator className="mb-6" />

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Segment
            </p>
            <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
              {customerData.segment}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Status
            </p>
            <Badge className="bg-[#22c55e33] text-green-800 border border-[#ebebea] font-medium rounded-[14px] px-2.5 py-0.5">
              {customerData.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Onboarded Date
            </p>
            <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
              {customerData.onboardedDate}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Tax Code
            </p>
            <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
              {customerData.taxCode}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Risk Rating
            </p>
            <Badge className="bg-[#efb03459] text-[#5d4108] font-normal rounded-[14px] px-2">
              {customerData.riskRating}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Industry Code
            </p>
            <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
              {customerData.industryCode}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
              Address
            </p>
            <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
              {customerData.address}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <p className="text-xs text-[#9095a0] font-medium font-['Inter',Helvetica]">
                Parent Customer ID
              </p>
              <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
                {customerData.parentCustomerId}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8c8d8b] font-medium font-['Inter',Helvetica]">
                CIF
              </p>
              <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
                {customerData.cif}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9095a0] font-normal font-['Inter',Helvetica]">
                Group ID
              </p>
              <p className="text-sm text-[#242524] font-medium font-['Inter',Helvetica]">
                {customerData.groupId}
              </p>
            </div>
          </div>
        </div>

        {/* Child Customer Details */}
        <h2 className="font-semibold text-xl text-[#242524] font-['Archivo',Helvetica] mb-4">
          Child Customer Details
        </h2>
        <div className="border border-[#dee1e6] rounded-[10px] mb-6 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#fafafb]">
              <TableRow>
                <TableHead className="w-[201px] py-6 font-semibold text-[#565e6c] text-sm font-['Archivo',Helvetica]">
                  Customer Name
                </TableHead>
                <TableHead className="w-[138px] font-semibold text-[#565e6c] text-sm font-['Archivo',Helvetica]">
                  Customer ID
                </TableHead>
                <TableHead className="w-[194px] font-semibold text-[#565e6c] text-sm font-['Archivo',Helvetica]">
                  Onboarded Date
                </TableHead>
                <TableHead className="w-[104px] font-semibold text-[#565e6c] text-sm font-['Archivo',Helvetica]">
                  Segment
                </TableHead>
                <TableHead className="w-[145px] font-semibold text-[#565e6c] text-sm text-center font-['Archivo',Helvetica]">
                  Risk Rating
                </TableHead>
                <TableHead className="w-[84px] font-semibold text-[#565e6c] text-sm font-['Archivo',Helvetica]">
                  Tax Code
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {childCustomers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-normal text-[#171a1f] text-sm font-['Inter',Helvetica]">
                    {customer.name}
                  </TableCell>
                  <TableCell className="font-normal text-[#171a1f] text-sm font-['Inter',Helvetica]">
                    {customer.customerId}
                  </TableCell>
                  <TableCell className="font-normal text-[#171a1f] text-sm font-['Inter',Helvetica]">
                    {customer.onboardedDate}
                  </TableCell>
                  <TableCell className="font-normal text-[#171a1f] text-sm font-['Inter',Helvetica]">
                    {customer.segment}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderRiskRating(customer.riskRating)}
                  </TableCell>
                  <TableCell className="font-normal text-[#171a1f] text-sm font-['Inter',Helvetica]">
                    {customer.taxCode}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Contacts & Guarantors */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-[#242524] font-['Archivo',Helvetica]">
              Contacts & Guarantors
            </CardTitle>
          </CardHeader>
          <Separator className="mx-6" />
          <CardContent className="pt-4">
            <div className="space-y-6">
              {/* Contacts */}
              <div>
                <h3 className="text-lg font-semibold text-[#242524] font-['Archivo',Helvetica] mb-3">
                  Contacts
                </h3>
                {contacts.map((contact, index) => (
                  <div key={index} className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-[#242524] font-['Inter',Helvetica]">
                        {contact.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ml-7">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
                          {contact.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
                          {contact.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-start-2">
                        <MailIcon className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
                          {contact.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
              </div>

              {/* Guarantors */}
              <div>
                <h3 className="text-lg font-semibold text-[#242524] font-['Archivo',Helvetica] mb-3">
                  Guarantors
                </h3>
                {guarantors.map((guarantor, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-[#242524] font-['Inter',Helvetica]">
                        {guarantor.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ml-7">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
                          {guarantor.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
                          {guarantor.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-start-2">
                        <MailIcon className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-[#8c8d8b] font-['Inter',Helvetica]">
                          {guarantor.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Accounts */}
        <div className="pt-2">
          <h3 className="text-lg font-semibold text-[#242524] font-['Archivo',Helvetica] mb-4 ml-2">
            Related Accounts
          </h3>
          {relatedAccounts.map((account, index) => (
            <div key={index} className="flex gap-8 ml-2">
              <span className="text-sm font-medium text-[#242524] font-['Inter',Helvetica] w-56">
                {account.name}
              </span>
              <span className="text-sm text-[#8c8d8b] font-['Inter',Helvetica]">
                {account.accountNumber}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
