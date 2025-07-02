import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealCollateral {
  id: {
    dealID: string;
    collateralID: number;
  };
  collateralType: string;
  collateralValue: number;
  currency: string;
  createdBy: string;
  createdDateTime: string;
  lastUpdatedBy: string;
  lastUpdatedDateTime: string;
}

export async function saveDealCollateral(data: DealCollateral) {
  const response = await axios.post(`${API_BASE_URL}/deal-collaterals`, data);
  return response.data;
} 