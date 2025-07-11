import React from "react";
import { CustomerDetails } from "../../services/customerService";

interface CustomerInfoBannerProps {
  customer: CustomerDetails;
}

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col min-w-[120px]">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-sm text-gray-900 font-semibold truncate">{value}</span>
  </div>
);

export const CustomerInfoBanner: React.FC<CustomerInfoBannerProps> = ({ customer }) => {
  if (!customer) return null;
  const c = customer.customer;
  return (
    <div className="flex flex-wrap gap-6 items-center bg-violet-50 border border-violet-200 rounded-lg px-6 py-3 mb-6">
      <InfoItem label="Customer Name" value={c.customerName} />
      <InfoItem label="Customer ID" value={c.customerCode} />
      <InfoItem label="Industry" value={c.industry} />
      <InfoItem label="Region" value={c.customerRegion} />
      <InfoItem label="Status" value={c.customerStatus} />
      <InfoItem label="Risk Rating" value={c.riskRating} />
      <InfoItem label="Customer Type" value={c.customerType} />
    </div>
  );
}; 