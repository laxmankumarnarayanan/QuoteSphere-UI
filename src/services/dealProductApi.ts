import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export async function addDealProduct(data: any) {
  const response = await axios.post(`${API_BASE_URL}/deal-products`, data);
  return response.data;
}

export async function addDealSubProduct(data: any) {
  const response = await axios.post(`${API_BASE_URL}/deal-sub-products`, data);
  return response.data;
} 