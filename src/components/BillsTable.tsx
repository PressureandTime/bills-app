/**
 * Main Bills Table component with pagination, filtering, and favourites functionality
 * Uses Material UI DataGrid for professional table display
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridRowParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import type { EnhancedBill, BillsFilter } from '../types/bills';
import { fetchBills, fetchBillTypes } from '../services/billsApi';
import { useFavourites } from '../hooks/useFavourites';
import { BillDetailsModal } from './BillDetailsModal';

// Error Boundary Component for DataGrid
class DataGridErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('DataGrid Error Boundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('DataGrid Error details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="h6">Data Grid Error</Typography>
          <Typography variant="body2">
            There was an issue loading the data grid. Please refresh the page.
          </Typography>
          {this.state.error && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Error: {this.state.error.message}
            </Typography>
          )}
        </Alert>
      );
    }

    return this.props.children;
  }
}

interface BillsTableProps {
  showFavouritesOnly?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

/**
 * Bills Table Component
 */
export function BillsTable({ showFavouritesOnly = false }: BillsTableProps) {
  // Ref to prevent double API calls in React.StrictMode
  const mountedRef = useRef(false);
  const loadingRef = useRef(false);

  // State management
  const [bills, setBills] = useState<EnhancedBill[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [availableBillTypes, setAvailableBillTypes] = useState<string[]>([]);

  // Pagination and filtering state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [filter, setFilter] = useState<BillsFilter>({});

  // Modal state
  const [selectedBill, setSelectedBill] = useState<EnhancedBill | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Tab state for main/favourites view
  const [currentTab, setCurrentTab] = useState(showFavouritesOnly ? 1 : 0);

  // Favourites hook
  const { toggleFavourite, isFavourite } = useFavourites();

  // Load bill types on component mount
  useEffect(() => {
    if (mountedRef.current) {
      return;
    }

    fetchBillTypes().then(types => {
      setAvailableBillTypes(types);
    });

    mountedRef.current = true;
  }, []);

  // Load bills data
  const loadBills = useCallback(async () => {
    // Prevent double API calls in StrictMode
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = {
        limit: paginationModel.pageSize,
        skip: paginationModel.page * paginationModel.pageSize,
        bill_type: filter.billType,
        bill_status: filter.status,
      };

      const { bills: fetchedBills, totalCount: fetchedTotalCount } =
        await fetchBills(params);

      // Enhanced bills with favourite status
      const enhancedBills = fetchedBills.map(bill => ({
        ...bill,
        isFavourite: isFavourite(bill.billId),
      }));

      setBills(enhancedBills);
      setTotalCount(fetchedTotalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bills');
      console.error('Error loading bills:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    filter.billType,
    filter.status,
    isFavourite,
  ]);

  // Load bills when dependencies change
  useEffect(() => {
    if (currentTab === 0 && mountedRef.current) {
      // Only load from API for "All Bills" tab
      loadBills();
    } else {
      if (currentTab === 1) {
        setLoading(false); // Don't show loading for favourites tab
      }
    }
  }, [loadBills, currentTab]);

  // Get favourite bills for the favourites tab
  const favouriteBills = useMemo(() => {
    return bills.filter(bill => isFavourite(bill.billId));
  }, [bills, isFavourite]);

  // Handle favourite toggle
  const handleFavouriteToggle = useCallback(
    async (billId: string) => {
      try {
        await toggleFavourite(billId);
        // Update the bills array to reflect the change
        setBills(prevBills =>
          prevBills.map(bill =>
            bill.billId === billId
              ? { ...bill, isFavourite: isFavourite(billId) }
              : bill
          )
        );
      } catch (err) {
        console.error('Failed to toggle favourite:', err);
      }
    },
    [toggleFavourite, isFavourite]
  );

  // Handle row click to open modal
  const handleRowClick = useCallback((params: GridRowParams) => {
    setSelectedBill(params.row as EnhancedBill);
    setModalOpen(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilter: Partial<BillsFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPaginationModel(prev => ({ ...prev, page: 0 })); // Reset to first page
  }, []);

  // Handle tab change
  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
    },
    []
  );

  // Define table columns
  const columns: GridColDef[] = [
    {
      field: 'billNo',
      headerName: 'Bill Number',
      width: 150,
      sortable: true,
    },
    {
      field: 'billType',
      headerName: 'Bill Type',
      width: 180,
      sortable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: true,
      renderCell: params => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'sponsors',
      headerName: 'Sponsor',
      width: 200,
      sortable: false,
      valueGetter: (_value, row) =>
        (row as EnhancedBill).sponsors?.[0]?.showAs || 'No sponsor',
    },
    {
      field: 'englishTitle',
      headerName: 'Title',
      width: 300,
      sortable: false,
      renderCell: params => (
        <Tooltip title={params.value || 'No title available'} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {params.value || 'No title available'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: params => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details" arrow>
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                setSelectedBill(params.row as EnhancedBill);
                setModalOpen(true);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              isFavourite(params.row.billId)
                ? 'Remove from Favourites'
                : 'Add to Favourites'
            }
            arrow
          >
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                handleFavouriteToggle(params.row.billId);
              }}
              color={isFavourite(params.row.billId) ? 'error' : 'default'}
            >
              {isFavourite(params.row.billId) ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Header with tabs */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="bills tabs"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="All Bills" />
            <Tab label={`Favourites (${favouriteBills.length})`} />
          </Tabs>

          {/* Filters - only show for "All Bills" tab */}
          {currentTab === 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  Filters:
                </Typography>
              </Box>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Bill Type</InputLabel>
                <Select
                  value={filter.billType || ''}
                  label="Bill Type"
                  onChange={e =>
                    handleFilterChange({
                      billType: e.target.value || undefined,
                    })
                  }
                >
                  <MenuItem value="">All Types</MenuItem>
                  {availableBillTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Search"
                placeholder="Search bills..."
                value={filter.searchTerm || ''}
                onChange={e =>
                  handleFilterChange({
                    searchTerm: e.target.value || undefined,
                  })
                }
                sx={{ minWidth: 200 }}
              />
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Data Grid Tabs */}
      <TabPanel value={currentTab} index={0}>
        {/* All Bills DataGrid */}
        <DataGridErrorBoundary>
          <DataGrid
            rows={bills}
            columns={columns}
            getRowId={row => row.billId}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={totalCount}
            paginationMode="server"
            loading={loading}
            onRowClick={handleRowClick}
            sx={{
              height: 600,
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        </DataGridErrorBoundary>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* Favourites DataGrid */}
        <DataGridErrorBoundary>
          <DataGrid
            rows={favouriteBills}
            columns={columns}
            getRowId={row => row.billId}
            onRowClick={handleRowClick}
            sx={{
              height: 600,
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        </DataGridErrorBoundary>
        {favouriteBills.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No favourite bills yet. Click the heart icon on any bill to add it
              to your favourites.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Bill Details Modal */}
      <BillDetailsModal
        bill={selectedBill}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
