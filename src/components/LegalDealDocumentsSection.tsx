import React, { useState, useEffect } from 'react';
import { FileText, Upload, Eye, Trash2, Plus } from 'lucide-react';

interface LegalDocument {
  legalDocumentId: string;
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

interface LegalDealDocumentsSectionProps {
  dealId: string;
  assignmentId: string;
  readOnly?: boolean;
}

const LegalDealDocumentsSection: React.FC<LegalDealDocumentsSectionProps> = ({
  dealId,
  assignmentId,
  readOnly = false
}) => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    documentType: '',
    fileName: '',
    storageFilePath: '',
    isMandatory: false
  });

  useEffect(() => {
    fetchDocuments();
  }, [assignmentId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-documents/assignment/${assignmentId}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        setError('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          dealId: dealId,
          documentType: newDocument.documentType,
          fileName: newDocument.fileName,
          storageFilePath: newDocument.storageFilePath,
          isMandatory: newDocument.isMandatory,
          createdBy: 'laxman.narayanan@fractalhive.com',
          lastUpdatedBy: 'laxman.narayanan@fractalhive.com'
        }),
      });

      if (response.ok) {
        const savedDocument = await response.json();
        setDocuments([...documents, savedDocument]);
        setNewDocument({
          documentType: '',
          fileName: '',
          storageFilePath: '',
          isMandatory: false
        });
        setShowAddForm(false);
      } else {
        setError('Failed to add document');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      setError('Error adding document');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.legalDocumentId !== documentId));
      } else {
        setError('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Error deleting document');
    }
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    try {
      // Check if storagePath already contains the full URL
      let blobName = storagePath;
      if (storagePath.includes('https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/')) {
        // Extract just the blob name from the full URL
        blobName = storagePath.replace('https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/', '');
      }
      
      // Get SAS token for the file
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/azure-sas/read-sas?blobName=${encodeURIComponent(blobName)}`);
      if (!response.ok) {
        throw new Error('Failed to get SAS token');
      }
      const sasToken = await response.text();
      
      // Construct the full URL with SAS token
      const fullUrl = `https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/${blobName}?${sasToken}`;
      
      // Open in new tab
      window.open(fullUrl, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file. Please try again.');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <span className="ml-2">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Legal Documents
        </h3>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!readOnly && (
          <div className="mb-6">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </button>
            ) : (
              <form onSubmit={handleAddDocument} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <input
                      type="text"
                      value={newDocument.documentType}
                      onChange={(e) => setNewDocument({...newDocument, documentType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={newDocument.fileName}
                      onChange={(e) => setNewDocument({...newDocument, fileName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage File Path
                    </label>
                    <input
                      type="text"
                      value={newDocument.storageFilePath}
                      onChange={(e) => setNewDocument({...newDocument, storageFilePath: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isMandatory"
                      checked={newDocument.isMandatory}
                      onChange={(e) => setNewDocument({...newDocument, isMandatory: e.target.checked})}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isMandatory" className="ml-2 block text-sm text-gray-900">
                      Is Mandatory
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Save Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents found</p>
          ) : (
            documents.map((document) => (
              <div key={document.legalDocumentId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-brand-600" />
                      <h4 className="font-medium text-gray-900">{document.fileName}</h4>
                      {document.isMandatory && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {document.documentType}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {formatDateTime(document.createdDateTime)}
                      </div>
                      <div>
                        <span className="font-medium">Created By:</span> {document.createdBy}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {formatDateTime(document.lastUpdatedDateTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadFile(document.storageFilePath, document.fileName)}
                      className="p-2 text-brand-600 hover:text-brand-700 transition-colors"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {!readOnly && (
                      <button
                        onClick={() => handleDeleteDocument(document.legalDocumentId)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { LegalDealDocumentsSection }; 