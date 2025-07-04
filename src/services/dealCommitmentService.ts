import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealCommitment {
  dealID: string;
  commitmentNumber?: number; // Autoincremented, not required on create
  currency: string;
  commitmentAmount: number;
  tenure: number;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
}

export async function saveDealCommitment(data: DealCommitment) {
  const response = await axios.post(`${API_BASE_URL}/deal-commitments`, data);
  return response.data;
} 