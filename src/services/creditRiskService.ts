import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface CreditRiskDeal {
  id: string;
  dealId: string;
  customerId: string;
  customerName: string;
  initiator: string;
  totalCommitmentAmount: string;
  dealPhase: string;
  status: string;
}

export interface CreditRiskAssignment {
  assignmentId: string;
  dealId: string;
  creditOfficerId: string;
  assignmentStatus: string;
  priority: string;
  assignedDateTime: string;
  completedDateTime?: string;
  createdDateTime: string;
  createdBy: string;
  lastUpdatedDateTime: string;
  lastUpdatedBy: string;
}

export const creditRiskService = {
  async getSubmittedDeals(): Promise<CreditRiskDeal[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/deal/by-status/In-Progress`);
      
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

  async assignDealToCreditRisk(dealId: string, priority: string = "Medium"): Promise<CreditRiskAssignment> {
    try {
      const response = await fetch(`${API_BASE_URL}/credit-risk-assignments/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: dealId,
          creditOfficerId: "laxman.narayanan@fractalhive.com",
          assignedBy: "laxman.narayanan@fractalhive.com",
          priority: priority // This will be "Medium" by default
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign deal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error assigning deal:', error);
      throw error;
    }
  },

  async getAssignmentsByDealId(dealId: string): Promise<CreditRiskAssignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/credit-risk-assignments/deal/${dealId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  async getAssignmentsByCreditOfficerId(creditOfficerId: string): Promise<CreditRiskAssignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/credit-risk-assignments/credit-officer/${creditOfficerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  }
}; 