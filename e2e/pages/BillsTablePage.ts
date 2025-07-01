import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillsTablePage extends BasePage {
  // Main data grid
  getDataGrid(): Locator {
    return this.page
      .locator('[data-testid="bills-table"], [data-testid="bills-data-grid"]')
      .first();
  }

  // Tabs
  getAllBillsTab(): Locator {
    return this.page.locator('[role="tab"]').filter({ hasText: 'All Bills' });
  }

  getFavouritesTab(): Locator {
    return this.page.locator('[role="tab"]').filter({ hasText: 'Favourites' });
  }

  // Filters and controls
  getBillTypeFilter(): Locator {
    return this.page.locator('text=Bill Type').locator('..');
  }

  getSearchField(): Locator {
    return this.page.locator('input[placeholder="Search bills..."]');
  }

  // Table rows
  getTableRows(): Locator {
    return this.page.locator(
      '[data-testid="bills-table"] .MuiDataGrid-row, [data-testid="bills-data-grid"] .MuiDataGrid-row'
    );
  }

  getFirstTableRow(): Locator {
    return this.page
      .locator(
        '[data-testid="bills-table"] .MuiDataGrid-row, [data-testid="bills-data-grid"] .MuiDataGrid-row'
      )
      .first();
  }

  // Action buttons
  getViewDetailsButtons(): Locator {
    return this.page.getByRole('button', { name: 'View Details' });
  }

  getFavouriteButtons(): Locator {
    return this.page.getByRole('button', { name: /.*Favourites/ });
  }

  // Enhanced table interaction methods
  async getTableRowCount(): Promise<number> {
    return await this.getTableRows().count();
  }

  getTableRowByText(text: string): Locator {
    return this.getTableRows().filter({ hasText: text });
  }

  async waitForRowCount(expectedCount: number, timeout = 5000) {
    await expect(this.getTableRows()).toHaveCount(expectedCount, { timeout });
  }

  async assertRowContainsText(text: string): Promise<void> {
    await expect(this.getTableRowByText(text)).toBeVisible();
  }

  async assertRowNotContainsText(text: string): Promise<void> {
    await expect(this.getTableRowByText(text)).not.toBeVisible();
  }

  async waitForTableDataToLoad(): Promise<void> {
    // Wait for table element to be visible
    await this.page.waitForSelector(
      '[data-testid="bills-table"], [data-testid="bills-data-grid"]',
      {
        state: 'visible',
        timeout: 3000,
      }
    );

    // Wait for loading to complete - either data rows appear or table is ready
    await this.page.waitForFunction(
      () => {
        const table =
          document.querySelector('[data-testid="bills-table"]') ||
          document.querySelector('[data-testid="bills-data-grid"]');
        if (!table) return false;

        // Check if loading overlay is hidden
        const loadingOverlay = table.querySelector('.MuiDataGrid-overlay');
        const isLoading =
          loadingOverlay && getComputedStyle(loadingOverlay).display !== 'none';

        return !isLoading;
      },
      { timeout: 3000 }
    );
  }

  // Actions
  async waitForTableLoad() {
    await this.waitForElement('[data-testid="bills-table"]');
    await this.page.waitForTimeout(1000);
  }

  async clickFavouritesTab() {
    await this.getFavouritesTab().click();
  }

  async searchBills(searchTerm: string) {
    await this.getSearchField().fill(searchTerm);
  }
}
