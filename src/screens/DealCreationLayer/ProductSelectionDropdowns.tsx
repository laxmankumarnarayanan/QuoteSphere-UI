import React, { useEffect, useState } from "react";
import { productSelectionService, Entity } from "../../services/productSelectionService";
import SecondaryButton from "../../template components/components/elements/SecondaryButton";
import PrimaryButton from "../../template components/components/elements/PrimaryButton";
import SelectInput from "../../template components/components/elements/SelectInput";
import { addDealProduct, addDealSubProduct } from "../../services/dealProductApi";

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

interface ProductSelectionDropdownsProps {
  dealId: string;
  onNext: () => void;
  addedCombinations: {
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
  }[];
  setAddedCombinations: React.Dispatch<React.SetStateAction<{
    productId: string;
    subProductId: string;
    productLabel: string;
    subProductLabel: string;
  }[]>>;
}

export const ProductSelectionDropdowns: React.FC<ProductSelectionDropdownsProps> = ({ dealId, onNext, addedCombinations, setAddedCombinations }) => {
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
      setAddedCombinations(prev => [
        ...prev,
        {
          productId: selectedProduct,
          subProductId: selectedSubProduct,
          productLabel,
          subProductLabel,
        },
      ]);
      alert("Added successfully!");
    } catch (error: any) {
      alert("Failed to add: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
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

      {/* Add Button */}
      <div className="mt-4 flex gap-4">
        <SecondaryButton
          onClick={handleAdd}
          disabled={!isValidUUID(selectedSubProduct) || loading}
        >
          {loading ? "Adding..." : "Add"}
        </SecondaryButton>
        <PrimaryButton
          onClick={onNext}
          disabled={!added}
        >
          Next
        </PrimaryButton>
      </div>
      {addError && <div className="text-red-600 text-sm mt-1">{addError}</div>}
      {/* Added combinations list */}
      {addedCombinations.length > 0 && (
        <div className="mt-6 border border-violet-200 rounded-lg bg-violet-50 p-4">
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
    </div>
  );
}; 