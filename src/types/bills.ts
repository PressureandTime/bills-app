export interface BillTitle {
  as: string;
  showAs: string;
}

export interface BillSponsor {
  as: string;
  showAs: string;
  byType: string;
}

export interface BillStage {
  house: string;
  stage: string;
  date: string;
}

export interface BillUri {
  uri: string;
}

export interface ApiBill {
  billNo: string;
  billType: string;
  billYear?: string;
  status: string;
  titles?: BillTitle[];
  sponsors?: BillSponsor[];
  stages?: BillStage[];
  uri: string;
  source?: string;
  shortTitleEn?: string;
  shortTitleGa?: string;
  longTitleEn?: string;
  longTitleGa?: string;
  [key: string]: unknown;
}

export interface Bill {
  billNo: string;
  billType: string;
  status: string;
  titles: BillTitle[];
  sponsors?: BillSponsor[];
  stages?: BillStage[];
  uri: string;
  billId: string;
  source: string;
}

export interface BillResult {
  bill: ApiBill;
}

export interface LegislationResults {
  legislation: ApiBill[];
}

export interface BillsApiResponse {
  results: BillResult[] | LegislationResults;
  head: {
    counts: {
      resultCount: number;
      totalCount: number;
    };
    dateRange: {
      start: string;
      end: string;
    };
  };
}

// Application-specific types
export interface EnhancedBill extends Bill {
  isFavourite: boolean;
  englishTitle?: string;
  irishTitle?: string;
}

export interface BillsTableColumn {
  field: keyof EnhancedBill;
  headerName: string;
  width: number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface BillsFilter {
  billType?: string;
  status?: string;
  searchTerm?: string;
  billSource?: string;
  dateStart?: string;
  dateEnd?: string;
  memberId?: string;
  billNumber?: string;
  billYear?: string;
}

export interface BillDetailsModalProps {
  bill: EnhancedBill | null;
  open: boolean;
  onClose: () => void;
}

export interface FavouritesState {
  favouriteBillIds: Set<string>;
  toggleFavourite: (billId: string) => void;
  isFavourite: (billId: string) => boolean;
}

// API-related types
export interface ApiConfig {
  baseUrl: string;
  limit: number;
  defaultParams: Record<string, string>;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  rowCount: number;
}

export interface BillsApiParams {
  limit?: number;
  skip?: number;
  bill_status?: string;
  bill_source?: string | string[];
  date_start?: string;
  date_end?: string;
  member_id?: string;
  bill_no?: string;
  bill_year?: string;
  chamber_id?: string;
  act_year?: string;
  act_no?: string;
  last_updated?: string;
  lang?: string;
}
