const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net';

export interface CreditDealDocuments {
  creditDocumentId: string;
  assignmentId: string;
  dealId: string;
  documentType: string;
  fileName: string;
  storageFilePath: string;
  isMandatory: boolean;
  createdBy: string;
  createdDateTime: string;
  lastUpdatedBy: string;
  lastUpdatedDateTime: string;
}

export const creditDealDocumentsService = {
  async getAllDocuments(): Promise<CreditDealDocuments[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  async getDocumentById(documentId: string): Promise<CreditDealDocuments> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents/${documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  async getDocumentsByDealId(dealId: string): Promise<CreditDealDocuments[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents/deal/${dealId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents by deal ID');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching documents by deal ID:', error);
      throw error;
    }
  },

  async getDocumentsByAssignmentId(assignmentId: string): Promise<CreditDealDocuments[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents/assignment/${assignmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents by assignment ID');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching documents by assignment ID:', error);
      throw error;
    }
  },

  async createDocument(documentData: Omit<CreditDealDocuments, 'creditDocumentId' | 'createdDateTime' | 'lastUpdatedDateTime'>): Promise<CreditDealDocuments> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      if (!response.ok) {
        throw new Error('Failed to create document');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  async updateDocument(documentId: string, documentData: Partial<CreditDealDocuments>): Promise<CreditDealDocuments> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      if (!response.ok) {
        throw new Error('Failed to update document');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  async deleteDocument(documentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },
}; 