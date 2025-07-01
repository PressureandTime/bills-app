import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to app root
  async goto() {
    await this.page.goto('/');
  }

  // Wait for network idle
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Wait for element visibility
  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  // Main data grid locator
  getDataGrid(): Locator {
    return this.page.locator('[data-testid="bills-data-grid"]');
  }

  // Loading indicator locator
  getLoadingIndicator(): Locator {
    return this.page.locator('text=Loading...');
  }
}
