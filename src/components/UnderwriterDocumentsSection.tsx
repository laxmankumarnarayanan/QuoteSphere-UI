import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { underwriterAnalysisDocumentsService, UnderwriterDealAnalysisDocuments } from '../services/underwriterAnalysisDocumentsService';

interface UnderwriterDocumentsSectionProps {
  dealId: string;
  assignmentId: string;
}

export const UnderwriterDocumentsSection: React.FC<UnderwriterDocumentsSectionProps> = ({
  dealId,
  assignmentId
}) => {
  const [documents, setDocuments] = useState<UnderwriterDealAnalysisDocuments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    comments: '',
    file: null as File | null
  });

  useEffect(() => {
    loadDocuments();
  }, [dealId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await underwriterAnalysisDocumentsService.getDocumentsByDealId(dealId);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
    // This would typically call your Azure upload service
    // For now, we'll simulate the upload and return a storage path
    const fileName = `${dealId}_${Date.now()}_${file.name}`;
    return `https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer/${fileName}`;
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

      const documentData = {
        assignmentId,
        dealId,
        documentType: formData.documentType,
        storageFilePath,
        comments: formData.comments,
        isMandatory: false,
        lastUpdatedBy: 'laxman.narayanan@fractalhive.com'
      };

      if (editingId) {
        // Update existing document
        const updated = await underwriterAnalysisDocumentsService.updateDocument(editingId, documentData);
        setDocuments(prev => prev.map(doc => doc.uwDocumentId === editingId ? updated : doc));
        setEditingId(null);
      } else {
        // Create new document
        const created = await underwriterAnalysisDocumentsService.createDocument({
          ...documentData,
          createdBy: 'laxman.narayanan@fractalhive.com'
        });
        setDocuments(prev => [...prev, created]);
        setIsAdding(false);
      }

      // Reset form
      setFormData({
        documentType: '',
        comments: '',
        file: null
      });
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (document: UnderwriterDealAnalysisDocuments) => {
    setEditingId(document.uwDocumentId);
    setFormData({
      documentType: document.documentType || '',
      comments: document.comments || '',
      file: null
    });
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await underwriterAnalysisDocumentsService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.uwDocumentId !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
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
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      documentType: '',
      comments: '',
      file: null
    });
  };

  if (isLoading) {
    return (
      <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Underwriter Documents</h3>
        <div className="text-brand-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Underwriter Documents</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 py-1 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white p-4 rounded border border-brand-200 mb-4">
          <h4 className="text-md font-medium text-brand-900 mb-3">
            {editingId ? 'Edit Document' : 'Add New Document'}
          </h4>
          
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
              <label className="block text-sm font-medium text-brand-700 mb-1">File</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                disabled={!!editingId}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-700 mb-1">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter comments"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-brand-700">
            No documents uploaded yet.
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.uwDocumentId} className="bg-white p-3 rounded border border-brand-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-brand-900">{document.documentType}</span>
                    {document.isMandatory && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Mandatory</span>
                    )}
                  </div>
                  {document.comments && (
                    <p className="text-sm text-brand-700 mb-2">{document.comments}</p>
                  )}
                  <div className="text-xs text-brand-600">
                    Created: {document.createdDateTime ? new Date(document.createdDateTime).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {document.storageFilePath && (
                    <button
                      onClick={() => downloadFile(document.storageFilePath!, document.documentType || 'document')}
                      className="flex items-center gap-1 px-2 py-1 bg-brand-600 text-white text-xs rounded hover:bg-brand-700 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(document)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(document.uwDocumentId)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 