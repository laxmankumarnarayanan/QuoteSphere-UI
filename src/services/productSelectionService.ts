import axios from "axios";

const API_BASE_URL = "https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/product-selection";

export interface Entity {
  id?: string; // UUID string from backend
  businessDomainId?: string; // legacy, not used by backend
  productCategoryId?: string; // legacy, not used by backend
  productSubCategoryId?: string; // legacy, not used by backend
  productId?: string; // legacy, not used by backend
  subProductId?: string; // legacy, not used by backend
  description: string;
  domainType?: string;
  lastUpdatedBy?: string;
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export const productSelectionService = {
  async getBusinessDomains(): Promise<Entity[]> {
    const res = await axios.get(`${API_BASE_URL}/business-domains`);
    return res.data;
  },
  async getProductCategories(businessDomainId: string): Promise<Entity[]> {
    if (!isValidUUID(businessDomainId)) throw new Error("Invalid UUID for businessDomainId");
    const res = await axios.get(`${API_BASE_URL}/product-categories`, { params: { businessDomainId } });
    return res.data;
  },
  async getProductSubCategories(productCategoryId: string): Promise<Entity[]> {
    if (!isValidUUID(productCategoryId)) throw new Error("Invalid UUID for productCategoryId");
    const res = await axios.get(`${API_BASE_URL}/product-subcategories`, { params: { productCategoryId } });
    return res.data;
  },
  async getProducts(productSubCategoryId: string): Promise<Entity[]> {
    if (!isValidUUID(productSubCategoryId)) throw new Error("Invalid UUID for productSubCategoryId");
    const res = await axios.get(`${API_BASE_URL}/products`, { params: { productSubCategoryId } });
    return res.data;
  },
  async getSubProducts(productId: string): Promise<Entity[]> {
    if (!isValidUUID(productId)) throw new Error("Invalid UUID for productId");
    const res = await axios.get(`${API_BASE_URL}/sub-products`, { params: { productId } });
    return res.data;
  },
};