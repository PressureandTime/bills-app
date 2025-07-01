import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
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
} from '@mui/icons-material';
import type { EnhancedBill } from '../../types/bills';
import { DataGridErrorBoundary } from '../common/ErrorBoundary';
import { useResponsiveGrid } from '../../hooks/useResponsiveDataGrid';

export interface BillsDataGridProps {
  bills: EnhancedBill[];
  loading?: boolean;
  paginationModel?: GridPaginationModel;
  paginationMode?: 'client' | 'server';
  rowCount?: number;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  onRowClick?: (params: GridRowParams) => void;
  onFavouriteToggle: (billId: string) => void;
  onViewDetails: (bill: EnhancedBill) => void;
  isFavourite: (billId: string) => boolean;
  pageSizeOptions?: number[];
  height?: number;
  showPagination?: boolean;
  testId?: string;
}

export function BillsDataGrid({
  bills,
  loading = false,
  paginationModel,
  paginationMode = 'client',
  rowCount,
  onPaginationModelChange,
  onRowClick,
  onFavouriteToggle,
  onViewDetails,
  isFavourite,
  pageSizeOptions = [10, 25, 50, 100],
  height = 600,
  showPagination = true,
  testId = 'bills-data-grid',
}: BillsDataGridProps) {
  const baseColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'billNo',
        headerName: 'Bill Number',
        width: 130,
        sortable: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'billType',
        headerName: 'Type',
        width: 140,
        sortable: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        sortable: true,
        align: 'center',
        headerAlign: 'center',
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
        width: 180,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueGetter: (_value, row) =>
          (row as EnhancedBill).sponsors?.[0]?.showAs || 'No sponsor',
      },
      {
        field: 'englishTitle',
        headerName: 'Title',
        width: 300,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        renderCell: params => (
          <Tooltip title={params.value || 'No title available'} arrow>
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
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
        align: 'center',
        headerAlign: 'center',
        renderCell: params => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View Details" arrow>
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  onViewDetails(params.row as EnhancedBill);
                }}
                sx={{
                  minWidth: 44,
                  minHeight: 44,
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
                  onFavouriteToggle(params.row.billId);
                }}
                color={isFavourite(params.row.billId) ? 'error' : 'default'}
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                }}
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
    ],
    [onViewDetails, onFavouriteToggle, isFavourite]
  );

  const { config, isMobile } = useResponsiveGrid(baseColumns, {
    mobileHeight: height * 0.8,
    tabletHeight: height * 0.9,
    desktopHeight: height,
    enableMobileOptimizations: true,
  });

  const responsivePageSizeOptions = isMobile ? [10, 25] : pageSizeOptions;

  const dataGridProps: any = {
    'data-testid': testId,
    rows: bills,
    columns: config.columns,
    getRowId: (row: EnhancedBill) => row.billId,
    loading,
    onRowClick,
    density: config.density,
    sx: {
      height: config.height,
      '& .MuiDataGrid-row:hover': {
        cursor: 'pointer',
      },

      '& .MuiDataGrid-columnHeaders': {
        '& .MuiDataGrid-columnHeader:not([data-field="englishTitle"])': {
          textAlign: 'center !important',
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          '&:not([data-field="englishTitle"])': {
            '& > *': {
              textAlign: 'center !important',
              justifyContent: 'center !important',
              alignItems: 'center !important',
              width: '100% !important',
              display: 'flex !important',
            },
          },
        },
      },
      '& .MuiDataGrid-virtualScroller': {
        '& .MuiDataGrid-row': {
          '& .MuiDataGrid-cell:not([data-field="englishTitle"])': {
            textAlign: 'center !important',
            display: 'flex !important',
            alignItems: 'center !important',
            justifyContent: 'center !important',
            '&:not([data-field="englishTitle"])': {
              '& > *': {
                textAlign: 'center !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
                width: '100% !important',
                margin: '0 auto !important',
              },
            },
          },
        },
      },
      // Mobile-specific styling first
      ...(config.mobileStyles && config.mobileStyles),
      ...(isMobile && {
        '& .MuiDataGrid-cell': {
          ...config.mobileStyles?.['& .MuiDataGrid-cell'],
          fontSize: '0.875rem',
        },
        '& .MuiDataGrid-columnHeader': {
          ...config.mobileStyles?.['& .MuiDataGrid-columnHeader'],
          fontSize: '0.875rem',
          fontWeight: 600,
        },
        '& .MuiDataGrid-row': {
          minHeight: 48,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
        '& .MuiDataGrid-footerContainer': {
          minHeight: 56,
        },
      }),

      '& .MuiDataGrid-cell[data-field="billNo"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-cell[data-field="billType"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-cell[data-field="status"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-cell[data-field="sponsors"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-cell[data-field="actions"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="billNo"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="billType"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="status"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="sponsors"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="actions"]': {
        textAlign: 'center !important',
        justifyContent: 'center !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="billNo"] .MuiDataGrid-columnHeaderTitle':
        {
          textAlign: 'center !important',
          width: '100%',
        },
      '& .MuiDataGrid-columnHeader[data-field="billType"] .MuiDataGrid-columnHeaderTitle':
        {
          textAlign: 'center !important',
          width: '100%',
        },
      '& .MuiDataGrid-columnHeader[data-field="status"] .MuiDataGrid-columnHeaderTitle':
        {
          textAlign: 'center !important',
          width: '100%',
        },
      '& .MuiDataGrid-columnHeader[data-field="sponsors"] .MuiDataGrid-columnHeaderTitle':
        {
          textAlign: 'center !important',
          width: '100%',
        },
      '& .MuiDataGrid-columnHeader[data-field="actions"] .MuiDataGrid-columnHeaderTitle':
        {
          textAlign: 'center !important',
          width: '100%',
        },

      '& .MuiDataGrid-cell[data-field="englishTitle"]': {
        textAlign: 'left !important',
        justifyContent: 'flex-start !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="englishTitle"]': {
        textAlign: 'left !important',
        justifyContent: 'flex-start !important',
        display: 'flex !important',
        alignItems: 'center !important',
      },
      '& .MuiDataGrid-columnHeader[data-field="englishTitle"] .MuiDataGrid-columnHeaderTitle':
        {
          textAlign: 'left !important',
          width: '100%',
        },
    },
    disableRowSelectionOnClick: true,
    disableColumnMenu: isMobile,
    hideFooter: isMobile && !showPagination,
  };

  if (showPagination) {
    if (paginationModel) {
      dataGridProps.paginationModel = paginationModel;
    }
    if (paginationMode) {
      dataGridProps.paginationMode = paginationMode;
    }
    if (rowCount !== undefined) {
      dataGridProps.rowCount = rowCount;
    }
    if (onPaginationModelChange) {
      dataGridProps.onPaginationModelChange = onPaginationModelChange;
    }
    dataGridProps.pageSizeOptions = responsivePageSizeOptions;
    dataGridProps.initialState = {
      pagination: {
        paginationModel: {
          pageSize: isMobile ? 10 : 25,
          page: 0,
        },
      },
    };
  }

  return (
    <DataGridErrorBoundary>
      <DataGrid {...dataGridProps} />
    </DataGridErrorBoundary>
  );
}

export function EmptyBillsState({ message }: { message: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
