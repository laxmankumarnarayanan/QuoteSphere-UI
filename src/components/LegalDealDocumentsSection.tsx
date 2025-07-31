import React, { useState, useEffect } from 'react';
import { FileText, Upload, Eye, Trash2, Plus, Save, X, Edit } from 'lucide-react';
import { BlobServiceClient } from '@azure/storage-blob';

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
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    fileName: '',
    isMandatory: false,
    file: null as File | null
  });

  useEffect(() => {
    console.log('LegalDealDocumentsSection: assignmentId =', assignmentId);
    fetchDocuments();
  }, [assignmentId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      console.log('Fetching documents for assignment:', assignmentId);
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-documents/assignment/${assignmentId}`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Documents data:', data);
        setDocuments(data);
      } else {
        console.error('Failed to fetch documents, status:', response.status);
        // Don't set error for 404, just show empty state
        if (response.status !== 404) {
          setError('Failed to fetch documents');
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Don't set error for network issues, just show empty state
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const uploadFileToAzure = async (file: File): Promise<string> => {
    try {
      // Generate a unique blob name
      const fileName = `${dealId}_${Date.now()}_${file.name}`;
      
      // Get SAS token for upload
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/azure-sas?blobName=${encodeURIComponent(fileName)}`);
      if (!response.ok) {
        throw new Error('Failed to get SAS token for upload');
      }
      const sasToken = await response.text();
      
      // Upload file to Azure Blob Storage
      const blobServiceClient = new BlobServiceClient(`https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer?${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient("");
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      
      await blockBlobClient.uploadBrowserData(file, {
        blobHTTPHeaders: { blobContentType: file.type }
      });
      
      // Return the storage path
      return `https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to Azure:', error);
      throw new Error('Failed to upload file to Azure');
    }
  };

  const handleSave = async () => {
    if (!formData.documentType.trim()) {
      alert('Please enter a document type');
      return;
    }

    if (!formData.file && !editingId) {
      alert('Please select a file');
      return;
    }

    try {
      setIsSaving(true);
      let storageFilePath = '';

      if (formData.file) {
        storageFilePath = await uploadFileToAzure(formData.file);
      }

      const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          dealId: dealId,
          documentType: formData.documentType,
          fileName: formData.file ? formData.file.name : formData.fileName,
          storageFilePath: storageFilePath,
          isMandatory: formData.isMandatory,
          createdBy: 'laxman.narayanan@fractalhive.com',
          lastUpdatedBy: 'laxman.narayanan@fractalhive.com'
        }),
      });

      if (response.ok) {
        const savedDocument = await response.json();
        setDocuments([...documents, savedDocument]);
        setFormData({
          documentType: '',
          fileName: '',
          isMandatory: false,
          file: null
        });
        setIsAdding(false);
      } else {
        setError('Failed to add document');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      setError('Error adding document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (document: LegalDocument) => {
    setEditingId(document.legalDocumentId);
    setFormData({
      documentType: document.documentType,
      fileName: document.fileName,
      isMandatory: document.isMandatory,
      file: null
    });
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

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

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      documentType: '',
      fileName: '',
      isMandatory: false,
      file: null
    });
  };

  if (loading) {
    return (
      <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-brand-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Legal Documents</h3>
        {!readOnly && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-1.5 text-sm font-semibold text-white rounded-lg shadow-md border border-transparent bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-brand-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Add Document Form */}
      {(isAdding || editingId) && !readOnly && (
        <div className="mb-6 p-4 border border-brand-200 rounded-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Document Type *</label>
              <input
                type="text"
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter document type"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">File *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isMandatory}
                onChange={(e) => handleInputChange('isMandatory', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-brand-700">Is Mandatory</span>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md border border-transparent bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-brand-500"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Save'}
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center px-4 py-2 text-sm font-semibold text-brand-700 bg-white border border-brand-300 rounded-lg shadow-sm hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-brand-600">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <div key={document.legalDocumentId} className="flex items-center justify-between p-3 border border-brand-200 rounded-lg bg-white">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-brand-900">{document.documentType}</h4>
                  {document.isMandatory && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Mandatory</span>
                  )}
                </div>
                <p className="text-sm text-brand-600 mt-1">{document.fileName}</p>
                <p className="text-xs text-brand-500 mt-1">
                  Uploaded: {document.createdDateTime ? new Date(document.createdDateTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadFile(document.storageFilePath || '', document.fileName)}
                  className="p-2 text-brand-600 hover:text-brand-800 hover:bg-brand-100 rounded-md transition-colors"
                  title="View Document"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {!readOnly && (
                  <>
                    <button
                      onClick={() => handleEdit(document)}
                      className="p-2 text-brand-600 hover:text-brand-800 hover:bg-brand-100 rounded-md transition-colors"
                      title="Edit Document"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.legalDocumentId)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { LegalDealDocumentsSection }; 