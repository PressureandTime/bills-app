import { useState, useCallback } from 'react';
import type { BillsFilter } from '../types/bills';

export interface UseTableFiltersReturn {
  filter: BillsFilter;
  setFilter: React.Dispatch<React.SetStateAction<BillsFilter>>;
  updateFilter: (newFilter: Partial<BillsFilter>) => void;
  handleFilterChange: (newFilter: Partial<BillsFilter>) => void;
  clearFilters: () => void;
  resetFilters: () => void;
}

// manages filter state
export function useTableFilters(
  initialFilter: BillsFilter = {}
): UseTableFiltersReturn {
  const [filter, setFilter] = useState<BillsFilter>(initialFilter);

  const updateFilter = useCallback((newFilter: Partial<BillsFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({});
  }, []);

  return {
    filter,
    setFilter,
    updateFilter,
    handleFilterChange: updateFilter, // alias for backward compatibility
    clearFilters,
    resetFilters: clearFilters, // alias for backward compatibility
  };
}
