import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealFinancialStatus {
  dealID: string;
  year: string;
  description: string;
  storagePath: string;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
}

export async function saveDealFinancialStatus(data: DealFinancialStatus) {
  const response = await axios.post(`${API_BASE_URL}/deal-financial-statuses`, data);
  return response.data;
}

export async function getDealFinancialStatusesByDealId(dealId: string): Promise<DealFinancialStatus[]> {
  const response = await axios.get(`${API_BASE_URL}/deal-financial-statuses/deal/${dealId}`);
  return response.data;
} 