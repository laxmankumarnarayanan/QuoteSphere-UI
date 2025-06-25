import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export interface Customer {
    customerID: string;
    customerName: string;
    customerCode: string;
    industry: string;
    region: string;
    status: string;
    customerRegion: string;
    customerStatus: string;
    riskRating: string;
    customerType: string;
}

export interface CustomerDetails {
    customer: Customer;
    customerAccounts: any[]; // Replace with specific types if available
    customerCollaterals: any[];
    customerContacts: any[];
    customerContactAddresses: any[];
    customerContactEmails: any[];
    customerContactPhones: any[];
    customerFacilities: any[];
    childCustomers?: ChildCustomer[];
}

export interface ChildCustomer {
    customerID: string;
    customerName: string;
    cif: string;
    onboardedDate: string;
    segmentCode: string;
    riskRating: string;
    taxCode: string;
}

export const customerService = {
    async getAllCustomers(): Promise<Customer[]> {
        const response = await axios.get(`${API_BASE_URL}/customers`);
        return response.data;
    },

    async getCustomerDetails(customerId: string): Promise<CustomerDetails> {
        const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/details`);
        return response.data;
    }
}; 