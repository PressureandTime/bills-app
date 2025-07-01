/**
 * Test utilities for business logic testing
 * Provides helper functions for creating mock data and testing utilities
 * No Material UI dependencies for fast test execution
 */

import type { EnhancedBill } from '../types/bills';

// Helper function to create mock bill data
export function createMockBill(overrides: Partial<EnhancedBill> = {}): EnhancedBill {
  return {
    billId: 'test-bill-1',
    billNo: 'Bill 2023/001',
    billType: 'Public Bill',
    status: 'Second Stage',
    titles: [
      { as: 'en', showAs: 'Test Bill 2023' },
      { as: 'ga', showAs: 'Bille Tástála 2023' },
    ],
    sponsors: [{ as: 'TD', showAs: 'John Doe', byType: 'member' }],
    stages: [],
    uri: 'https://api.oireachtas.ie/v1/legislation/test-bill-1',
    source: 'oireachtas',
    isFavourite: false,
    englishTitle: 'Test Bill 2023',
    irishTitle: 'Bille Tástála 2023',
    ...overrides,
  };
}

// Helper function to create multiple mock bills
export function createMockBills(count: number, baseOverrides: Partial<EnhancedBill> = {}): EnhancedBill[] {
  return Array.from({ length: count }, (_, index) =>
    createMockBill({
      billId: `test-bill-${index + 1}`,
      billNo: `Bill 2023/${String(index + 1).padStart(3, '0')}`,
      englishTitle: `Test Bill ${index + 1}`,
      irishTitle: `Bille Tástála ${index + 1}`,
      ...baseOverrides,
    })
  );
}

// Helper function to wait for async operations
export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to create mock API responses
export function createMockApiResponse(bills: EnhancedBill[], totalCount?: number) {
  return {
    bills,
    totalCount: totalCount ?? bills.length,
    resultCount: bills.length,
  };
}

// Helper function to setup localStorage mock with initial data
export function setupLocalStorageMock(initialData: Record<string, string> = {}) {
  const mockStorage: Record<string, string> = { ...initialData };
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      },
    },
    writable: true,
  });

  return mockStorage;
}

// Helper function to create mock filter options
export function createMockFilterOptions() {
  return {
    billTypes: ['Public Bill', 'Private Bill', 'Committee Bill'],
    statuses: ['First Stage', 'Second Stage', 'Committee Stage', 'Report Stage', 'Final Stage'],
  };
}

// Helper function to create mock pagination data
export function createMockPaginationData(page: number = 1, pageSize: number = 25, totalCount: number = 100) {
  return {
    page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    hasNextPage: page < Math.ceil(totalCount / pageSize),
    hasPreviousPage: page > 1,
  };
}

// Helper function to simulate API delay
export function simulateApiDelay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to create mock error responses
export function createMockError(message: string = 'Test error', status: number = 500) {
  const error = new Error(message) as any;
  error.status = status;
  return error;
}

// Common test constants
export const TEST_CONSTANTS = {
  FAVOURITES_STORAGE_KEY: 'irish-bills-favourites',
  API_BASE_URL: 'https://api.oireachtas.ie/v1/legislation',
  DEFAULT_PAGE_SIZE: 25,
  DEFAULT_TIMEOUT: 5000,
} as const;

// Helper function to validate bill data structure
export function validateBillStructure(bill: any): bill is EnhancedBill {
  return (
    typeof bill === 'object' &&
    bill !== null &&
    typeof bill.billId === 'string' &&
    typeof bill.billNo === 'string' &&
    typeof bill.billType === 'string' &&
    typeof bill.status === 'string' &&
    Array.isArray(bill.titles) &&
    Array.isArray(bill.sponsors) &&
    Array.isArray(bill.stages) &&
    typeof bill.uri === 'string' &&
    typeof bill.source === 'string' &&
    typeof bill.isFavourite === 'boolean'
  );
}

// Helper function to create mock favourites data
export function createMockFavouritesData(billIds: string[] = []) {
  return {
    favouriteBillIds: new Set(billIds),
    toggleFavourite: (id: string) => {
      // Mock implementation
      console.log(`Toggling favourite for bill: ${id}`);
    },
    isFavourite: (id: string) => billIds.includes(id),
  };
}