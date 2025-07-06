import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealCommitment {
  dealID: string;
  commitmentNumber?: number; // Autoincremented, not required on create
  currency: string;
  commitmentAmount: number;
  tenure: number;
  productID: string;
  subProductID: string;
  description: string;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
}

export async function saveDealCommitment(data: DealCommitment) {
  const response = await axios.post(`${API_BASE_URL}/deal-commitments`, data);
  return response.data;
}

export async function getDealCommitmentsByDealId(dealId: string): Promise<DealCommitment[]> {
  const response = await axios.get(`${API_BASE_URL}/deal-commitments/deal/${dealId}`);
  return response.data;
} 