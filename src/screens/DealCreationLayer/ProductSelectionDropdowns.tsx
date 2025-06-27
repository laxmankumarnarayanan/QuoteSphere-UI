import React, { useEffect, useState } from "react";
import { productSelectionService, Entity } from "../../services/productSelectionService";

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export const ProductSelectionDropdowns: React.FC = () => {
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

  // Fetch business domains on mount
  useEffect(() => {
    productSelectionService.getBusinessDomains().then(setBusinessDomains);
  }, []);

  // Fetch product categories when business domain changes
  useEffect(() => {
    if (isValidUUID(selectedBusinessDomain)) {
      console.log('Selected BusinessDomainID:', selectedBusinessDomain);
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

  // Log selectedBusinessDomain every time it changes
  useEffect(() => {
    console.log('selectedBusinessDomain changed:', selectedBusinessDomain);
  }, [selectedBusinessDomain]);

  // Log selectedProductCategory every time it changes
  useEffect(() => {
    console.log('selectedProductCategory changed:', selectedProductCategory);
  }, [selectedProductCategory]);

  return (
    <div className="flex flex-col gap-4">
      {/* Business Domain Dropdown (UUID) */}
      <select
        value={selectedBusinessDomain}
        onChange={e => setSelectedBusinessDomain(e.target.value)}
      >
        <option value="">Select Business Domain</option>
        {businessDomains.map(bd => (
          <option key={bd.id} value={bd.id}>
            {bd.description}
          </option>
        ))}
      </select>

      {/* Product Category Dropdown (UUID) */}
      <select
        value={selectedProductCategory}
        onChange={e => setSelectedProductCategory(e.target.value)}
        disabled={!isValidUUID(selectedBusinessDomain)}
      >
        <option value="">Select Product Category</option>
        {productCategories.map(pc => (
          <option key={pc.id} value={pc.id}>
            {pc.description}
          </option>
        ))}
      </select>

      {/* Product SubCategory Dropdown (UUID) */}
      <select
        value={selectedProductSubCategory}
        onChange={e => setSelectedProductSubCategory(e.target.value)}
        disabled={!isValidUUID(selectedProductCategory)}
      >
        <option value="">Select Product SubCategory</option>
        {productSubCategories.map(psc => (
          <option key={psc.id} value={psc.id}>
            {psc.description}
          </option>
        ))}
      </select>

      {/* Product Dropdown (UUID) */}
      <select
        value={selectedProduct}
        onChange={e => setSelectedProduct(e.target.value)}
        disabled={!isValidUUID(selectedProductSubCategory)}
      >
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.description}
          </option>
        ))}
      </select>

      {/* SubProduct Dropdown (UUID) */}
      <select
        value={selectedSubProduct}
        onChange={e => setSelectedSubProduct(e.target.value)}
        disabled={!isValidUUID(selectedProduct)}
      >
        <option value="">Select SubProduct</option>
        {subProducts.map(sp => (
          <option key={sp.id} value={sp.id}>
            {sp.description}
          </option>
        ))}
      </select>
    </div>
  );
}; 