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
  async getDropdownValues(tableName: string, fieldName: string): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/translate-table/${tableName}/${fieldName}`);
    // Each entry is a TranslateTable object; fieldValue is in id.fieldValue
    return response.data.map((entry: any) => entry.id.fieldValue);
  },
}; 