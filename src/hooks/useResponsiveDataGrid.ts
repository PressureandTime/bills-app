import { useMemo } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';

export interface ResponsiveGridConfig {
  columns: GridColDef[];
  density: 'compact' | 'standard';
  height: number;
  isMobileView: boolean;
  isTabletView: boolean;
  mobileStyles: Record<string, any> | undefined;
}

export interface UseResponsiveGridReturn {
  config: ResponsiveGridConfig;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// responsive grid setup for mobile/tablet/desktop
export function useResponsiveGrid(
  baseColumns: GridColDef[],
  options?: {
    mobileHeight?: number;
    tabletHeight?: number;
    desktopHeight?: number;
    enableMobileOptimizations?: boolean;
  }
): UseResponsiveGridReturn {
  const theme = useTheme();
  // breakpoint detection
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const config = useMemo((): ResponsiveGridConfig => {
    const {
      mobileHeight = 400,
      tabletHeight = 500,
      desktopHeight = 600,
      enableMobileOptimizations = true, // mobile performance tweaks
    } = options || {};

    let columns: GridColDef[];

    if (isMobile) {
      // show only essential columns on mobile
      const mobileColumns = [0, 4, 5];
      columns = mobileColumns
        .filter(index => index < baseColumns.length)
        .map(index => ({
          ...baseColumns[index],
          width:
            baseColumns[index].field === 'actions'
              ? 100
              : baseColumns[index].field === 'billNo'
                ? 100
                : baseColumns[index].width &&
                    typeof baseColumns[index].width === 'number'
                  ? Math.max((baseColumns[index].width as number) * 0.8, 120)
                  : baseColumns[index].width,
          ...(baseColumns[index].field === 'englishTitle' && {
            flex: 1,
            minWidth: 200,
          }),
        }));
    } else if (isTablet) {
      // more columns for tablet
      const tabletColumns = [0, 1, 4, 5];
      columns = tabletColumns
        .filter(index => index < baseColumns.length)
        .map(index => ({
          ...baseColumns[index],
          width:
            baseColumns[index].field === 'englishTitle'
              ? undefined 
              : baseColumns[index].width,
          ...(baseColumns[index].field === 'englishTitle' && {
            flex: 1,
            minWidth: 250,
          }),
        }));
    } else {
      // desktop gets all columns
      columns = baseColumns.map(col => ({
        ...col,
        ...(col.field === 'englishTitle' && {
          flex: 1,
          minWidth: 300,
        }),
      }));
    }

    const mobileStyles =
      enableMobileOptimizations && isMobile
        ? {
            '& .MuiDataGrid-cell': {
              paddingLeft: 1,
              paddingRight: 1,
            },
            '& .MuiDataGrid-columnHeader': {
              paddingLeft: 1,
              paddingRight: 1,
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }
        : undefined;

    return {
      columns,
      density: isMobile ? 'compact' : 'standard',
      height: isMobile ? mobileHeight : isTablet ? tabletHeight : desktopHeight,
      isMobileView: isMobile,
      isTabletView: isTablet,
      mobileStyles,
    };
  }, [baseColumns, isMobile, isTablet, isDesktop, options]);

  return {
    config,
    isMobile,
    isTablet,
    isDesktop,
  };
}
