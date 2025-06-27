import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface Deal {
  dealId: string;
  customerId: string;
  customerName: string;
  dealStatus: string;
  dealPhase?: string;
  initiator: string;
  createdDateTime?: string;
  createdBy?: string;
  lastUpdatedDateTim?: string;
  lastUpdatedBy?: string;
}

export const dealService = {
  async createDraftDeal(customerId: string, customerName: string, initiator: string): Promise<Deal> {
    const response = await axios.post(`${API_BASE_URL}/deals/draft`, {
      customerId,
      customerName,
      initiator,
    });
    return response.data;
  },
}; 