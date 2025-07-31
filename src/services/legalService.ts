interface LegalDeal {
  id: string;
  dealId: string;
  customerId: string;
  customerName: string;
  initiator: string;
  totalCommitmentAmount: string;
  dealPhase: string;
  status: string;
}

interface LegalAssignment {
  assignmentId: string;
  dealId: string;
  assignedDateTime: string;
  assignmentStatus: string;
  priority: string;
  status: string;
}

class LegalService {
  private baseUrl = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

  async getSubmittedDeals(): Promise<LegalDeal[]> {
    try {
      // Use the same endpoint as credit risk since we want to see the same deals
      const response = await fetch(`${this.baseUrl}/dashboard/deal/by-status/In-Progress`);
      
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
  }

  async assignDealToLegal(dealId: string, priority: string = "Medium"): Promise<LegalAssignment> {
    try {
      const response = await fetch(`${this.baseUrl}/legal-deal-assignments/assign/${dealId}?priority=${priority}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign deal to legal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error assigning deal to legal:', error);
      throw error;
    }
  }

  async getAssignmentById(assignmentId: string): Promise<LegalAssignment> {
    try {
      const response = await fetch(`${this.baseUrl}/legal-deal-assignments/${assignmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignment details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      throw error;
    }
  }
}

export const legalService = new LegalService(); 