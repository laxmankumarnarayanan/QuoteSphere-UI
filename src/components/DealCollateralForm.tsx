import React, { useState, useEffect } from "react";
import { saveDealCollateral, DealCollateral } from "../services/dealCollateralService";
import SelectInput from "../template components/components/form/SelectInput";
import { dealService } from "../services/dealService";
import TextInput from "../template components/components/form/TextInput";
import SecondaryButton from "../template components/components/elements/SecondaryButton";
import { BlobServiceClient } from "@azure/storage-blob";

interface DealCollateralFormProps {
  dealId: string;
}

const initialState = {
  collateralType: "",
  collateralValue: "",
  currency: "",
};

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api'; // Replace with your actual Azure backend URL if different

// Example values (replace with your actual values or get from backend)
const AZURE_CONTAINER_URL = "https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer";
//const SAS_TOKEN = "<YOUR_SAS_TOKEN>"; // Get this from your backend for each upload

async function uploadFileToAzure(file: File, dealId: string, documentId: number, sasToken: string) {
  const blobName = `${dealId},${documentId}_${file.name}`;
  const blobServiceClient = new BlobServiceClient(`${AZURE_CONTAINER_URL}?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient("");
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadBrowserData(file, {
    blobHTTPHeaders: { blobContentType: file.type }
  });
  return `${AZURE_CONTAINER_URL}/${blobName}`;
}

const DealCollateralForm: React.FC<DealCollateralFormProps> = ({ dealId }) => {
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
  const [documentCategoryOptions, setDocumentCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [documentTypeOptions, setDocumentTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docSuccess, setDocSuccess] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [nextDocumentId, setNextDocumentId] = useState<number>(1);
  const [addedDocuments, setAddedDocuments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setCollateralTypeLoading(true);
    dealService.getDropdownValues("DealCollateral", "CollateralType")
      .then(values => setCollateralTypeOptions(values.map(v => ({ value: v, label: v }))))
      .finally(() => setCollateralTypeLoading(false));

    setCurrencyLoading(true);
    dealService.getDropdownValues("DealCollateral", "Currency")
      .then(values => setCurrencyOptions(values.map(v => ({ value: v, label: v }))))
      .finally(() => setCurrencyLoading(false));

    dealService.getDropdownValues("DealDocuments", "DocumentCategory")
      .then(values => setDocumentCategoryOptions(values.map(v => ({ value: v, label: v }))));
    dealService.getDropdownValues("DealDocuments", "DocumentType")
      .then(values => setDocumentTypeOptions(values.map(v => ({ value: v, label: v }))));
  }, []);

  // Fetch current collaterals for this deal to determine next CollateralID
  useEffect(() => {
    async function fetchCurrentCollaterals() {
      try {
        const res = await fetch(`${API_BASE_URL}/deal-collaterals/deal/${dealId}`);
        const data = await res.json();
        setAddedCollaterals(data);
        const maxId = data.reduce((max: number, c: any) => {
          const idVal = c.id?.collateralID || 0;
          return idVal > max ? idVal : max;
        }, 0);
        setNextCollateralId(maxId + 1);
      } catch {
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
        const data = await res.json();
        setAddedDocuments(data);
        const maxId = data.reduce((max: number, d: any) => {
          const idVal = d.id?.documentID || 0;
          return idVal > max ? idVal : max;
        }, 0);
        setNextDocumentId(maxId + 1);
      } catch {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        id: {
          dealID: dealId,
          collateralID: nextCollateralId,
        },
        collateralType: form.collateralType,
        collateralValue: Number(form.collateralValue),
        currency: form.currency,
        createdBy: "",
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "",
        lastUpdatedDateTime: new Date().toISOString(),
      };
      console.log("Saving DealCollateral payload:", payload);
      await saveDealCollateral(payload);
      setSuccess(true);
      setForm(initialState);
      // Explicitly reset each field
      setForm({ collateralType: "", currency: "", collateralValue: "0" });
    } catch (err: any) {
      setError("Failed to save DealCollateral.");
    } finally {
      setLoading(false);
    }
  };

  // --- Document save handler ---
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocLoading(true);
    setDocError(null);
    setDocSuccess(false);
    try {
      if (!selectedFile) throw new Error("No file selected");
      if (selectedFile.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        throw new Error("Invalid file type. Only PDF, DOCX, PNG allowed.");
      }
      // 1. Get SAS token from backend
      const blobName = `${dealId},${nextDocumentId}_${selectedFile.name}`;
      const sasRes = await fetch(`${API_BASE_URL}/azure-sas?blobName=${encodeURIComponent(blobName)}`);
      if (!sasRes.ok) throw new Error("Failed to get SAS token");
      const sasToken = await sasRes.text();
      // 2. Upload to Azure
      const blobUrl = await uploadFileToAzure(selectedFile, dealId, nextDocumentId, sasToken);
      // 3. Save metadata to backend
      const payload = {
        id: { dealID: dealId, documentID: nextDocumentId },
        documentCategory,
        documentType,
        documentName: selectedFile.name,
        storageFilePath: blobUrl,
        createdBy: "",
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "",
        lastUpdatedDateTime: new Date().toISOString(),
      };
      const res = await fetch(`${API_BASE_URL}/deal-documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save document metadata");
      setDocSuccess(true);
      setDocumentCategory("");
      setDocumentType("");
      setSelectedFile(null);
    } catch (err: any) {
      setDocError(err.message || "Failed to save document.");
    } finally {
      setDocLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div>
      {addedCollaterals.length > 0 && (
        <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
          <div className="font-semibold text-violet-800 mb-2">Added Collaterals:</div>
          <ul className="space-y-2">
            {addedCollaterals.map((collateral, idx) => (
              <li key={collateral.id.dealID + '-' + collateral.id.collateralID} className="flex gap-6 items-center">
                <span className="text-sm font-medium text-violet-900">Type: <span className="font-normal text-slate-800">{collateral.collateralType}</span></span>
                <span className="text-sm font-medium text-violet-900">Value: <span className="font-normal text-slate-800">{collateral.collateralValue}</span></span>
                <span className="text-sm font-medium text-violet-900">Currency: <span className="font-normal text-slate-800">{collateral.currency}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
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
        <div className="mt-6 mb-2 border-t pt-4">
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
          <input
            type="file"
            accept=".pdf,.docx,.png"
            onChange={handleFileChange}
            required
            className="block mt-2 mb-2"
          />
          {selectedFile && (
            <div className="text-sm text-slate-700 mb-2">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
          <SecondaryButton
            type="button"
            isLoading={docLoading}
            size="md"
            className="mt-4"
            onClick={handleSaveDocument}
          >
            Save Document
          </SecondaryButton>
          {docError && <div className="text-red-600">{docError}</div>}
          {docSuccess && <div className="text-green-600">Document saved successfully!</div>}
        </div>
        <SecondaryButton type="submit" isLoading={loading} size="md">
          Add
        </SecondaryButton>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">Saved successfully!</div>}
      </form>
    </div>
  );
};

export default DealCollateralForm; 