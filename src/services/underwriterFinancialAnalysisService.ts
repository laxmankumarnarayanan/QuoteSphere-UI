const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface UnderwriterDealFinancialAnalysis {
  financialAnalysisId: string;
  assignmentId: string;
  dealId: string;
  assetValue?: number;
  liabilityValue?: number;
  currentPortionLongTermDebt?: number;
  debtCoverageRatio?: number;
  liabilityRatio?: number;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
}

export const underwriterFinancialAnalysisService = {
  async getAllFinancialAnalysis(): Promise<UnderwriterDealFinancialAnalysis[]> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis`);
    if (!response.ok) {
      throw new Error('Failed to fetch financial analysis');
    }
    return response.json();
  },

  async getFinancialAnalysisById(financialAnalysisId: string): Promise<UnderwriterDealFinancialAnalysis> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis/${financialAnalysisId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch financial analysis');
    }
    return response.json();
  },

  async getFinancialAnalysisByDealId(dealId: string): Promise<UnderwriterDealFinancialAnalysis | null> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis/deal/${dealId}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch financial analysis');
    }
    return response.json();
  },

  async getFinancialAnalysisByAssignmentId(assignmentId: string): Promise<UnderwriterDealFinancialAnalysis[]> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis/assignment/${assignmentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch financial analysis');
    }
    return response.json();
  },

  async createFinancialAnalysis(financialAnalysis: Partial<UnderwriterDealFinancialAnalysis>): Promise<UnderwriterDealFinancialAnalysis> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(financialAnalysis),
    });
    if (!response.ok) {
      throw new Error('Failed to create financial analysis');
    }
    return response.json();
  },

  async updateFinancialAnalysis(financialAnalysisId: string, financialAnalysis: Partial<UnderwriterDealFinancialAnalysis>): Promise<UnderwriterDealFinancialAnalysis> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis/${financialAnalysisId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(financialAnalysis),
    });
    if (!response.ok) {
      throw new Error('Failed to update financial analysis');
    }
    return response.json();
  },

  async deleteFinancialAnalysis(financialAnalysisId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis/${financialAnalysisId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete financial analysis');
    }
  },

  async existsByDealId(dealId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/underwriter-financial-analysis/deal/${dealId}/exists`);
    if (!response.ok) {
      throw new Error('Failed to check if financial analysis exists');
    }
    return response.json();
  },
}; 