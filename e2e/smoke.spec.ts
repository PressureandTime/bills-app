import { test, expect } from '@playwright/test';
import { BillsTablePage } from './pages/BillsTablePage';
import { setupApiMocking } from './utils/testHelpers';

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocking(page);
  });

  test('application loads successfully', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForLoad();

    const appContent = page.locator('#root');
    await expect(appContent).toBeVisible();
  });

  test('core components are visible', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const table = billsTablePage.getDataGrid();
    await expect(table).toBeVisible();

    const allBillsTab = billsTablePage.getAllBillsTab();
    const favouritesTab = billsTablePage.getFavouritesTab();

    await expect(allBillsTab).toBeVisible();
    await expect(favouritesTab).toBeVisible();
  });

  test('search functionality is available', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    const searchField = billsTablePage.getSearchField();
    await expect(searchField).toBeVisible();
  });
});
