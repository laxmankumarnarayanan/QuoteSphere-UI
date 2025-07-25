import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { CustomerDetails, ChildCustomer, customerService } from "../../../../services/customerService";
import GuarantorIcon from '../../../../components/GuarantorIcon';

interface CustomerDetailsSectionProps {
  selectedCustomer: CustomerDetails | null;
  onCustomerSelect?: (customer: CustomerDetails | null) => void;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-brand-600">{label}</dt>
      <dd className="mt-1 text-sm text-brand-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-brand-800 mb-2">{title}</h3>
      <Card className="border border-brand-200">
        <CardContent className="p-4">
          <dl className="divide-y divide-brand-100">{children}</dl>
        </CardContent>
      </Card>
    </div>
  );

// Separate component for contact items to properly handle useState
const ContactItem: React.FC<{
  contact: any;
  addresses: any[];
  emails: any[];
  phones: any[];
}> = ({ contact, addresses, emails, phones }) => {
  const [expanded, setExpanded] = useState({ address: false, phone: false, email: false });
  const toggle = (type: 'address' | 'phone' | 'email') => setExpanded(prev => ({ ...prev, [type]: !prev[type] }));

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25v-.667A2.583 2.583 0 017.083 16h9.834a2.583 2.583 0 012.583 2.583v.667A2.25 2.25 0 0117.25 21h-10.5A2.25 2.25 0 014.5 19.25z" />
        </svg>
        <span className="text-base font-medium text-[#242524]">
          {contact.customerContactFirstName} {contact.customerContactLastName}
          {contact.designation && (
            <span className="text-xs text-gray-500 ml-1">
              ({contact.designation})
            </span>
          )}
          {contact.isGuarantor && (
            <span className="text-xs text-gray-500 ml-1">(Guarantor)</span>
          )}
        </span>
      </div>
      <div className="flex flex-col gap-1 ml-7">
        {addresses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c4.556 0 8.25 3.694 8.25 8.25 0 6.364-7.25 11.25-7.25 11.25s-7.25-4.886-7.25-11.25c0-4.556 3.694-8.25 8.25-8.25z" />
              </svg>
              <span>{(addresses[0].id?.customerContactAddressType || addresses[0].customerContactAddressType || 'Type Unknown').toUpperCase()}: {addresses[0].addressLine1}, {addresses[0].city}, {addresses[0].state} {addresses[0].postalCode}</span>
              {addresses.length > 1 && (
                <button className="text-xs text-blue-600 underline ml-2" onClick={() => toggle('address')} type="button">
                  {expanded.address ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            {expanded.address && addresses.slice(1).map((address: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm ml-6 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c4.556 0 8.25 3.694 8.25 8.25 0 6.364-7.25 11.25-7.25 11.25s-7.25-4.886-7.25-11.25c0-4.556 3.694-8.25 8.25-8.25z" />
                </svg>
                <span>{(address.id?.customerContactAddressType || address.customerContactAddressType || 'Type Unknown').toUpperCase()}: {address.addressLine1}, {address.city}, {address.state} {address.postalCode}</span>
              </div>
            ))}
          </div>
        )}
        {phones.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v2.25A2.25 2.25 0 004.5 11.25h.664a2.25 2.25 0 012.12 1.5l.5 1.5a2.25 2.25 0 002.12 1.5h2.25a2.25 2.25 0 002.12-1.5l.5-1.5a2.25 2.25 0 012.12-1.5h.664a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75z" />
              </svg>
              <span>{(phones[0].id?.customerContactPhoneType || phones[0].customerContactPhoneType || 'Type Unknown').toUpperCase()}: {phones[0].customerContactPhoneNo}</span>
              {phones.length > 1 && (
                <button className="text-xs text-blue-600 underline ml-2" onClick={() => toggle('phone')} type="button">
                  {expanded.phone ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            {expanded.phone && phones.slice(1).map((phone: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm ml-6 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v2.25A2.25 2.25 0 004.5 11.25h.664a2.25 2.25 0 012.12 1.5l.5 1.5a2.25 2.25 0 002.12 1.5h2.25a2.25 2.25 0 002.12-1.5l.5-1.5a2.25 2.25 0 012.12-1.5h.664a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75z" />
                </svg>
                <span>{(phone.id?.customerContactPhoneType || phone.customerContactPhoneType || 'Type Unknown').toUpperCase()}: {phone.customerContactPhoneNo}</span>
              </div>
            ))}
          </div>
        )}
        {emails.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75l-9.75 7.5-9.75-7.5" />
              </svg>
              <span>{(emails[0].id?.customerContactEmailType || emails[0].customerContactEmailType || 'Type Unknown').toUpperCase()}: {emails[0].customerContactEmail}</span>
              {emails.length > 1 && (
                <button className="text-xs text-blue-600 underline ml-2" onClick={() => toggle('email')} type="button">
                  {expanded.email ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            {expanded.email && emails.slice(1).map((email: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm ml-6 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75l-9.75 7.5-9.75-7.5" />
                </svg>
                <span>{(email.id?.customerContactEmailType || email.customerContactEmailType || 'Type Unknown').toUpperCase()}: {email.customerContactEmail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomerDetailsSection = ({ selectedCustomer, onCustomerSelect }: CustomerDetailsSectionProps): JSX.Element => {
  const [loadingChildCustomer, setLoadingChildCustomer] = useState<string | null>(null);

  if (!selectedCustomer) {
    return (
      <Card className="w-full shadow border border-brand-200">
        <CardContent className="px-4 py-4">
          <div className="text-center text-brand-400">Select a customer to view details</div>
        </CardContent>
      </Card>
    );
  }

  const {
    customer,
    customerAccounts,
    customerCollaterals,
    customerContacts,
    customerContactAddresses,
    customerContactEmails,
    customerContactPhones,
    customerFacilities,
    childCustomers,
  } = selectedCustomer;

  const handleChildCustomerClick = async (childCustomer: ChildCustomer) => {
    if (!onCustomerSelect) return;
    
    try {
      setLoadingChildCustomer(childCustomer.customerID);
      const childCustomerDetails = await customerService.getCustomerDetails(childCustomer.customerID);
      onCustomerSelect(childCustomerDetails);
    } catch (error) {
      console.error('Failed to fetch child customer details:', error);
      // You could add a toast notification here to show the error
    } finally {
      setLoadingChildCustomer(null);
    }
  };

  return (
    <Card className="w-full shadow border border-brand-200">
      <CardHeader className="px-4 py-[19px]">
        <CardTitle className="font-semibold text-base text-brand-900 font-['Archivo',Helvetica]">
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4 overflow-y-auto max-h-[70vh]">
        
        {customer && (
          <Section title="Customer Information">
            <DetailItem label="Customer Name" value={customer.customerName} />
            <DetailItem label="Customer ID" value={customer.customerCode} />
            <DetailItem label="Industry Segment" value={customer.industry} />
            <DetailItem label="Region" value={customer.customerRegion} />
            <DetailItem label="Status" value={customer.customerStatus} />
            <DetailItem label="Risk Rating" value={customer.riskRating} />
            <DetailItem label="Customer Type" value={customer.customerType} />
          </Section>
        )}

        {childCustomers && childCustomers.length > 0 && (
            <Section title="Child Accounts">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>CIF</TableHead>
                            <TableHead>Onboarded Date</TableHead>
                            <TableHead>Segment Code</TableHead>
                            <TableHead>Risk Rating</TableHead>
                            <TableHead>Tax Code</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {childCustomers.map((child: ChildCustomer) => (
                            <TableRow key={child.customerID}>
                                <TableCell>
                                  {onCustomerSelect ? (
                                    <button
                                      onClick={() => handleChildCustomerClick(child)}
                                      disabled={loadingChildCustomer === child.customerID}
                                      className={`text-left hover:text-blue-600 hover:underline transition-colors ${
                                        loadingChildCustomer === child.customerID 
                                          ? 'text-gray-400 cursor-not-allowed' 
                                          : 'text-blue-600 cursor-pointer'
                                      }`}
                                    >
                                      {loadingChildCustomer === child.customerID ? (
                                        <span className="flex items-center gap-2">
                                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                          Loading...
                                        </span>
                                      ) : (
                                        child.customerName
                                      )}
                                    </button>
                                  ) : (
                                    <span>{child.customerName}</span>
                                  )}
                                </TableCell>
                                <TableCell>{child.cif}</TableCell>
                                <TableCell>{new Date(child.onboardedDate).toLocaleDateString()}</TableCell>
                                <TableCell>{child.segmentCode}</TableCell>
                                <TableCell>{child.riskRating}</TableCell>
                                <TableCell>{child.taxCode}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Section>
        )}

        {customerAccounts && customerAccounts.length > 0 && (
          <Section title="Accounts">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Relationship Type</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead>Total Outstanding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerAccounts.map((account, idx) => (
                  <TableRow key={account.id.accountNumber || idx}>
                    <TableCell>{account.id.accountNumber || 'N/A'}</TableCell>
                    <TableCell>{account.relationshipType || 'N/A'}</TableCell>
                    <TableCell>{account.attribute || 'N/A'}</TableCell>
                    <TableCell>{account.accountStatus || 'N/A'}</TableCell>
                    <TableCell>{account.currency || 'N/A'}</TableCell>
                    <TableCell>{account.expiryDate ? new Date(account.expiryDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{account.maturityDate ? new Date(account.maturityDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{account.totalOutstanding !== undefined && account.totalOutstanding !== null ? account.totalOutstanding : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        )}
        
        {customerFacilities && customerFacilities.length > 0 && (
          <Section title="Facilities">
            {customerFacilities.map((facility: any, index: number) => (
              <div key={index} className="p-2 my-2 border rounded">
                <h4 className="font-semibold text-md mb-2">Facility {index + 1}</h4>
                <DetailItem label="Facility ID" value={facility.facilityID} />
                <DetailItem label="Facility Type" value={facility.facilityType} />
                <DetailItem label="Status" value={facility.status} />
                <DetailItem label="Currency" value={facility.currency} />
                <DetailItem label="Maturity Date" value={new Date(facility.maturityDate).toLocaleDateString()} />
              </div>
            ))}
          </Section>
        )}

        {customerCollaterals && customerCollaterals.length > 0 && (
            <Section title="Collaterals">
            {customerCollaterals.map((collateral: any, index: number) => (
                <div key={index} className="p-2 my-2 border rounded">
                    <h4 className="font-semibold text-md mb-2">Collateral {index + 1}</h4>
                    <DetailItem label="Type" value={collateral.collateralType} />
                    <DetailItem label="Value" value={collateral.collateralVal} />
                </div>
            ))}
            </Section>
        )}

        {customerContacts && customerContacts.length > 0 && (
            <Section title="Contacts">
                <div className="space-y-6">
                    {customerContacts.map((contact: any, index: number) => {
                        const addresses = customerContactAddresses?.filter((a: any) => a.customerCor === contact.customerCor) || [];
                        const emails = customerContactEmails?.filter((e: any) => e.customerCor === contact.customerCor) || [];
                        const phones = customerContactPhones?.filter((p: any) => p.customerCor === contact.customerCor) || [];
                        
                        return (
                            <ContactItem
                                key={index}
                                contact={contact}
                                addresses={addresses}
                                emails={emails}
                                phones={phones}
                            />
                        );
                    })}
                </div>
            </Section>
        )}

      </CardContent>
    </Card>
  );
};
