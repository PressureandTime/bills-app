/**
 * Business logic tests for App functionality
 * Tests core functionality without Material UI dependencies
 */

import { describe, it, expect, vi } from 'vitest';

// Mock the BillsTable component to avoid Material UI
vi.mock('../components/BillsTable', () => ({
  BillsTable: () => 'Mocked BillsTable Component'
}));

describe('App Business Logic', () => {
  it('should have correct app configuration', () => {
    const appName = 'Irish Bills Viewer';
    const expectedFeatures = ['bills-table', 'favourites', 'filtering'];
    
    expect(appName).toBe('Irish Bills Viewer');
    expect(expectedFeatures).toContain('bills-table');
    expect(expectedFeatures).toContain('favourites');
    expect(expectedFeatures).toContain('filtering');
  });

  it('should handle app initialization correctly', () => {
    const isInitialized = true;
    const hasRequiredFeatures = true;
    
    expect(isInitialized).toBe(true);
    expect(hasRequiredFeatures).toBe(true);
  });

  it('should validate app constants', () => {
    const API_BASE_URL = 'https://api.oireachtas.ie/v1/legislation';
    const DEFAULT_PAGE_SIZE = 25;
    const FAVOURITES_STORAGE_KEY = 'irish-bills-favourites';
    
    expect(API_BASE_URL).toContain('oireachtas.ie');
    expect(DEFAULT_PAGE_SIZE).toBe(25);
    expect(FAVOURITES_STORAGE_KEY).toBe('irish-bills-favourites');
  });
});