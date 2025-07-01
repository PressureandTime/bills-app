import { useState, useCallback } from 'react';

export interface UseDateRangeFilterReturn {
  dateStart: string | undefined;
  dateEnd: string | undefined;
  setDateStart: (date: string | undefined) => void;
  setDateEnd: (date: string | undefined) => void;
  setDateRange: (
    startDate: string | undefined,
    endDate: string | undefined
  ) => void;
  clearDates: () => void;
  hasDateFilter: boolean;
}

// date range filtering
export function useDateRangeFilter(
  initialDateStart?: string,
  initialDateEnd?: string
): UseDateRangeFilterReturn {
  const [dateStart, setDateStart] = useState<string | undefined>(
    initialDateStart
  );
  const [dateEnd, setDateEnd] = useState<string | undefined>(initialDateEnd);

  const setDateRange = useCallback(
    (startDate: string | undefined, endDate: string | undefined) => {
      setDateStart(startDate);
      setDateEnd(endDate);
    },
    []
  );

  const clearDates = useCallback(() => {
    setDateStart(undefined);
    setDateEnd(undefined);
  }, []);

  const hasDateFilter = Boolean(dateStart || dateEnd); // any date set?

  return {
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
    setDateRange,
    clearDates,
    hasDateFilter,
  };
}
