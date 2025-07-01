import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillDetailsModalPage extends BasePage {
  getModal(): Locator {
    return this.page.locator('[role="dialog"]');
  }

  getCloseButton(): Locator {
    return this.page.locator('[aria-label="close"]');
  }

  getEnglishTab(): Locator {
    return this.page.locator('[role="tab"]').filter({ hasText: 'English' });
  }

  getGaeilgeTab(): Locator {
    return this.page.locator('[role="tab"]').filter({ hasText: 'Gaeilge' });
  }
  getEnglishTabSelected(): Locator {
    return this.page
      .locator('[role="tab"][aria-selected="true"]')
      .filter({ hasText: 'English' });
  }

  getGaeilgeTabSelected(): Locator {
    return this.page
      .locator('[role="tab"][aria-selected="true"]')
      .filter({ hasText: 'Gaeilge' });
  }

  async assertEnglishTabIsActive(): Promise<void> {
    await expect(this.getEnglishTabSelected()).toBeVisible();
  }

  async assertGaeilgeTabIsActive(): Promise<void> {
    await expect(this.getGaeilgeTabSelected()).toBeVisible();
  }

  async waitForTabContent(tabName: 'English' | 'Gaeilge'): Promise<void> {
    if (tabName === 'English') {
      await expect(this.getEnglishTabSelected()).toBeVisible();
      await this.page.waitForSelector('[role="tabpanel"] *', {
        state: 'visible',
        timeout: 5000,
      });
    } else {
      await expect(this.getGaeilgeTabSelected()).toBeVisible();
      await this.page.waitForSelector('[role="tabpanel"] *', {
        state: 'visible',
        timeout: 5000,
      });
    }
  }

  getBillTitle(): Locator {
    return this.page.locator('[role="dialog"] h4');
  }

  async assertModalContainsText(text: string): Promise<void> {
    await expect(this.getModal()).toContainText(text);
  }

  async assertModalIsVisible(): Promise<void> {
    await expect(this.getModal()).toBeVisible();
  }

  async assertModalIsHidden(): Promise<void> {
    await expect(this.getModal()).not.toBeVisible();
  }
  async waitForModalOpen() {
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' });
  }

  async closeModal() {
    await this.getCloseButton().click();
  }

  async waitForModalClose() {
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' });
  }
}
