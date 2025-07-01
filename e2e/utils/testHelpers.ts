import { Page } from '@playwright/test';
import type {
  BillsApiResponse,
  BillResult,
  ApiBill,
} from '../../src/types/bills';
import { mockBills } from '../../src/test/mocks/billsData';

/**
 * Creates a mock API response with the provided bill data.
 * @param bills The array of bills to include in the mock response.
 * @returns A formatted BillsApiResponse object.
 */
function createMockResponse(bills: typeof mockBills): BillsApiResponse {
  return {
    results: bills.map(
      bill =>
        ({
          bill: {
            billNo: bill.billNo,
            billType: bill.billType,
            status: bill.status,
            titles: bill.titles,
            sponsors: bill.sponsors,
            stages: bill.stages,
            uri: bill.uri,
            source: bill.source,
            shortTitleEn: bill.englishTitle,
            shortTitleGa: bill.irishTitle,
          } as ApiBill,
        }) as BillResult
    ),
    head: {
      counts: {
        resultCount: bills.length,
        totalCount: bills.length,
      },
      dateRange: {
        start: '2020-01-01',
        end: new Date().toISOString().split('T')[0],
      },
    },
  };
}

/**
 * Sets up the default API mock for the legislation endpoint using standard mock data.
 * @param page The Playwright Page object.
 */
export async function setupApiMocking(page: Page): Promise<void> {
  await page.route('**/api.oireachtas.ie/v1/legislation**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createMockResponse(mockBills)),
    });
  });
}

/**
 * Sets up a mock for an empty API response for testing empty states.
 * @param page The Playwright Page object.
 */
export async function mockEmptyApiResponse(page: Page): Promise<void> {
  await page.route('**/api.oireachtas.ie/v1/legislation**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createMockResponse([])),
    });
  });
}

/**
 * Sets up a mock for filtered API response for testing filtering functionality.
 * @param page The Playwright Page object.
 * @param billType Optional bill type filter.
 * @param status Optional status filter.
 */
export async function mockFilteredApiResponse(
  page: Page,
  billType?: string,
  status?: string
): Promise<void> {
  let filteredBills = mockBills;

  if (billType) {
    filteredBills = filteredBills.filter(bill => bill.billType === billType);
  }

  if (status) {
    filteredBills = filteredBills.filter(bill => bill.status === status);
  }

  await page.route('**/api.oireachtas.ie/v1/legislation**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createMockResponse(filteredBills)),
    });
  });
}
