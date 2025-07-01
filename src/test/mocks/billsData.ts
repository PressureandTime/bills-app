/**
 * Simplified mock data for testing
 * Provides basic test data without complex API simulation
 */

import type { EnhancedBill } from '../../types/bills';

// Basic mock bills data for testing
export const mockBills: EnhancedBill[] = [
  {
    billId: 'bill-1',
    billNo: 'Bill 2023/001',
    billType: 'Public Bill',
    status: 'Second Stage',
    titles: [
      { as: 'en', showAs: 'Test Bill 2023' },
      { as: 'ga', showAs: 'Bille Tástála 2023' },
    ],
    sponsors: [{ as: 'TD', showAs: 'John Doe', byType: 'member' }],
    stages: [
      { house: 'dail', stage: 'First Stage', date: '2023-01-15' },
      { house: 'dail', stage: 'Second Stage', date: '2023-02-20' },
    ],
    uri: 'https://api.oireachtas.ie/v1/legislation/bill-1',
    source: 'oireachtas',
    isFavourite: true,
    englishTitle: 'Test Bill 2023',
    irishTitle: 'Bille Tástála 2023',
  },
  {
    billId: 'bill-2',
    billNo: 'Bill 2023/002',
    billType: 'Private Bill',
    status: 'Committee Stage',
    titles: [
      { as: 'en', showAs: 'Another Test Bill 2023' },
    ],
    sponsors: [{ as: 'TD', showAs: 'Jane Smith', byType: 'member' }],
    stages: [
      { house: 'dail', stage: 'First Stage', date: '2023-01-20' },
      { house: 'dail', stage: 'Committee Stage', date: '2023-04-15' },
    ],
    uri: 'https://api.oireachtas.ie/v1/legislation/bill-2',
    source: 'oireachtas',
    isFavourite: false,
    englishTitle: 'Another Test Bill 2023',
    irishTitle: 'Níl teideal Gaeilge ar fáil',
  },
];

// Basic mock bill types
export const mockBillTypes = [
  'Public Bill',
  'Private Bill',
  'Private Members Bill',
  'Money Bill',
];