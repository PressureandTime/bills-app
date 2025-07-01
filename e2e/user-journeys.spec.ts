import { test, expect } from '@playwright/test';
import { BillsTablePage } from './pages/BillsTablePage';
import { BillDetailsModalPage } from './pages/BillDetailsModalPage';
import { setupApiMocking } from './utils/testHelpers';

test.describe('User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocking(page);
  });

  test('should open and close bill details modal', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);
    const modalPage = new BillDetailsModalPage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    // Click View Details button
    await billsTablePage.getViewDetailsButtons().first().click();

    // Verify modal opens
    await modalPage.waitForModalOpen();
    await expect(modalPage.getModal()).toBeVisible();

    // Close modal
    await modalPage.closeModal();
    await modalPage.waitForModalClose();
  });

  test('should switch tabs in modal', async ({ page }) => {
    const billsTablePage = new BillsTablePage(page);
    const modalPage = new BillDetailsModalPage(page);

    await billsTablePage.goto();
    await billsTablePage.waitForTableDataToLoad();

    // Open modal
    await billsTablePage.getViewDetailsButtons().first().click();
    await modalPage.waitForModalOpen();

    // Switch to Gaeilge tab
    await modalPage.getGaeilgeTab().click();
    await modalPage.assertGaeilgeTabIsActive();

    // Switch back to English tab
    await modalPage.getEnglishTab().click();
    await modalPage.assertEnglishTabIsActive();

    // Close modal
    await modalPage.closeModal();
    await modalPage.waitForModalClose();
  });
});
