

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchBills, fetchBillTypes, toggleBillFavourite } from '../billsApi';
import type { BillsApiResponse, ApiBill } from '../../types/bills';


const mockFetch = vi.fn();

describe('billsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  describe('fetchBills', () => {
    const mockApiResponse: BillsApiResponse = {
      results: {
        legislation: [
          {
            billNo: 'TEST001',
            billType: 'Public Bill',
            status: 'Current',
            uri: 'https://example.com/bill/test001',
            billYear: '2024',
            source: 'Government',
            titles: [
              { as: 'en', showAs: 'Test Bill 2024' },
              { as: 'ga', showAs: 'Bille Tástála 2024' },
            ],
            sponsors: [],
            stages: [],
          },
        ],
      },
      head: {
        counts: {
          resultCount: 1,
          totalCount: 1,
        },
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31',
        },
      },
    };

    it('fetches bills successfully with default parameters', async () => {

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await fetchBills();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.bills).toHaveLength(1);
      expect(result.bills[0].billNo).toBe('TEST001');
      expect(result.bills[0].englishTitle).toBe('Test Bill 2024');
      expect(result.totalCount).toBe(1);
    });

    it('passes server-side filtering parameters in URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockApiResponse),
      });

      await fetchBills({
        bill_source: 'Government',
        bill_status: 'Current',
        limit: 10,
        skip: 20,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      const url = fetchCall[0];

      expect(url).toContain('bill_source');
      expect(url).toContain('bill_status');
      expect(url).toContain('limit');
      expect(url).toContain('skip');
    });

    it('passes date filtering parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockApiResponse),
      });

      await fetchBills({
        date_start: '2024-01-01',
        date_end: '2024-12-31',
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      const url = fetchCall[0];


      expect(url).toContain('date_start');
      expect(url).toContain('date_end');
    });

    it('handles API error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });


      await expect(fetchBills()).rejects.toThrow('Failed to fetch bills');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchBills()).rejects.toThrow('Network error');
    });
  });

  describe('fetchBillTypes', () => {
    it('returns array of bill types', async () => {
      const result = await fetchBillTypes();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Public Bill');
    });
  });

  describe('toggleBillFavourite', () => {
    it('toggles favourite status successfully', async () => {
      await expect(
        toggleBillFavourite('test-bill-id', true)
      ).resolves.not.toThrow();
    });
  });
});
