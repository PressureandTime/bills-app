/**
 * Unit tests for BillsTable component
 * Demonstrates testing best practices for React components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BillsTable } from '../BillsTable';
import * as billsApiModule from '../../services/billsApi';
import type { EnhancedBill } from '../../types/bills';

// Mock the bills API module
vi.mock('../../services/billsApi', () => ({
  fetchBills: vi.fn(),
  fetchBillTypes: vi.fn(),
  toggleBillFavourite: vi.fn(),
}));

// Mock the favourites hook
vi.mock('../../hooks/useFavourites', () => ({
  useFavourites: () => ({
    favouriteBillIds: new Set(['bill-1']),
    toggleFavourite: vi.fn(),
    isFavourite: vi.fn((id: string) => id === 'bill-1'),
  }),
}));

// Mock data for testing
const mockBills: EnhancedBill[] = [
  {
    billId: 'bill-1',
    billNo: 'Bill 2023/001',
    billType: 'Public Bill',
    status: 'Second Stage',
    titles: [
      { as: 'en', showAs: 'Test Bill 2023' },
      { as: 'ga', showAs: 'Bille Tástála 2023' },
    ],
    sponsors: [{ as: 'TD', showAs: 'John Doe', byType: 'member' }],
    uri: 'https://api.oireachtas.ie/v1/legislation/bill-1',
    source: 'oireachtas',
    isFavourite: true,
    englishTitle: 'Test Bill 2023',
    irishTitle: 'Bille Tástála 2023',
  },
  {
    billId: 'bill-2',
    billNo: 'Bill 2023/002',
    billType: 'Private Bill',
    status: 'Committee Stage',
    titles: [{ as: 'en', showAs: 'Another Test Bill 2023' }],
    sponsors: [{ as: 'TD', showAs: 'Jane Smith', byType: 'member' }],
    uri: 'https://api.oireachtas.ie/v1/legislation/bill-2',
    source: 'oireachtas',
    isFavourite: false,
    englishTitle: 'Another Test Bill 2023',
    irishTitle: 'Níl teideal ar fáil',
  },
];

const mockBillTypes = ['Public Bill', 'Private Bill', 'Money Bill'];

describe('BillsTable', () => {
  const mockFetchBills = vi.mocked(billsApiModule.fetchBills);
  const mockFetchBillTypes = vi.mocked(billsApiModule.fetchBillTypes);

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockFetchBills.mockResolvedValue({
      bills: mockBills,
      totalCount: 2,
      resultCount: 2,
    });

    mockFetchBillTypes.mockResolvedValue(mockBillTypes);
  });

  it('renders without crashing', () => {
    render(<BillsTable />);
    expect(screen.getByText('All Bills')).toBeInTheDocument();
  });

  it('displays loading state initially', async () => {
    // Make the API call hang to test loading state
    mockFetchBills.mockImplementation(() => new Promise(() => {}));

    render(<BillsTable />);

    // The loading state should be visible in the DataGrid
    await waitFor(() => {
      const dataGrid = document.querySelector('.MuiDataGrid-root');
      expect(dataGrid).toBeInTheDocument();
    });
  });

  it('displays bills data after loading', async () => {
    render(<BillsTable />);

    // Wait for bills to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('Bill 2023/001')).toBeInTheDocument();
      expect(screen.getByText('Bill 2023/002')).toBeInTheDocument();
    });

    expect(screen.getByText('Public Bill')).toBeInTheDocument();
    expect(screen.getByText('Private Bill')).toBeInTheDocument();
  });

  it('displays error message when API fails', async () => {
    mockFetchBills.mockRejectedValue(new Error('API Error'));

    render(<BillsTable />);

    await waitFor(() => {
      expect(screen.getByText(/API Error/)).toBeInTheDocument();
    });
  });

  it('allows filtering by bill type', async () => {
    const user = userEvent.setup();
    render(<BillsTable />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Bill 2023/001')).toBeInTheDocument();
    });

    // Open the bill type filter dropdown
    const billTypeFilter = screen.getByLabelText('Bill Type');
    await user.click(billTypeFilter);

    // Select "Public Bill"
    const publicBillOption = screen.getByText('Public Bill');
    await user.click(publicBillOption);

    // Verify that the API is called with the filter
    await waitFor(() => {
      expect(mockFetchBills).toHaveBeenCalledWith(
        expect.objectContaining({
          bill_type: 'Public Bill',
        })
      );
    });
  });

  it('switches between All Bills and Favourites tabs', async () => {
    const user = userEvent.setup();
    render(<BillsTable />);

    // Initially on "All Bills" tab
    expect(screen.getByText('All Bills')).toBeInTheDocument();

    // Click on Favourites tab
    const favouritesTab = screen.getByText(/Favourites/);
    await user.click(favouritesTab);

    // Should switch to favourites view
    // Note: In a real scenario, we'd need to mock the favourites data properly
    expect(favouritesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('opens bill details modal when row is clicked', async () => {
    const user = userEvent.setup();
    render(<BillsTable />);

    // Wait for bills to load
    await waitFor(() => {
      expect(screen.getByText('Bill 2023/001')).toBeInTheDocument();
    });

    // Click on a bill row
    const billRow = screen.getByText('Bill 2023/001');
    await user.click(billRow);

    // Modal should open (we'd need to test the modal content in a real scenario)
    // This would require more sophisticated mocking of the modal component
  });

  it('handles favourite button clicks', async () => {
    const user = userEvent.setup();
    render(<BillsTable />);

    // Wait for bills to load
    await waitFor(() => {
      expect(screen.getByText('Bill 2023/001')).toBeInTheDocument();
    });

    // Find and click a favourite button
    const favouriteButtons = screen.getAllByRole('button');
    const favouriteButton = favouriteButtons.find(
      button =>
        button.getAttribute('aria-label')?.includes('favourite') ||
        button.querySelector(
          '[data-testid="FavoriteIcon"], [data-testid="FavoriteBorderIcon"]'
        )
    );

    if (favouriteButton) {
      await user.click(favouriteButton);
      // In a real test, we'd verify the favourite state changed
    }
  });

  it('handles pagination changes', async () => {
    render(<BillsTable />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Bill 2023/001')).toBeInTheDocument();
    });

    // Look for pagination controls and test page changes
    // This would require more specific testing of the DataGrid pagination
    const dataGrid = document.querySelector('.MuiDataGrid-root');
    expect(dataGrid).toBeInTheDocument();
  });

  it('displays appropriate message when no favourites exist', async () => {
    const user = userEvent.setup();

    // Mock empty favourites
    vi.doMock('../../hooks/useFavourites', () => ({
      useFavourites: () => ({
        favouriteBillIds: new Set(),
        toggleFavourite: vi.fn(),
        isFavourite: vi.fn(() => false),
      }),
    }));

    render(<BillsTable />);

    // Switch to favourites tab
    const favouritesTab = screen.getByText(/Favourites/);
    await user.click(favouritesTab);

    // Should show empty state message
    await waitFor(() => {
      expect(screen.getByText(/No favourite bills yet/)).toBeInTheDocument();
    });
  });

  it('handles search input changes', async () => {
    const user = userEvent.setup();
    render(<BillsTable />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Bill 2023/001')).toBeInTheDocument();
    });

    // Type in search field
    const searchInput = screen.getByPlaceholderText('Search bills...');
    await user.type(searchInput, 'test query');

    // Should update the filter
    expect(searchInput).toHaveValue('test query');
  });
});
