import React, { useEffect, useState } from "react";
import { productSelectionService, Entity } from "../../services/productSelectionService";
import SecondaryButton from "../../template components/components/elements/SecondaryButton";
import PrimaryButton from "../../template components/components/elements/PrimaryButton";
import SelectInput from "../../template components/components/elements/SelectInput";
import { addDealProduct, addDealSubProduct } from "../../services/dealProductApi";
import { saveDealCommitment, DealCommitment } from '../../services/dealCommitmentService';
import { translateFieldService } from '../../services/translateFieldService';
import TextInput from '../../template components/components/form/TextInput';
import { saveDealFinancialStatus, getDealFinancialStatusesByDealId, DealFinancialStatus } from '../../services/dealFinancialStatusService';
import { BlobServiceClient } from "@azure/storage-blob";

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

interface ProductSelectionDropdownsProps {
  dealId: string;
  customerId: string;
  onNext: () => void;
  onBack: () => void;
  addedCombinations: {
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
    domainType?: string;
    businessDomainLabel?: string;
  }[];
  setAddedCombinations: React.Dispatch<React.SetStateAction<{
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
    domainType?: string;
    businessDomainLabel?: string;
  }[]>>;
  financialStatuses: DealFinancialStatus[];
  setFinancialStatuses: React.Dispatch<React.SetStateAction<DealFinancialStatus[]>>;
  commitments: DealCommitment[];
  setCommitments: React.Dispatch<React.SetStateAction<DealCommitment[]>>;
}

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';
const AZURE_CONTAINER_URL = "https://dealdeskdocumentstorage.blob.core.windows.net/dealdeskdocumentscontainer";

async function uploadFileToAzure(file: File, dealId: string, year: string, sasToken: string) {
  const blobName = `${dealId},${year}_${file.name}`;
  const blobServiceClient = new BlobServiceClient(`${AZURE_CONTAINER_URL}?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient("");
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadBrowserData(file, {
    blobHTTPHeaders: { blobContentType: file.type }
  });
  return `${AZURE_CONTAINER_URL}/${blobName}`;
}

interface ProductSubproductSectionProps {
  combo: {
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
    domainType?: string;
    businessDomainLabel?: string;
  };
  dealId: string;
  nextCommitmentNumber: number;
  onCommitmentSave: (comboKey: string, commitment: DealCommitment) => void;
  commitments: DealCommitment[];
}

const ProductSubproductSection: React.FC<ProductSubproductSectionProps> = ({ combo, dealId, nextCommitmentNumber, onCommitmentSave, commitments }) => {
  const comboKey = combo.productId + '-' + combo.subProductId;
  return (
    <div className="border border-violet-200 rounded-lg bg-violet-50 p-4">
      <div className="font-semibold text-violet-800 mb-2">
        {combo.domainType || "Domain"} | - | {combo.productLabel} | - | {combo.subProductLabel}
      </div>
      {/* List of added DealCommitments for this combo */}
      {combo.domainType === 'Trade Finance' && commitments.length > 0 && (
        <div className="mb-4">
          <div className="font-semibold text-violet-700 mb-1">Added Commitments:</div>
          <ul className="space-y-1">
            {commitments.map((c, i) => (
              <li key={c.commitmentNumber} className="flex gap-6 items-center text-sm text-slate-800">
                <span>Commitment #{c.commitmentNumber}:</span>
                <span>Currency: <span className="font-medium">{c.currency}</span></span>
                <span>Amount: <span className="font-medium">{c.commitmentAmount}</span></span>
                <span>Tenure: <span className="font-medium">{c.tenure}</span></span>
                {c.description && (
                  <span>Description: <span className="font-medium">{c.description}</span></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* DealCommitment form for Trade Finance */}
      {combo.domainType === 'Trade Finance' && (
        <DealCommitmentForm
          dealId={dealId}
          productId={combo.productId}
          subProductId={combo.subProductId}
          commitmentNumber={nextCommitmentNumber}
          onSave={commitment => onCommitmentSave(comboKey, commitment)}
        />
      )}
      {/* Placeholder for additional form fields for this section */}
      <div className="text-slate-700 text-sm italic">(Additional form fields go here for this DomainType/Product/SubProduct)</div>
    </div>
  );
};

export const ProductSelectionDropdowns: React.FC<ProductSelectionDropdownsProps> = ({ dealId, customerId, onNext, onBack, addedCombinations, setAddedCombinations, financialStatuses, setFinancialStatuses, commitments, setCommitments }) => {
  const [businessDomains, setBusinessDomains] = useState<Entity[]>([]);
  const [productCategories, setProductCategories] = useState<Entity[]>([]);
  const [productSubCategories, setProductSubCategories] = useState<Entity[]>([]);
  const [products, setProducts] = useState<Entity[]>([]);
  const [subProducts, setSubProducts] = useState<Entity[]>([]);

  // All selected* state variables are UUID strings
  const [selectedBusinessDomain, setSelectedBusinessDomain] = useState<string>("");
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("");
  const [selectedProductSubCategory, setSelectedProductSubCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedSubProduct, setSelectedSubProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [nextCommitmentNumber, setNextCommitmentNumber] = useState(1);
  // Store commitments for each combo: { [comboKey]: DealCommitment[] }
  const [commitmentsByCombo, setCommitmentsByCombo] = useState<Record<string, DealCommitment[]>>({});

  // Update local commitmentsByCombo when commitments prop changes
  useEffect(() => {
    const newCommitmentsByCombo = commitments.reduce((acc, commitment) => {
      const key = `${commitment.productID}-${commitment.subProductID}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(commitment);
      return acc;
    }, {} as Record<string, DealCommitment[]>);
    setCommitmentsByCombo(newCommitmentsByCombo);
  }, [commitments]);

  // Load financial statuses on mount
  React.useEffect(() => {
    getDealFinancialStatusesByDealId(dealId, customerId)
      .then(setFinancialStatuses)
      .catch(() => setFinancialStatuses([]));
  }, [dealId, customerId, setFinancialStatuses]);

  // Fetch business domains on mount
  useEffect(() => {
    productSelectionService.getBusinessDomains().then(setBusinessDomains);
  }, []);

  // Fetch product categories when business domain changes
  useEffect(() => {
    if (isValidUUID(selectedBusinessDomain)) {
      productSelectionService.getProductCategories(selectedBusinessDomain).then(setProductCategories);
      setProductSubCategories([]);
      setProducts([]);
      setSubProducts([]);
      setSelectedProductCategory("");
      setSelectedProductSubCategory("");
      setSelectedProduct("");
      setSelectedSubProduct("");
    }
  }, [selectedBusinessDomain]);

  // Fetch product subcategories when product category changes
  useEffect(() => {
    if (isValidUUID(selectedProductCategory)) {
      productSelectionService.getProductSubCategories(selectedProductCategory).then(setProductSubCategories);
      setProducts([]);
      setSubProducts([]);
      setSelectedProductSubCategory("");
      setSelectedProduct("");
      setSelectedSubProduct("");
    }
  }, [selectedProductCategory]);

  // Fetch products when product subcategory changes
  useEffect(() => {
    if (isValidUUID(selectedProductSubCategory)) {
      productSelectionService.getProducts(selectedProductSubCategory).then(setProducts);
      setSubProducts([]);
      setSelectedProduct("");
      setSelectedSubProduct("");
    }
  }, [selectedProductSubCategory]);

  // Fetch subproducts when product changes
  useEffect(() => {
    if (isValidUUID(selectedProduct)) {
      productSelectionService.getSubProducts(selectedProduct).then(setSubProducts);
      setSelectedSubProduct("");
    }
  }, [selectedProduct]);

  const handleAdd = async () => {
    if (!isValidUUID(dealId) || !isValidUUID(selectedProduct) || !isValidUUID(selectedSubProduct)) return;
    setAddError(null);
    // Prevent duplicate
    if (addedCombinations.some(
      c => c.productId === selectedProduct && c.subProductId === selectedSubProduct
    )) {
      setAddError("This product-subproduct combination has already been added.");
      return;
    }
    setLoading(true);
    try {
      // Save to DealProduct
      await addDealProduct({
        dealId,
        productId: selectedProduct,
        accountNumber: "", // Fill as needed
        createdBy: "", // Fill as needed
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "",
        lastUpdatedDateTime: new Date().toISOString(),
      });
      // Save to DealSubProduct
      await addDealSubProduct({
        dealId,
        productId: selectedProduct,
        subProductId: selectedSubProduct,
        createdBy: "",
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "",
        lastUpdatedDateTime: new Date().toISOString(),
      });
      setAdded(true);
      // Add to local list
      const productLabel = products.find(p => (String(p.id ?? p.productId ?? "")) === selectedProduct)?.description || selectedProduct;
      const subProductLabel = subProducts.find(sp => (String(sp.id ?? sp.subProductId ?? "")) === selectedSubProduct)?.description || selectedSubProduct;
      const businessDomain = businessDomains.find(bd => String(bd.id ?? bd.businessDomainId ?? "") === selectedBusinessDomain);
      setAddedCombinations(prev => [
        ...prev,
        {
          productId: selectedProduct,
          subProductId: selectedSubProduct,
          productLabel,
          subProductLabel,
          domainType: businessDomain?.domainType || "",
          businessDomainLabel: businessDomain?.description || "",
        },
      ]);
      // Flush dropdowns
      setSelectedBusinessDomain("");
      setSelectedProductCategory("");
      setSelectedProductSubCategory("");
      setSelectedProduct("");
      setSelectedSubProduct("");
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Added combinations list (legacy) */}
      {false && addedCombinations.length > 0 && (
        <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
          <div className="font-semibold text-violet-800 mb-2">Added Product-SubProduct Combinations:</div>
          <ul className="space-y-2">
            {addedCombinations.map((combo, idx) => (
              <li key={combo.productId + '-' + combo.subProductId} className="flex gap-6 items-center">
                <span className="text-sm font-medium text-violet-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                <span className="text-sm font-medium text-violet-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Financial Status section for the company as a whole */}
      <div className="mb-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
        <div className="font-semibold text-violet-700 mb-2">Deal Financial Status</div>
        {financialStatuses.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold text-violet-700 mb-1">Added Financial Statuses:</div>
            <ul className="space-y-1">
              {financialStatuses.map((fs, i) => (
                <li key={fs.year + '-' + i} className="flex gap-6 items-center text-sm text-slate-800">
                  <span>Year: <span className="font-medium">{fs.year}</span></span>
                  <span>Description: <span className="font-medium">{fs.description}</span></span>
                  {fs.storagePath && (
                    <button type="button" className="text-violet-700 underline" onClick={() => window.open(fs.storagePath, '_blank')}>View Attachment</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <DealFinancialStatusForm
          dealId={dealId}
          customerId={customerId}
          onSave={fs => setFinancialStatuses(prev => [...prev, fs])}
        />
      </div>
      {/* New: DomainType containers for each added combination */}
      {addedCombinations.length > 0 && (
        <div className="mb-6 flex flex-col gap-4">
          {addedCombinations.map((combo, idx) => (
            <ProductSubproductSection
              key={combo.productId + '-' + combo.subProductId}
              combo={combo}
              dealId={dealId}
              nextCommitmentNumber={nextCommitmentNumber}
              onCommitmentSave={(comboKey, commitment) => {
                setNextCommitmentNumber(n => n + 1);
                setCommitments(prev => [...prev, commitment]);
              }}
              commitments={commitmentsByCombo[combo.productId + '-' + combo.subProductId] || []}
            />
          ))}
        </div>
      )}
      {/* Business Domain Dropdown (UUID) */}
      <SelectInput
        id="business-domain"
        label="Business Domain"
        value={selectedBusinessDomain}
        onChange={setSelectedBusinessDomain}
        options={businessDomains.map(bd => ({ value: String(bd.id ?? bd.businessDomainId ?? ''), label: bd.description }))}
        placeholder="Select Business Domain"
      />

      {/* Product Category Dropdown (UUID) */}
      <SelectInput
        id="product-category"
        label="Product Category"
        value={selectedProductCategory}
        onChange={setSelectedProductCategory}
        options={productCategories.map(pc => ({ value: String(pc.id ?? pc.productCategoryId ?? ''), label: pc.description }))}
        placeholder="Select Product Category"
        disabled={!isValidUUID(selectedBusinessDomain)}
      />

      {/* Product SubCategory Dropdown (UUID) */}
      <SelectInput
        id="product-subcategory"
        label="Product SubCategory"
        value={selectedProductSubCategory}
        onChange={setSelectedProductSubCategory}
        options={productSubCategories.map(psc => ({ value: String(psc.id ?? psc.productSubCategoryId ?? ''), label: psc.description }))}
        placeholder="Select Product SubCategory"
        disabled={!isValidUUID(selectedProductCategory)}
      />

      {/* Product Dropdown (UUID) */}
      <SelectInput
        id="product"
        label="Product"
        value={selectedProduct}
        onChange={setSelectedProduct}
        options={products.map(p => ({ value: String(p.id ?? p.productId ?? ''), label: p.description }))}
        placeholder="Select Product"
        disabled={!isValidUUID(selectedProductSubCategory)}
      />

      {/* SubProduct Dropdown (UUID) */}
      <SelectInput
        id="subproduct"
        label="SubProduct"
        value={selectedSubProduct}
        onChange={setSelectedSubProduct}
        options={subProducts.map(sp => ({ value: String(sp.id ?? sp.subProductId ?? ''), label: sp.description }))}
        placeholder="Select SubProduct"
        disabled={!isValidUUID(selectedProduct)}
      />

      {/* Add Button for product-subproduct combination */}
      <div className="flex gap-4 justify-end">
        <SecondaryButton
          onClick={handleAdd}
          disabled={!isValidUUID(selectedSubProduct) || loading}
        >
          {loading ? "Adding..." : "Add"}
        </SecondaryButton>
      </div>
      {/* Navigation Buttons */}
      <div className="mt-4 flex gap-4 justify-end">
        <SecondaryButton onClick={onBack}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={onNext} disabled={addedCombinations.length === 0}>
          Next
        </PrimaryButton>
      </div>
      {addError && <div className="text-red-600 text-sm mt-1">{addError}</div>}
    </div>
  );
};

const DealCommitmentForm: React.FC<{ dealId: string; productId: string; subProductId: string; commitmentNumber: number; onSave: (commitment: DealCommitment) => void }> = ({ dealId, productId, subProductId, commitmentNumber, onSave }) => {
  const [currency, setCurrency] = useState('');
  const [commitmentAmount, setCommitmentAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [description, setDescription] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    translateFieldService.getDropdownValues('Currency')
      .then(values => setCurrencyOptions(values.map(v => ({ value: v, label: v }))))
      .catch(() => setCurrencyOptions([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const commitment: DealCommitment = {
      dealID: dealId,
      commitmentNumber,
      currency,
      commitmentAmount: Number(commitmentAmount),
      tenure: Number(tenure),
      productID: productId,
      subProductID: subProductId,
      description,
      createdBy: '',
      createdDateTime: new Date().toISOString(),
      lastUpdatedBy: '',
      lastUpdatedDateTime: new Date().toISOString(),
    };

    try {
      await saveDealCommitment(commitment);
      setSuccess(true);
      setCurrency('');
      setCommitmentAmount('');
      setTenure('');
      setDescription('');
      onSave(commitment);
    } catch (err: any) {
      setError('Failed to save Deal Commitment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-4 bg-white">
      <div className="font-semibold text-violet-700 mb-2">Deal Commitment</div>
      <SelectInput
        id="currency"
        label="Currency"
        value={currency}
        onChange={setCurrency}
        options={currencyOptions}
        required
        placeholder="Select Currency"
      />
      <TextInput
        id="commitmentAmount"
        label="Commitment Amount"
        value={commitmentAmount}
        onChange={setCommitmentAmount}
        required
        placeholder="Enter commitment amount"
        type="number"
      />
      <TextInput
        id="tenure"
        label="Tenure"
        value={tenure}
        onChange={setTenure}
        required
        placeholder="Enter tenure"
        type="number"
      />
      <TextInput
        id="description"
        label="Description"
        value={description}
        onChange={setDescription}
        required
        placeholder="Enter description"
      />
      <div className="flex gap-4 justify-end">
        <SecondaryButton type="submit" isLoading={loading} size="md">
          Add
        </SecondaryButton>
      </div>
      {success && <div className="text-green-600">Deal Commitment added successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

const DealFinancialStatusForm: React.FC<{ dealId: string; customerId: string; onSave: (fs: DealFinancialStatus) => void }> = ({ dealId, customerId, onSave }) => {
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string> {
    // 1. Get SAS token from backend
    const blobName = `${dealId},${year}_${file.name}`;
    const sasRes = await fetch(`${API_BASE_URL}/azure-sas?blobName=${encodeURIComponent(blobName)}`);
    if (!sasRes.ok) throw new Error("Failed to get SAS token");
    const sasToken = await sasRes.text();
    // 2. Upload to Azure
    return await uploadFileToAzure(file, dealId, year, sasToken);
  }

  React.useEffect(() => {
    console.log('DealFinancialStatusForm received customerId:', customerId);
  }, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      let storagePath = '';
      if (file) {
        storagePath = await uploadFile(file);
      }
      const fs: DealFinancialStatus = {
        dealID: dealId,
        customerID: customerId,
        year,
        description,
        storagePath,
        createdBy: '',
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: '',
        lastUpdatedDateTime: new Date().toISOString(),
      };
      console.log('Saving DealFinancialStatus:', fs);
      await saveDealFinancialStatus(fs);
      setSuccess(true);
      setYear('');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSave(fs);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Failed to save Deal Financial Status.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-4 bg-white">
      <div className="font-semibold text-violet-700 mb-2">Deal Financial Status</div>
      <TextInput
        id="year"
        label="Year"
        value={year}
        onChange={setYear}
        required
        placeholder="Enter year"
      />
      <div className="text-xs text-slate-500 mb-2">Example: 2024-25</div>
      <TextInput
        id="description"
        label="Description"
        value={description}
        onChange={setDescription}
        required
        placeholder="Enter description"
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block mt-1"
        />
      </div>
      <div className="flex gap-4 justify-end">
        <SecondaryButton type="submit" isLoading={uploading} size="md">
          Add
        </SecondaryButton>
      </div>
      {success && <div className="text-green-600">Deal Financial Status added successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}; 