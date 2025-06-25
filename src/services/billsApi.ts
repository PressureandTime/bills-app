/**
 * API service for interacting with the Irish Oireachtas Bills API
 * Handles data fetching, error handling, and data transformation
 */

import type {
  BillsApiResponse,
  BillsApiParams,
  EnhancedBill,
  ApiBill,
  ApiConfig,
  BillResult,
  BillTitle,
} from '../types/bills';

const API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.oireachtas.ie/v1/legislation',
  limit: 25,
  defaultParams: {
    chamber_type: 'house',
    lang: 'en',
  },
};

/**
 * Custom error class for API-related errors
 */
export class BillsApiError extends Error {
  public status?: number;
  public response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.name = 'BillsApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Builds URL search parameters for the API request
 */
function buildUrlParams(params: BillsApiParams): URLSearchParams {
  const urlParams = new URLSearchParams();

  // Add default parameters
  Object.entries(API_CONFIG.defaultParams).forEach(([key, value]) => {
    urlParams.set(key, value);
  });

  // Add custom parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.set(key, value.toString());
    }
  });

  return urlParams;
}

/**
 * Transforms API bill data to enhanced bill format with language titles
 */
function transformBillData(apiBill: ApiBill): EnhancedBill {
  // Generate billId from available fields since API doesn't provide it
  const billId =
    apiBill.uri ||
    `${apiBill.billYear || 'unknown'}-${apiBill.billNo || 'unknown'}`;

  // Extract English and Irish titles - handle multiple title formats
  let englishTitle = 'No title available';
  let irishTitle = 'Níl teideal ar fáil';

  if (apiBill.titles && Array.isArray(apiBill.titles)) {
    const englishTitleObj = apiBill.titles.find(
      (title: BillTitle) => title.as === 'en' || title.as === 'eng'
    );
    const irishTitleObj = apiBill.titles.find(
      (title: BillTitle) => title.as === 'ga' || title.as === 'gle'
    );

    englishTitle =
      englishTitleObj?.showAs || apiBill.titles[0]?.showAs || englishTitle;
    irishTitle = irishTitleObj?.showAs || irishTitle;
  } else if (apiBill.shortTitleEn) {
    englishTitle = apiBill.shortTitleEn;
    irishTitle = apiBill.shortTitleGa || irishTitle;
  } else if (apiBill.longTitleEn) {
    // Clean HTML tags from long title
    englishTitle = apiBill.longTitleEn.replace(/<[^>]*>/g, '').trim();
    irishTitle = apiBill.longTitleGa
      ? apiBill.longTitleGa.replace(/<[^>]*>/g, '').trim()
      : irishTitle;
  }

  // Create standardized enhanced bill object
  const enhancedBill: EnhancedBill = {
    billId,
    billNo: apiBill.billNo || 'Unknown',
    billType: apiBill.billType || 'Unknown',
    status: apiBill.status || 'Unknown',
    titles: apiBill.titles || [],
    sponsors: apiBill.sponsors || [],
    stages: apiBill.stages || [],
    uri: apiBill.uri || '',
    source: apiBill.source || '',
    isFavourite: false,
    englishTitle,
    irishTitle,
  };

  return enhancedBill;
}

/**
 * Fetches bills data from the Irish Oireachtas API
 */
export async function fetchBills(params: BillsApiParams = {}): Promise<{
  bills: EnhancedBill[];
  totalCount: number;
  resultCount: number;
}> {
  try {
    const urlParams = buildUrlParams({
      limit: API_CONFIG.limit,
      ...params,
    });

    const url = `${API_CONFIG.baseUrl}?${urlParams.toString()}`;

    console.log('Fetching bills from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new BillsApiError(
        `Failed to fetch bills: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    const data: BillsApiResponse = await response.json();

    let billList: ApiBill[] = [];

    if (data.results && 'legislation' in data.results) {
      billList = data.results.legislation;
    } else if (data.results && Array.isArray(data.results)) {
      billList = (data.results as BillResult[]).map(result => result.bill);
    } else {
      throw new BillsApiError('Invalid API response format');
    }

    if (!billList) {
      throw new BillsApiError(
        'Invalid API response format: bill list not found'
      );
    }

    const transformedBills = billList.map(transformBillData);

    return {
      bills: transformedBills,
      totalCount: data.head?.counts?.totalCount || transformedBills.length,
      resultCount: data.head?.counts?.resultCount || transformedBills.length,
    };
  } catch (error) {
    console.error('Error fetching bills:', error);

    if (error instanceof BillsApiError) {
      throw error;
    }

    // Network or other errors
    throw new BillsApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches available bill types for filtering
 */
export async function fetchBillTypes(): Promise<string[]> {
  try {
    // For now, return common bill types based on API documentation
    // In a real application, you might fetch this dynamically
    return [
      'Public Bill',
      'Private Bill',
      'Private Members Bill',
      'Money Bill',
      'Consolidation Bill',
      'Government Bill',
      'Committee Bill',
    ];
  } catch (error) {
    console.error('Error fetching bill types:', error);
    return [];
  }
}

/**
 * Mock function to simulate favouriting a bill
 * In a real application, this would send a request to the backend
 */
export async function toggleBillFavourite(
  billId: string,
  isFavourite: boolean
): Promise<void> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const action = isFavourite ? 'favourited' : 'unfavourited';
    console.log(`🔖 Bill ${billId} has been ${action} (mocked API call)`);

    // In a real application, you would make an actual API call here:
    // const response = await fetch(`/api/bills/${billId}/favourite`, {
    //   method: isFavourite ? 'POST' : 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    // });

    return Promise.resolve();
  } catch (error) {
    console.error('Error toggling bill favourite:', error);
    throw new BillsApiError(
      `Failed to ${isFavourite ? 'favourite' : 'unfavourite'} bill: ${billId}`
    );
  }
}

export { API_CONFIG };
