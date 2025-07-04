import axios from "axios";

const API_BASE_URL = "https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/translate-field";

export const translateFieldService = {
  async getDropdownValues(fieldName: string): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/${fieldName}`);
    // Each entry is a TranslateField object; fieldValue is in id.fieldValue
    return response.data.map((entry: any) => entry.id.fieldValue);
  },
}; 