import axios from 'axios';

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealStatusCount {
  status: string;
  count: number;
}

export interface DashboardMetric {
  value: string | number;
  label: string;
}

export interface DealTableRow {
  id: string;
  dealId: string;
  priority: string;
  customerName: string;
  commitmentAmount: string;
  stage: string;
  status: string;
}

export interface DealWithCommitments {
  dealId: string;
  customerId: string;
  customerName: string;
  dealStatus: string;
  dealPhase?: string;
  initiator: string;
  createdDateTime?: string;
  createdBy?: string;
  lastUpdatedDateTime?: string;
  lastUpdatedBy?: string;
  commitments: DealCommitment[];
}

export interface DealCommitment {
  dealID: string;
  commitmentNumber?: number;
  currency: string;
  commitmentAmount: number;
  tenure: number;
  productID: string;
  subProductID: string;
  description: string;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
}

// Get deal status counts for Section 1
export async function getDealStatusCounts(): Promise<DealStatusCount[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/deal/status-counts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deal status counts:', error);
    // Return mock data for now
    return [
      { status: 'Draft', count: 15 },
      { status: 'In-Progress', count: 8 },
      { status: 'In Review', count: 12 },
      { status: 'Approved', count: 25 },
      { status: 'Rejected', count: 3 },
    ];
  }
}

// Get metrics for Section 2
export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/deal/metrics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Return mock data for now
    return [
      { value: '8', label: 'Awaiting Approval' },
      { value: '12', label: 'Ready for Signature' },
      { value: '15', label: 'Under Review' },
      { value: '25', label: 'Closed This Quarter' },
    ];
  }
}

// Get all deals for the table
export async function getAllDeals(): Promise<DealTableRow[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/deal/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all deals:', error);
    // Return mock data for now
    return generateMockDealData();
  }
}

// Get deals by initiator
export async function getMyDeals(initiator: string): Promise<DealTableRow[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/deal/by-initiator/${initiator}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my deals:', error);
    // Return mock data for now
    return generateMockDealData().filter(deal => Math.random() > 0.5); // Random filter for demo
  }
}

// Get deals by status
export async function getDealsByStatus(status: string): Promise<DealTableRow[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/deal/by-status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deals by status:', error);
    // Return mock data for now
    return generateMockDealData().filter(deal => deal.status === status);
  }
}

// Helper function to generate mock data
function generateMockDealData(): DealTableRow[] {
  const mockDeals: DealTableRow[] = [];
  const statuses = ['Draft', 'In-Progress', 'In Review', 'Approved', 'Rejected'];
  const stages = ['Initial', 'Under Review', 'Approved', 'Closed'];
  const priorities = ['High', 'Low'];
  
  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const currencies = ['USD', 'EUR', 'GBP', 'INR'];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const amount = Math.floor(Math.random() * 1000000) + 100000;
    
    mockDeals.push({
      id: `deal-${i}`,
      dealId: `DEAL-${String(i).padStart(4, '0')}`,
      priority,
      customerName: `Customer ${i}`,
      commitmentAmount: `${currency} ${amount.toLocaleString()}`,
      stage,
      status,
    });
  }
  
  return mockDeals;
} 