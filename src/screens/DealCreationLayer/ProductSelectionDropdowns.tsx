import React, { useEffect, useState } from "react";
import { productSelectionService, Entity } from "../../services/productSelectionService";
import SecondaryButton from "../../template components/components/elements/SecondaryButton";
import PrimaryButton from "../../template components/components/elements/PrimaryButton";
import SelectInput from "../../template components/components/elements/SelectInput";
import { addDealProduct, addDealSubProduct } from "../../services/dealProductApi";
import { saveDealCommitment, DealCommitment, deleteDealCommitment, getDealCommitmentsByDealId } from '../../services/dealCommitmentService';
import { translateFieldService } from '../../services/translateFieldService';
import TextInput from '../../template components/components/elements/TextInput';
import { BlobServiceClient } from "@azure/storage-blob";
import { Edit2Icon, Trash2Icon } from "lucide-react";

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
    businessDomainId?: string;
  }[];
  setAddedCombinations: React.Dispatch<React.SetStateAction<{
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
    domainType?: string;
    businessDomainLabel?: string;
    businessDomainId?: string;
  }[]>>;
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

async function getViewUrl(blobName: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/azure-sas/read-sas?blobName=${encodeURIComponent(blobName)}`);
    if (!res.ok) {
      throw new Error(`Failed to get SAS token: ${res.status} ${res.statusText}`);
    }
    const sasToken = await res.text();
    if (!sasToken) {
      throw new Error('Empty SAS token received');
    }
    return `${AZURE_CONTAINER_URL}/${blobName}?${sasToken}`;
  } catch (error) {
    console.error('Error getting SAS token:', error);
    throw error;
  }
}

interface ProductSubproductSectionProps {
  combo: {
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
    domainType?: string;
    businessDomainLabel?: string;
    businessDomainId?: string;
  };
  dealId: string;
  onCommitmentSave: (comboKey: string, commitment: DealCommitment | null) => void;
  commitments: DealCommitment[];
  allCommitments: DealCommitment[]; // Add this to get the highest commitment number
}

const ProductSubproductSection: React.FC<ProductSubproductSectionProps> = ({
  combo, dealId, onCommitmentSave, commitments, allCommitments
}) => {
  const comboKey = combo.productId + '-' + combo.subProductId;
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [editingCommitment, setEditingCommitment] = React.useState<DealCommitment | null>(null);

  // Calculate next commitment number dynamically
  const getNextCommitmentNumber = () => {
    if (allCommitments.length === 0) return 1;
    const maxNumber = Math.max(...allCommitments.map(c => c.commitmentNumber || 0));
    return maxNumber + 1;
  };

  const handleEditCommitment = (commitment: DealCommitment) => {
    setEditingCommitment(commitment);
  };

  const handleCancelEdit = () => {
    setEditingCommitment(null);
  };

  const handleDeleteCommitment = async (commitment: DealCommitment) => {
    if (!window.confirm(`Are you sure you want to delete commitment #${commitment.commitmentNumber}?`)) return;
    setDeletingId(commitment.commitmentNumber!);
    try {
      await deleteDealCommitment(commitment.dealID, commitment.commitmentNumber!);
      onCommitmentSave(comboKey, null); // Signal parent to refetch or update
    } catch (err) {
      alert("Failed to delete commitment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (commitment: DealCommitment, isEdit: boolean) => {
    await saveDealCommitment(commitment);
    setEditingCommitment(null); // Clear editing state after save
    onCommitmentSave(comboKey, commitment); // Signal parent to refetch or update
  };

  return (
    <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
      <div className="font-semibold text-brand-800 mb-2">
        {combo.domainType || "Domain"} | - | {combo.productLabel} | - | {combo.subProductLabel}
      </div>
      <DealCommitmentForm
        key={editingCommitment ? `edit-${editingCommitment.commitmentNumber}` : 'new'} // Force re-render
        dealId={dealId}
        productId={combo.productId}
        subProductId={combo.subProductId}
        commitmentNumber={editingCommitment ? editingCommitment.commitmentNumber! : getNextCommitmentNumber()}
        onSave={commitment => handleSave(commitment, !!editingCommitment)}
        initialData={editingCommitment || undefined}
        isEdit={!!editingCommitment}
        onCancelEdit={handleCancelEdit}
      />
      {commitments.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-brand-200">
          <div className="font-medium text-brand-700 mb-1">Deal Commitments:</div>
          <div className="space-y-1">
            {commitments.map((commitment, index) => (
              <div key={commitment.commitmentNumber} className="flex gap-4 items-center text-sm text-slate-800 bg-gray-50 p-2 rounded">
                <span>Commitment #{commitment.commitmentNumber}:</span>
                <span>Currency: <span className="font-medium">{commitment.currency}</span></span>
                <span>Amount: <span className="font-medium">{commitment.commitmentAmount}</span></span>
                <span>Tenure: <span className="font-medium">{commitment.tenure}</span></span>
                {commitment.description && (
                  <span>Description: <span className="font-medium">{commitment.description}</span></span>
                )}
                <Edit2Icon
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                  onClick={() => handleEditCommitment(commitment)}
                  title="Edit"
                />
                <Trash2Icon
                  className={`w-4 h-4 text-red-500 cursor-pointer ${deletingId === commitment.commitmentNumber ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => handleDeleteCommitment(commitment)}
                  title="Delete"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductSelectionDropdowns: React.FC<ProductSelectionDropdownsProps> = ({
  dealId, customerId, onNext, onBack, addedCombinations, setAddedCombinations, commitments, setCommitments
}) => {
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
          businessDomainId: String(businessDomain?.id ?? businessDomain?.businessDomainId ?? selectedBusinessDomain),
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

  // Handler to refetch commitments after add/edit/delete
  const handleCommitmentChange = async () => {
    const updatedCommitments = await getDealCommitmentsByDealId(dealId);
    setCommitments(updatedCommitments);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Added combinations list (legacy) */}
      {false && addedCombinations.length > 0 && (
        <div className="mb-6 border border-brand-200 rounded-lg bg-brand-50 p-4">
          <div className="font-semibold text-brand-800 mb-2">Added Product-SubProduct Combinations:</div>
          <ul className="space-y-2">
            {addedCombinations.map((combo, idx) => (
              <li key={combo.productId + '-' + combo.subProductId} className="flex gap-6 items-center">
                <span className="text-sm font-medium text-brand-900">Product: <span className="font-normal text-slate-800">{combo.productLabel}</span></span>
                <span className="text-sm font-medium text-brand-900">SubProduct: <span className="font-normal text-slate-800">{combo.subProductLabel}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* New: DomainType containers for each added combination */}
      {addedCombinations.length > 0 && (
        <div className="mb-6 flex flex-col gap-4">
          {addedCombinations.map((combo, idx) => (
            <ProductSubproductSection
              key={combo.productId + '-' + combo.subProductId}
              combo={combo}
              dealId={dealId}
              onCommitmentSave={() => handleCommitmentChange()}
              commitments={commitmentsByCombo[combo.productId + '-' + combo.subProductId] || []}
              allCommitments={commitments} // Pass all commitments to calculate next number
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

const DealCommitmentForm: React.FC<{
  dealId: string;
  productId: string;
  subProductId: string;
  commitmentNumber: number;
  onSave: (commitment: DealCommitment) => void;
  initialData?: DealCommitment;
  isEdit?: boolean;
  onCancelEdit?: () => void;
}> = ({
  dealId,
  productId,
  subProductId,
  commitmentNumber,
  onSave,
  initialData,
  isEdit,
  onCancelEdit
}) => {
  const [currency, setCurrency] = useState('');
  const [commitmentAmount, setCommitmentAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [description, setDescription] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when initialData changes (including when it becomes undefined)
  useEffect(() => {
    if (initialData) {
      // Populate form with existing data for editing
      setCurrency(initialData.currency || '');
      setCommitmentAmount(initialData.commitmentAmount?.toString() || '');
      setTenure(initialData.tenure?.toString() || '');
      setDescription(initialData.description || '');
    } else {
      // Clear form for adding new commitment
      setCurrency('');
      setCommitmentAmount('');
      setTenure('');
      setDescription('');
    }
    // Reset states when switching between edit/add modes
    setSuccess(false);
    setError(null);
  }, [initialData, commitmentNumber]); // Added commitmentNumber as dependency

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
      commitmentNumber, // This will be the correct number (either new or existing for edit)
      currency,
      commitmentAmount: Number(commitmentAmount),
      tenure: Number(tenure),
      productID: productId,
      subProductID: subProductId,
      description,
      createdBy: initialData?.createdBy || '',
      createdDateTime: initialData?.createdDateTime || new Date().toISOString(),
      lastUpdatedBy: '', // You can set this as needed
      lastUpdatedDateTime: new Date().toISOString(),
    };

    try {
      await saveDealCommitment(commitment);
      setSuccess(true);
      
      // Only clear form if it's a new commitment (not editing)
      if (!isEdit) {
        setCurrency('');
        setCommitmentAmount('');
        setTenure('');
        setDescription('');
      }
      
      onSave(commitment);
    } catch (err: any) {
      setError('Failed to save Deal Commitment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-4 bg-white">
      <div className="font-semibold text-brand-700 mb-2">
        {isEdit ? `Edit Deal Commitment #${commitmentNumber}` : `Deal Commitment #${commitmentNumber}`}
      </div>
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
        {isEdit && onCancelEdit && (
          <SecondaryButton type="button" onClick={onCancelEdit}>
            Cancel
          </SecondaryButton>
        )}
        <SecondaryButton 
          type="submit" 
          isLoading={loading} 
          size="md"
          disabled={
            !currency || !commitmentAmount || !tenure || !description || loading
          }
        >
          {isEdit ? "Update" : "Add"}
        </SecondaryButton>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{isEdit ? "Commitment updated successfully!" : "Commitment added successfully!"}</div>}
    </form>
  );
};