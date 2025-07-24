import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface UnderwriterDeal {
  id: string;
  dealId: string;
  customerId: string;
  customerName: string;
  initiator: string;
  totalCommitmentAmount: string;
  dealPhase: string;
  status: string;
}

export const underwriterService = {
  async getSubmittedDeals(): Promise<UnderwriterDeal[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/deal/by-status/Submitted`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch submitted deals');
      }
      
      const data = await response.json();
      
      // Transform the data to match our interface
      return data.map((deal: any) => ({
        id: deal.id,
        dealId: deal.dealId,
        customerId: deal.customerId || 'N/A',
        customerName: deal.customerName,
        initiator: deal.initiator || 'N/A',
        totalCommitmentAmount: deal.commitmentAmount || 'N/A',
        dealPhase: deal.stage || 'Initial',
        status: deal.status
      }));
    } catch (error) {
      console.error('Error fetching submitted deals:', error);
      throw error;
    }
  },

  async approveDeal(dealId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/deal/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealStatus: 'Approved',
          lastUpdatedBy: 'Underwriter'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve deal');
      }
    } catch (error) {
      console.error('Error approving deal:', error);
      throw error;
    }
  },

  async rejectDeal(dealId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/deal/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealStatus: 'Rejected',
          lastUpdatedBy: 'Underwriter'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject deal');
      }
    } catch (error) {
      console.error('Error rejecting deal:', error);
      throw error;
    }
  }
}; 