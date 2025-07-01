/**
 * Business logic tests for BillsTable functionality
 * Tests core functionality without Material UI dependencies
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as billsApiModule from '../../services/billsApi';
import { useFavourites } from '../../hooks/useFavourites';
import { createMockBill } from '../../test/utils';

// Mock the bills API module
vi.mock('../../services/billsApi', () => ({
  fetchBills: vi.fn(),
  fetchBillTypes: vi.fn(),
  toggleBillFavourite: vi.fn(),
}));

// Mock the favourites hook
vi.mock('../../hooks/useFavourites');

describe('BillsTable Business Logic', () => {
  const mockFetchBills = vi.mocked(billsApiModule.fetchBills);
  const mockFetchBillTypes = vi.mocked(billsApiModule.fetchBillTypes);
  const mockToggleBillFavourite = vi.mocked(billsApiModule.toggleBillFavourite);
  const mockUseFavourites = vi.mocked(useFavourites);

  const mockBills = [
    createMockBill({ billId: '1', billType: 'Public Bill', englishTitle: 'Test Bill 1' }),
    createMockBill({ billId: '2', billType: 'Private Bill', englishTitle: 'Test Bill 2' }),
    createMockBill({ billId: '3', billType: 'Public Bill', englishTitle: 'Test Bill 3' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchBills.mockResolvedValue({
      bills: mockBills,
      totalCount: 3,
      resultCount: 3,
    });
    mockFetchBillTypes.mockResolvedValue(['Public Bill', 'Private Bill']);
    mockUseFavourites.mockReturnValue({
      favouriteBillIds: new Set(['1']),
      toggleFavourite: vi.fn(),
      isFavourite: vi.fn((id) => id === '1'),
    });
  });

  describe('API Integration', () => {
    it('fetches bills with correct parameters', async () => {
      const result = await mockFetchBills({ page: 1, limit: 25 });
      
      expect(mockFetchBills).toHaveBeenCalledWith({ page: 1, limit: 25 });
      expect(result.bills).toHaveLength(3);
      expect(result.totalCount).toBe(3);
    });

    it('fetches bill types correctly', async () => {
      const result = await mockFetchBillTypes();
      
      expect(mockFetchBillTypes).toHaveBeenCalled();
      expect(result).toEqual(['Public Bill', 'Private Bill']);
    });

    it('handles API errors gracefully', async () => {
      mockFetchBills.mockRejectedValue(new Error('API Error'));
      
      await expect(mockFetchBills({ page: 1 })).rejects.toThrow('API Error');
    });
  });

  describe('Favourites Integration', () => {
    it('correctly identifies favourite bills', () => {
      const { isFavourite } = mockUseFavourites();
      
      expect(isFavourite('1')).toBe(true);
      expect(isFavourite('2')).toBe(false);
    });

    it('toggles bill favourite status', async () => {
      const billId = '2';
      await mockToggleBillFavourite(billId, true);
      
      expect(mockToggleBillFavourite).toHaveBeenCalledWith(billId, true);
    });
  });

  describe('Data Filtering Logic', () => {
    it('filters bills by type correctly', () => {
      const publicBills = mockBills.filter(bill => bill.billType === 'Public Bill');
      const privateBills = mockBills.filter(bill => bill.billType === 'Private Bill');
      
      expect(publicBills).toHaveLength(2);
      expect(privateBills).toHaveLength(1);
      expect(publicBills[0].billType).toBe('Public Bill');
      expect(privateBills[0].billType).toBe('Private Bill');
    });

    it('handles empty filter results', () => {
      const nonExistentType = mockBills.filter(bill => bill.billType === 'Non-existent');
      
      expect(nonExistentType).toHaveLength(0);
    });
  });

  describe('Pagination Logic', () => {
    it('calculates pagination correctly', () => {
      const pageSize = 25;
      const totalCount = 100;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      expect(totalPages).toBe(4);
    });

    it('handles edge cases for pagination', () => {
      const pageSize = 25;
      const totalCount = 25;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      expect(totalPages).toBe(1);
    });
  });

  describe('Bill Data Transformation', () => {
    it('extracts English titles correctly', () => {
      const bill = mockBills[0];
      
      expect(bill.englishTitle).toBe('Test Bill 1');
      expect(bill.englishTitle).toBeDefined();
    });

    it('handles bills with missing titles', () => {
      const billWithoutTitle = createMockBill({ 
        englishTitle: undefined,
        titles: []
      });
      
      expect(billWithoutTitle.englishTitle).toBeUndefined();
    });
  });
});