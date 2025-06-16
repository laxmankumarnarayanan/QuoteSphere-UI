import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export interface Customer {
    id: number;
    customerName: string;
    customerCode: string;
    industry: string;
    region: string;
    status: string;
}

export const customerService = {
    async getAllCustomers(): Promise<Customer[]> {
        const response = await axios.get(`${API_BASE_URL}/customers`);
        return response.data;
    },

    async getCustomerById(id: number): Promise<Customer> {
        const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
        return response.data;
    }
}; 