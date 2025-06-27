import React, { useEffect, useState } from "react";
import { productSelectionService, Entity } from "../../services/productSelectionService";

export const ProductSelectionDropdowns: React.FC = () => {
  const [businessDomains, setBusinessDomains] = useState<Entity[]>([]);
  const [productCategories, setProductCategories] = useState<Entity[]>([]);
  const [productSubCategories, setProductSubCategories] = useState<Entity[]>([]);
  const [products, setProducts] = useState<Entity[]>([]);
  const [subProducts, setSubProducts] = useState<Entity[]>([]);

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
    if (selectedBusinessDomain) {
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
    if (selectedProductCategory) {
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
    if (selectedProductSubCategory) {
      productSelectionService.getProducts(selectedProductSubCategory).then(setProducts);
      setSubProducts([]);
      setSelectedProduct("");
      setSelectedSubProduct("");
    }
  }, [selectedProductSubCategory]);

  // Fetch subproducts when product changes
  useEffect(() => {
    if (selectedProduct) {
      productSelectionService.getSubProducts(selectedProduct).then(setSubProducts);
      setSelectedSubProduct("");
    }
  }, [selectedProduct]);

  return (
    <div className="flex flex-col gap-4">
      {/* Business Domain Dropdown */}
      <select
        value={selectedBusinessDomain}
        onChange={e => setSelectedBusinessDomain(e.target.value)}
      >
        <option value="">Select Business Domain</option>
        {businessDomains.map(bd => (
          <option key={bd.businessDomainId} value={bd.businessDomainId}>
            {bd.description}
          </option>
        ))}
      </select>

      {/* Product Category Dropdown */}
      <select
        value={selectedProductCategory}
        onChange={e => setSelectedProductCategory(e.target.value)}
        disabled={!selectedBusinessDomain}
      >
        <option value="">Select Product Category</option>
        {productCategories.map(pc => (
          <option key={pc.productCategoryId} value={pc.productCategoryId}>
            {pc.description}
          </option>
        ))}
      </select>

      {/* Product SubCategory Dropdown */}
      <select
        value={selectedProductSubCategory}
        onChange={e => setSelectedProductSubCategory(e.target.value)}
        disabled={!selectedProductCategory}
      >
        <option value="">Select Product SubCategory</option>
        {productSubCategories.map(psc => (
          <option key={psc.productSubCategoryId} value={psc.productSubCategoryId}>
            {psc.description}
          </option>
        ))}
      </select>

      {/* Product Dropdown */}
      <select
        value={selectedProduct}
        onChange={e => setSelectedProduct(e.target.value)}
        disabled={!selectedProductSubCategory}
      >
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p.productId} value={p.productId}>
            {p.description}
          </option>
        ))}
      </select>

      {/* SubProduct Dropdown */}
      <select
        value={selectedSubProduct}
        onChange={e => setSelectedSubProduct(e.target.value)}
        disabled={!selectedProduct}
      >
        <option value="">Select SubProduct</option>
        {subProducts.map(sp => (
          <option key={sp.subProductId} value={sp.subProductId}>
            {sp.description}
          </option>
        ))}
      </select>
    </div>
  );
}; 