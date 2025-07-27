const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface UnderwriterDealAnalysisDocuments {
  uwDocumentId: string;
  assignmentId: string;
  dealId: string;
  documentType?: string;
  storageFilePath?: string;
  isMandatory?: boolean;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
  comments?: string;
}

export const underwriterAnalysisDocumentsService = {
  async getAllDocuments(): Promise<UnderwriterDealAnalysisDocuments[]> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  async getDocumentById(uwDocumentId: string): Promise<UnderwriterDealAnalysisDocuments> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents/${uwDocumentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }
    return response.json();
  },

  async getDocumentsByDealId(dealId: string): Promise<UnderwriterDealAnalysisDocuments[]> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents/deal/${dealId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  async getDocumentsByAssignmentId(assignmentId: string): Promise<UnderwriterDealAnalysisDocuments[]> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents/assignment/${assignmentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  async getDocumentsByDealIdAndDocumentType(dealId: string, documentType: string): Promise<UnderwriterDealAnalysisDocuments[]> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents/deal/${dealId}/type/${encodeURIComponent(documentType)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  async createDocument(document: Partial<UnderwriterDealAnalysisDocuments>): Promise<UnderwriterDealAnalysisDocuments> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });
    if (!response.ok) {
      throw new Error('Failed to create document');
    }
    return response.json();
  },

  async updateDocument(uwDocumentId: string, document: Partial<UnderwriterDealAnalysisDocuments>): Promise<UnderwriterDealAnalysisDocuments> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents/${uwDocumentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });
    if (!response.ok) {
      throw new Error('Failed to update document');
    }
    return response.json();
  },

  async deleteDocument(uwDocumentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/underwriter-analysis-documents/${uwDocumentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
  },
}; 