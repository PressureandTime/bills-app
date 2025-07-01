import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Box, Alert, Card, CardContent } from '@mui/material';
import type { GridRowParams } from '@mui/x-data-grid';
import type { EnhancedBill, BillsFilter } from '../types/bills';
import { fetchBills, fetchBillTypes } from '../services/billsApi';
import { useFavourites } from '../hooks/useFavourites';
import { useTableFilters } from '../hooks/useTableFilters';
import { usePagination } from '../hooks/usePagination';
import { useTabManagement } from '../hooks/useTabManagement';
import { BillDetailsModal } from './BillDetailsModal';
import { BillsTableTabs } from './table/BillsTableTabs';
import { BillsTableFilters } from './table/BillsTableFilters';
import { BillsDataGrid, EmptyBillsState } from './table/BillsDataGrid';
import { TabPanel } from './common/TabPanel';

interface BillsTableProps {
  showFavouritesOnly?: boolean;
}

export function BillsTable({ showFavouritesOnly = false }: BillsTableProps) {
  const mountedRef = useRef(false);
  const loadingRef = useRef(false);

  const [bills, setBills] = useState<EnhancedBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [billTypes, setBillTypes] = useState<string[]>([]);

  const { filter, updateFilter } = useTableFilters();
  const {
    paginationModel,
    changePage: updatePagination,
    goToFirstPage,
  } = usePagination(0, 25, totalCount);
  const { currentTab, changeTab: updateTab } = useTabManagement(
    showFavouritesOnly ? 1 : 0
  );

  const [selectedBill, setSelectedBill] = useState<EnhancedBill | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { toggleFavourite, isFavourite } = useFavourites();

  useEffect(() => {
    if (mountedRef.current) {
      return;
    }

    // get bill types for filter dropdown
    fetchBillTypes().then(types => {
      setBillTypes(types);
    });

    mountedRef.current = true;
  }, []);

  // load bills from API
  const loadBills = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const clientFilter = filter.searchTerm;

      const mapBillTypeToSource = (billType?: string): string | undefined => {
        if (!billType) return undefined;
        switch (billType) {
          case 'Public':
            return 'Government';
          case 'Private':
            return 'Private Member';
          default:
            return undefined;
        }
      };

      const params = {
        limit: clientFilter ? 500 : paginationModel.pageSize,
        skip: clientFilter
          ? 0
          : paginationModel.page * paginationModel.pageSize,
        bill_source: mapBillTypeToSource(filter.billType) || filter.billSource,
        bill_status: filter.status,
        date_start: filter.dateStart,
        date_end: filter.dateEnd,
        member_id: filter.memberId,
        bill_no: filter.billNumber,
        bill_year: filter.billYear,
      };

      const { bills: fetchedBills, totalCount: fetchedTotalCount } =
        await fetchBills(params);

      // add favourite status to bills
      const enhancedBills = fetchedBills.map(bill => ({
        ...bill,
        isFavourite: isFavourite(bill.billId),
      }));

      setBills(enhancedBills);
      setTotalCount(fetchedTotalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bills');
      console.error('Load bills failed:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    filter.status,
    filter.billSource,
    filter.dateStart,
    filter.dateEnd,
    filter.memberId,
    filter.billNumber,
    filter.billYear,
    filter.billType,
    filter.searchTerm,
    isFavourite,
  ]);

  useEffect(() => {
    if (currentTab === 0 && mountedRef.current) {
      loadBills();
    } else {
      if (currentTab === 1) {
        setLoading(false);
      }
    }
  }, [loadBills, currentTab]);


  const searchBill = useCallback((bill: EnhancedBill, searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();
    const englishTitle = bill.englishTitle?.toLowerCase() || '';
    const irishTitle = bill.irishTitle?.toLowerCase() || '';
    const billNo = bill.billNo?.toLowerCase() || '';
    const billType = bill.billType?.toLowerCase() || '';
    const sponsors =
      bill.sponsors?.map(s => s.showAs?.toLowerCase() || '').join(' ') || '';
    const status = bill.status?.toLowerCase() || '';

    return (
      englishTitle.includes(term) ||
      irishTitle.includes(term) ||
      billNo.includes(term) ||
      billType.includes(term) ||
      sponsors.includes(term) ||
      status.includes(term)
    );
  }, []);

  // filter favourite bills
  const favouriteBills = useMemo(() => {
    const baseFavourites = bills.filter(bill => isFavourite(bill.billId));

    let result = baseFavourites;

    if (filter.searchTerm) {
      result = result.filter(bill => searchBill(bill, filter.searchTerm!));
    }

    return result;
  }, [bills, isFavourite, filter.searchTerm, searchBill]);

  const displayBills = useMemo(() => {
    const clientFilter = filter.searchTerm;
    let result = bills;

    if (filter.searchTerm) {
      result = result.filter(bill => searchBill(bill, filter.searchTerm!));
    }

    if (clientFilter) {
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const endIndex = startIndex + paginationModel.pageSize;
      return result.slice(startIndex, endIndex);
    }

    return result;
  }, [
    bills,
    filter.searchTerm,
    paginationModel.page,
    paginationModel.pageSize,
    searchBill,
  ]);


  const filteredCount = useMemo(() => {
    let result = bills;

    if (filter.searchTerm) {
      result = result.filter(bill => searchBill(bill, filter.searchTerm!));
    }

    return result.length;
  }, [bills, filter.searchTerm, searchBill]);

  const toggleFav = useCallback(
    async (billId: string) => {
      try {
        await toggleFavourite(billId);
        setBills(prevBills =>
          prevBills.map(bill =>
            bill.billId === billId
              ? { ...bill, isFavourite: isFavourite(billId) }
              : bill
          )
        );
      } catch (err) {
        console.error('Toggle favourite failed:', err);
      }
    },
    [toggleFavourite, isFavourite]
  );

  const showDetails = useCallback((params: GridRowParams) => {
    setSelectedBill(params.row as EnhancedBill);
    setModalOpen(true);
  }, []);

  const updateBillFilter = useCallback(
    (newFilter: Partial<BillsFilter>) => {
      updateFilter(newFilter);
      goToFirstPage();
    },
    [updateFilter, goToFirstPage]
  );

  const changePage = updatePagination;
  const changeTab = updateTab;

  const clientFilter = filter.searchTerm;
  const paginationMode = clientFilter ? 'client' : 'server';

  const openModal = useCallback((bill: EnhancedBill) => {
    setSelectedBill(bill);
    setModalOpen(true);
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: 2 }}>
          <BillsTableTabs
            currentTab={currentTab}
            onTabChange={changeTab}
            favouritesCount={favouriteBills.length}
          />

          <BillsTableFilters
            filter={filter}
            availableBillTypes={billTypes}
            onFilterChange={updateBillFilter}
            visible={currentTab === 0}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TabPanel value={currentTab} index={0}>
        <BillsDataGrid
          bills={displayBills}
          loading={loading}
          paginationModel={paginationModel}
          paginationMode={paginationMode}
          rowCount={paginationMode === 'server' ? totalCount : filteredCount}
          onPaginationModelChange={changePage}
          onRowClick={showDetails}
          onFavouriteToggle={toggleFav}
          onViewDetails={openModal}
          isFavourite={isFavourite}
          testId="bills-table"
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <BillsDataGrid
          bills={favouriteBills}
          loading={false}
          onRowClick={showDetails}
          onFavouriteToggle={toggleFav}
          onViewDetails={openModal}
          isFavourite={isFavourite}
          showPagination={false}
        />
        {favouriteBills.length === 0 && !loading && (
          <EmptyBillsState message="No favourite bills yet. Click the heart icon on any bill to add it to your favourites." />
        )}
      </TabPanel>

      <BillDetailsModal
        bill={selectedBill}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
