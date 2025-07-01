
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

function buildParams(params: BillsApiParams): URLSearchParams {
  const urlParams = new URLSearchParams();


  Object.entries(API_CONFIG.defaultParams).forEach(([key, value]) => {
    urlParams.set(key, value);
  });


  const isValidDate = (dateString: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const setArrayParam = (
    key: string,
    value: string | string[]
  ): void => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        urlParams.set(key, value.join(','));
      }
    } else {
      urlParams.set(key, value);
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (key === 'bill_status' || key === 'bill_source') {
      setArrayParam(key, value as string | string[]);
      return;
    }

    if (key === 'date_start' || key === 'date_end' || key === 'last_updated') {
      const dateValue = value.toString();
      if (isValidDate(dateValue)) {
        urlParams.set(key, dateValue);
      } else {
        console.warn(`Bad date: ${key}=${dateValue}`);
      }
      return;
    }

    if (
      key === 'limit' ||
      key === 'skip' ||
      key === 'member_id' ||
      key === 'bill_no' ||
      key === 'bill_year' ||
      key === 'chamber_id' ||
      key === 'act_year' ||
      key === 'act_no'
    ) {
      const numValue =
        typeof value === 'number' ? value : parseInt(value.toString(), 10);
      if (!isNaN(numValue)) {
        urlParams.set(key, numValue.toString());
      } else {
        console.warn(`Bad number: ${key}=${value}`);
      }
      return;
    }

    const stringValue = value.toString().trim();
    if (stringValue) {
      urlParams.set(key, stringValue);
    }
  });

  return urlParams;
}

function transformBill(apiBill: ApiBill): EnhancedBill {
  if (!apiBill) {
    throw new BillsApiError('Bill data is null');
  }

  const billId =
    apiBill.uri ||
    `${apiBill.billYear || 'unknown'}-${apiBill.billNo || 'unknown'}`;

  // default titles
  let englishTitle = 'No title available';
  let irishTitle = 'Níl teideal ar fáil';

  if (apiBill.titles && Array.isArray(apiBill.titles)) {
    const enTitle = apiBill.titles.find(
      (title: BillTitle) => title.as === 'en' || title.as === 'eng'
    );
    const gaTitle = apiBill.titles.find(
      (title: BillTitle) => title.as === 'ga' || title.as === 'gle'
    );

    englishTitle =
      enTitle?.showAs || apiBill.titles[0]?.showAs || englishTitle;
    irishTitle = gaTitle?.showAs || irishTitle;
  } else if (apiBill.shortTitleEn) {
    englishTitle = apiBill.shortTitleEn;
    irishTitle = apiBill.shortTitleGa || irishTitle;
  } else if (apiBill.longTitleEn) {
    englishTitle = apiBill.longTitleEn.replace(/<[^>]*>/g, '').trim();
    irishTitle = apiBill.longTitleGa
      ? apiBill.longTitleGa.replace(/<[^>]*>/g, '').trim()
      : irishTitle;
  }

  const bill: EnhancedBill = {
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

  return bill;
}

export async function fetchBills(params: BillsApiParams = {}): Promise<{
  bills: EnhancedBill[];
  totalCount: number;
  resultCount: number;
}> {
  try {
    const urlParams = buildParams({
      limit: API_CONFIG.limit,
      ...params,
    });

    const url = `${API_CONFIG.baseUrl}?${urlParams.toString()}`;

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
      billList = (data.results as BillResult[])
        .map(result => result.bill)
        .filter(bill => bill != null);
    } else {
      throw new BillsApiError('Bad response format');
    }

    if (!billList || !Array.isArray(billList)) {
      throw new BillsApiError('Bill list not found');
    }

    const validBills = billList.filter(bill => bill != null);
    const transformedBills = validBills.map(transformBill);
    const totalCount =
      data.head?.counts?.totalCount ||
      data.head?.counts?.resultCount ||
      transformedBills.length;
    const resultCount =
      data.head?.counts?.resultCount || transformedBills.length;

    return {
      bills: transformedBills,
      totalCount,
      resultCount,
    };
  } catch (error) {
    console.error('fetchBills error:', error);

    if (error instanceof BillsApiError) {
      throw error;
    }

    throw new BillsApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function fetchBillTypes(): Promise<string[]> {
  try {
    const { bills } = await fetchBills({ limit: 200 });

    const uniqueTypes = [...new Set(bills.map(bill => bill.billType))]
      .filter(type => type && type.trim() !== '' && type !== 'Unknown')
      .sort();

    // fallback to hardcoded list if no types found
    if (uniqueTypes.length > 0) {
      return uniqueTypes;
    }

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
    console.error('fetchBillTypes error:', error);

    return [
      'Public Bill',
      'Private Bill',
      'Private Members Bill',
      'Money Bill',
      'Consolidation Bill',
      'Government Bill',
      'Committee Bill',
    ];
  }
}


export async function toggleBillFavourite(
  billId: string,
  isFavourite: boolean
): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve();
  } catch (error) {
    console.error('toggleFavourite error:', error);
    throw new BillsApiError(
      `Failed to ${isFavourite ? 'favourite' : 'unfavourite'} bill: ${billId}`
    );
  }
}

export { API_CONFIG };
