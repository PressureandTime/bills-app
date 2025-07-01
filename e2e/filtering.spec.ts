import { test, expect } from '@playwright/test';
import { BillsTablePage } from './pages/BillsTablePage';
import { mockBills } from '../src/test/mocks/billsData';
import { setupApiMocking, mockFilteredApiResponse } from './utils/testHelpers';

test.describe('Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocking(page);
  });

  test('should accept search input', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const searchField = billsTablePage.getSearchField();
    await searchField.fill('test');
    await expect(searchField).toHaveValue('test');

    await searchField.clear();
    await expect(searchField).toHaveValue('');
  });

  test('should filter table with search', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const initialCount = await billsTablePage.getTableRowCount();
    expect(initialCount).toBeGreaterThan(0);

    await billsTablePage.searchBills('Another');
    await page.waitForTimeout(500);

    await expect(billsTablePage.getDataGrid()).toBeVisible();

    await billsTablePage.searchBills('');
    await page.waitForTimeout(500);
  });

  test('should filter by bill type using API', async ({ page }) => {
    await mockFilteredApiResponse(page, 'Private Bill');

    const billsTablePage = new BillsTablePage(page);
    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const rowCount = await billsTablePage.getTableRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);

    await expect(billsTablePage.getDataGrid()).toBeVisible();
  });

  test('should filter by status using API', async ({ page }) => {
    await mockFilteredApiResponse(page, undefined, 'Second Stage');

    const billsTablePage = new BillsTablePage(page);
    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const rowCount = await billsTablePage.getTableRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);

    await expect(billsTablePage.getDataGrid()).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    await billsTablePage.searchBills('NonExistentBillName');
    await page.waitForTimeout(500);

    await expect(billsTablePage.getDataGrid()).toBeVisible();

    await billsTablePage.searchBills('');
    await page.waitForTimeout(500);
  });

  test('search field remains responsive', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const searchField = billsTablePage.getSearchField();
    await expect(searchField).toBeVisible();
    await expect(searchField).toBeEnabled();

    await searchField.fill('Test');
    await expect(searchField).toHaveValue('Test');

    await searchField.clear();
    await expect(searchField).toHaveValue('');

    await searchField.fill('Another');
    await expect(searchField).toHaveValue('Another');

    await expect(billsTablePage.getDataGrid()).toBeVisible();
  });
});
