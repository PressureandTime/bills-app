import { renderHook, act } from '@testing-library/react';
import { useTableFilters } from '../useTableFilters';
import type { BillsFilter } from '../../types/bills';

describe('useTableFilters', () => {
  it('initializes with empty filter by default', () => {
    const { result } = renderHook(() => useTableFilters());

    expect(result.current.filter).toEqual({});
  });

  it('initializes with provided initial filter', () => {
    const initialFilter: BillsFilter = { billType: 'Bill', status: 'Current' };
    const { result } = renderHook(() => useTableFilters(initialFilter));

    expect(result.current.filter).toEqual(initialFilter);
  });

  it('updates filter with handleFilterChange', () => {
    const { result } = renderHook(() => useTableFilters());

    act(() => {
      result.current.handleFilterChange({ billType: 'Bill' });
    });

    expect(result.current.filter).toEqual({ billType: 'Bill' });

    act(() => {
      result.current.handleFilterChange({ status: 'Current' });
    });

    expect(result.current.filter).toEqual({
      billType: 'Bill',
      status: 'Current',
    });
  });

  it('resets filters with resetFilters', () => {
    const initialFilter: BillsFilter = { billType: 'Bill', status: 'Current' };
    const { result } = renderHook(() => useTableFilters(initialFilter));

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filter).toEqual({});
  });

  it('overwrites existing filter values', () => {
    const { result } = renderHook(() => useTableFilters({ billType: 'Bill' }));

    act(() => {
      result.current.handleFilterChange({ billType: 'Act' });
    });

    expect(result.current.filter).toEqual({ billType: 'Act' });
  });
});
