import axios from "axios";

const API_BASE_URL = "https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/product-selection";

export interface Entity {
  businessDomainId?: string;
  productCategoryId?: string;
  productSubCategoryId?: string;
  productId?: string;
  subProductId?: string;
  description: string;
}

export const productSelectionService = {
  async getBusinessDomains(): Promise<Entity[]> {
    const res = await axios.get(`${API_BASE_URL}/business-domains`);
    return res.data;
  },
  async getProductCategories(businessDomainId: string): Promise<Entity[]> {
    const res = await axios.get(`${API_BASE_URL}/product-categories`, { params: { businessDomainId } });
    return res.data;
  },
  async getProductSubCategories(productCategoryId: string): Promise<Entity[]> {
    const res = await axios.get(`${API_BASE_URL}/product-subcategories`, { params: { productCategoryId } });
    return res.data;
  },
  async getProducts(productSubCategoryId: string): Promise<Entity[]> {
    const res = await axios.get(`${API_BASE_URL}/products`, { params: { productSubCategoryId } });
    return res.data;
  },
  async getSubProducts(productId: string): Promise<Entity[]> {
    const res = await axios.get(`${API_BASE_URL}/sub-products`, { params: { productId } });
    return res.data;
  },
};