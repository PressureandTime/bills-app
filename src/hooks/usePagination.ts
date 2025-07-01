import { useState, useCallback, useMemo } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';

export interface UsePaginationReturn {
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
  changePage: (newPaginationModel: GridPaginationModel) => void;
  goToFirstPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  totalPages: number;
}

// pagination state management
export function usePagination(
  initialPage: number = 0,
  initialPageSize: number = 25,
  totalCount: number = 0
): UsePaginationReturn {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const changePage = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      
      setPaginationModel(newPaginationModel);
    },
    [paginationModel]
  );

  const goToFirstPage = useCallback(() => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, []);

  // calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / paginationModel.pageSize);
  }, [totalCount, paginationModel.pageSize]);

  const canGoNext = useMemo(() => {
    return paginationModel.page < totalPages - 1;
  }, [paginationModel.page, totalPages]);

  const canGoPrevious = useMemo(() => {
    return paginationModel.page > 0;
  }, [paginationModel.page]);

  return {
    paginationModel,
    setPaginationModel,
    changePage,
    goToFirstPage,
    canGoNext,
    canGoPrevious,
    totalPages,
  };
}
