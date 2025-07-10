import React, { useState, useEffect, useRef } from "react";
import SelectInput from "../template components/components/form/SelectInput";
import { dealService } from "../services/dealService";
import TextInput from "../template components/components/form/TextInput";
import SecondaryButton from "../template components/components/elements/SecondaryButton";
import { BlobServiceClient } from "@azure/storage-blob";

interface DealCollateralFormProps {
  dealId: string;
  showForms?: boolean;
}

const initialState = {
  collateralType: "",
  collateralValue: "",
  currency: "",
  description: "",
};

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';
const AZURE_CONTAINER_URL = "https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer";

// Unified SAS token getter
async function getSasToken(blobName: string) {
  const res = await fetch(`${API_BASE_URL}/azure-sas?blobName=${encodeURIComponent(blobName)}`);
  if (!res.ok) throw new Error('Failed to get SAS token');
  return await res.text();
}

// Unified file upload function
async function uploadFileToAzure(file: File, blobName: string, sasToken: string) {
  const blobServiceClient = new BlobServiceClient(`${AZURE_CONTAINER_URL}?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient("");
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadBrowserData(file, {
    blobHTTPHeaders: { blobContentType: file.type }
  });
  return `${AZURE_CONTAINER_URL}/${blobName}`;
}

async function getViewUrl(blobName: string) {
  const res = await fetch(`${API_BASE_URL}/azure-sas/read-sas?blobName=${encodeURIComponent(blobName)}`);
  if (!res.ok) throw new Error('Failed to get view SAS token');
  const sasToken = await res.text();
  return `${AZURE_CONTAINER_URL}/${blobName}?${sasToken}`;
}

const DealCollateralForm: React.FC<DealCollateralFormProps> = ({ dealId, showForms }) => {
  const [form, setForm] = useState<typeof initialState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [collateralTypeOptions, setCollateralTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [collateralTypeLoading, setCollateralTypeLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState<{ value: string; label: string }[]>([]);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [nextCollateralId, setNextCollateralId] = useState<number>(1);
  const [addedCollaterals, setAddedCollaterals] = useState<any[]>([]);
  const [documentCategory, setDocumentCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentCategoryOptions, setDocumentCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [documentTypeOptions, setDocumentTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [nextDocumentId, setNextDocumentId] = useState<number>(1);
  const [addedDocuments, setAddedDocuments] = useState<any[]>([]);
  const [collateralFile, setCollateralFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [docSuccess, setDocSuccess] = useState(false);

  // Refs for file inputs
  const collateralFileInputRef = useRef<HTMLInputElement | null>(null);
  const documentFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCollateralTypeLoading(true);
    dealService.getDropdownValues("DealCollateral", "CollateralType")
      .then(values => setCollateralTypeOptions(values.map(v => ({ value: v, label: v }))))
      .catch(err => console.error("Error loading collateral types:", err))
      .finally(() => setCollateralTypeLoading(false));

    setCurrencyLoading(true);
    dealService.getDropdownValues("DealCollateral", "Currency")
      .then(values => setCurrencyOptions(values.map(v => ({ value: v, label: v }))))
      .catch(err => console.error("Error loading currencies:", err))
      .finally(() => setCurrencyLoading(false));

    dealService.getDropdownValues("DealDocuments", "DocumentCategory")
      .then(values => setDocumentCategoryOptions(values.map(v => ({ value: v, label: v }))))
      .catch(err => console.error("Error loading document categories:", err));
      
    dealService.getDropdownValues("DealDocuments", "DocumentType")
      .then(values => setDocumentTypeOptions(values.map(v => ({ value: v, label: v }))))
      .catch(err => console.error("Error loading document types:", err));
  }, []);

  // Fetch current collaterals for this deal to determine next CollateralID
  useEffect(() => {
    async function fetchCurrentCollaterals() {
      try {
        const res = await fetch(`${API_BASE_URL}/deal-collaterals/deal/${dealId}`);
        if (!res.ok) throw new Error('Failed to fetch collaterals');
        const data = await res.json();
        setAddedCollaterals(data);
        const maxId = data.reduce((max: number, c: any) => {
          const idVal = c.id?.collateralID || 0;
          return idVal > max ? idVal : max;
        }, 0);
        setNextCollateralId(maxId + 1);
      } catch (err) {
        console.error("Error fetching collaterals:", err);
        setNextCollateralId(1);
        setAddedCollaterals([]);
      }
    }
    if (dealId) fetchCurrentCollaterals();
  }, [dealId, success]);

  // Fetch current documents for this deal to determine next DocumentID
  useEffect(() => {
    async function fetchCurrentDocuments() {
      try {
        const res = await fetch(`${API_BASE_URL}/deal-documents/deal/${dealId}`);
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        setAddedDocuments(data);
        const maxId = data.reduce((max: number, d: any) => {
          const idVal = d.id?.documentID || 0;
          return idVal > max ? idVal : max;
        }, 0);
        setNextDocumentId(maxId + 1);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setNextDocumentId(1);
        setAddedDocuments([]);
      }
    }
    if (dealId) fetchCurrentDocuments();
  }, [dealId, docSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!dealId) errors.push("Deal ID is required");
    if (!form.collateralType) errors.push("Collateral Type is required");
    if (!form.collateralValue || isNaN(Number(form.collateralValue))) errors.push("Valid Collateral Value is required");
    if (!form.currency) errors.push("Currency is required");
    if (!form.description) errors.push("Description is required");
    
    if (errors.length > 0) {
      throw new Error("Validation errors: " + errors.join(", "));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate form first
      validateForm();
      
      let storagePath = null;
      
      // Upload file if provided
      if (collateralFile) {
        const blobName = `${dealId},${nextCollateralId}_${collateralFile.name}`;
        const sasToken = await getSasToken(blobName);
        storagePath = await uploadFileToAzure(collateralFile, blobName, sasToken);
      }
      
      // Use the correct payload structure (nested id)
      const payload = {
        id: {
          dealID: dealId,
          collateralID: nextCollateralId
        },
        collateralType: form.collateralType,
        collateralValue: Number(form.collateralValue),
        currency: form.currency,
        description: form.description,
        storagePath: storagePath,
        createdBy: "system",
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "system",
        lastUpdatedDateTime: new Date().toISOString(),
      };
      
      const response = await fetch(`${API_BASE_URL}/deal-collaterals`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Success response:", result);
      
      setSuccess(true);
      setForm(initialState);
      setCollateralFile(null);
      if (collateralFileInputRef.current) collateralFileInputRef.current.value = "";
      
    } catch (err: any) {
      console.error("Error saving collateral:", err);
      setError(err.message || "Failed to save DealCollateral.");
    } finally {
      setLoading(false);
    }
  };

  // Document save handler
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocLoading(true);
    setDocError(null);
    setDocSuccess(false);
    
    try {
      if (!documentFile) throw new Error("No file selected");
      if (documentFile.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
      
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png"];
      if (!allowedTypes.includes(documentFile.type)) {
        throw new Error("Invalid file type. Only PDF, DOCX, PNG allowed.");
      }
      
      // Get SAS token and upload file
      const blobName = `${dealId},${nextDocumentId}_${documentFile.name}`;
      const sasToken = await getSasToken(blobName);
      const blobUrl = await uploadFileToAzure(documentFile, blobName, sasToken);
      
      // Save metadata to backend
      const payload = {
        id: { dealID: dealId, documentID: nextDocumentId },
        documentCategory,
        documentType,
        documentName: documentFile.name,
        description: documentDescription,
        storageFilePath: blobUrl,
        createdBy: "system",
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "system",
        lastUpdatedDateTime: new Date().toISOString(),
      };
      
      const res = await fetch(`${API_BASE_URL}/deal-documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save document metadata: ${errorText}`);
      }
      
      const result = await res.json();
      console.log("Document saved successfully:", result);
      
      setDocSuccess(true);
      setDocumentCategory("");
      setDocumentType("");
      setDocumentDescription("");
      setDocumentFile(null);
      if (documentFileInputRef.current) documentFileInputRef.current.value = "";
      
    } catch (err: any) {
      console.error("Error saving document:", err);
      setDocError(err.message || "Failed to save document.");
    } finally {
      setDocLoading(false);
    }
  };

  // Unified view handler for collateral documents
  const handleViewCollateral = async (storagePath: string) => {
    try {
      const parts = storagePath.split("/");
      const blobName = parts[parts.length - 1].split("?")[0];
      const url = await getViewUrl(blobName);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Error viewing collateral document:", err);
    }
  };

  // View handler for deal documents
  const handleViewDocument = async (doc: any) => {
    try {
      const blobName = `${doc.id.dealID},${doc.id.documentID}_${doc.documentName}`;
      const url = await getViewUrl(blobName);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error viewing document:", error);
    }
  };

  return (
    <div>
      {/* Added Collaterals Section */}
      {addedCollaterals.length > 0 && (
        <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
          <div className="font-semibold text-violet-800 mb-2">Added Collaterals:</div>
          <ul className="space-y-2">
            {addedCollaterals.map((collateral, idx) => (
              <li key={collateral.id?.dealID + '-' + collateral.id?.collateralID || idx} className="flex gap-6 items-center">
                <span className="text-sm font-medium text-violet-900">Type: <span className="font-normal text-slate-800">{collateral.collateralType}</span></span>
                <span className="text-sm font-medium text-violet-900">Value: <span className="font-normal text-slate-800">{collateral.collateralValue}</span></span>
                <span className="text-sm font-medium text-violet-900">Currency: <span className="font-normal text-slate-800">{collateral.currency}</span></span>
                {collateral.description && (
                  <span className="text-sm font-medium text-violet-900">Description: <span className="font-normal text-slate-800">{collateral.description}</span></span>
                )}
                {collateral.storagePath && (
                  <span className="text-sm font-medium text-violet-900">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => handleViewCollateral(collateral.storagePath)}
                      type="button"
                    >
                      View
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Added Documents Section */}
      {addedDocuments.length > 0 && (
        <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
          <div className="font-semibold text-violet-800 mb-2">Added Documents:</div>
          <ul className="space-y-2">
            {addedDocuments.map((doc, idx) => (
              <li key={doc.id?.dealID + '-' + doc.id?.documentID || idx} className="flex gap-6 items-center">
                <span className="text-sm font-medium text-violet-900">Category: <span className="font-normal text-slate-800">{doc.documentCategory}</span></span>
                <span className="text-sm font-medium text-violet-900">Type: <span className="font-normal text-slate-800">{doc.documentType}</span></span>
                <span className="text-sm font-medium text-violet-900">Name: <span className="font-normal text-slate-800">{doc.documentName}</span></span>
                {doc.description && (
                  <span className="text-sm font-medium text-violet-900">Description: <span className="font-normal text-slate-800">{doc.description}</span></span>
                )}
                <span className="text-sm font-medium text-violet-900">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleViewDocument(doc)}
                    type="button"
                  >
                    View
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Collateral and Documentation Forms */}
      {showForms !== false && (
        <>
          {/* Collateral Section */}
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-8">
            <div className="font-semibold text-violet-800 mb-2">Collateral</div>
            <SelectInput
              id="collateralType"
              label="Collateral Type"
              value={form.collateralType}
              onChange={val => setForm(prev => ({ ...prev, collateralType: val }))}
              options={collateralTypeOptions}
              required
              disabled={collateralTypeLoading}
              placeholder={collateralTypeLoading ? "Loading..." : "Select Collateral Type"}
            />
            <SelectInput
              id="currency"
              label="Currency"
              value={form.currency}
              onChange={val => setForm(prev => ({ ...prev, currency: val }))}
              options={currencyOptions}
              required
              disabled={currencyLoading}
              placeholder={currencyLoading ? "Loading..." : "Select Currency"}
            />
            <TextInput
              id="collateralValue"
              label="Collateral Value"
              value={form.collateralValue}
              onChange={val => setForm(prev => ({ ...prev, collateralValue: val }))}
              required
              placeholder="Enter collateral value"
              type="number"
            />
            <TextInput
              id="description"
              label="Description"
              value={form.description}
              onChange={val => setForm(prev => ({ ...prev, description: val }))}
              required
              placeholder="Enter description"
            />
            <input
              type="file"
              ref={collateralFileInputRef}
              onChange={e => setCollateralFile(e.target.files?.[0] || null)}
              className="block mt-2 mb-2"
            />
            <div className="flex gap-4 justify-end">
              <SecondaryButton type="submit" isLoading={loading} size="md">
                Add
              </SecondaryButton>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>

          {/* Documentation Section */}
          <form onSubmit={handleSaveDocument} className="space-y-4 p-4 border rounded">
            <div className="font-semibold text-violet-800 mb-2">Documentation</div>
            <SelectInput
              id="documentCategory"
              label="Document Category"
              value={documentCategory}
              onChange={setDocumentCategory}
              options={documentCategoryOptions}
              required
              placeholder="Select Document Category"
            />
            <SelectInput
              id="documentType"
              label="Document Type"
              value={documentType}
              onChange={setDocumentType}
              options={documentTypeOptions}
              required
              placeholder="Select Document Type"
            />
            <TextInput
              id="documentDescription"
              label="Description"
              value={documentDescription}
              onChange={setDocumentDescription}
              placeholder="Enter document description"
            />
            <input
              type="file"
              accept=".pdf,.docx,.png"
              ref={documentFileInputRef}
              onChange={e => setDocumentFile(e.target.files?.[0] || null)}
              required
              className="block mt-2 mb-2"
            />
            {documentFile && (
              <div className="text-sm text-slate-700 mb-2">
                {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <SecondaryButton
                type="submit"
                isLoading={docLoading}
                size="md"
                className="mt-4"
              >
                Save Document
              </SecondaryButton>
            </div>
            {docError && <div className="text-red-600 mt-2">{docError}</div>}
            {docSuccess && <div className="text-green-600 mt-2">Document saved successfully!</div>}
          </form>
        </>
      )}
    </div>
  );
};

export default DealCollateralForm;