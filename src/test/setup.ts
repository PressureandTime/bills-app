import '@testing-library/jest-dom';
import { vi, afterEach, beforeAll, afterAll } from 'vitest';
import React from 'react';

// Note: IntersectionObserver and ResizeObserver types are available from DOM lib
// We only need to mock the implementations using vi.stubGlobal

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, columns, loading, error, ...props }: any) => {
    if (error) {
      return React.createElement(
        'div',
        { 'data-testid': 'mocked-datagrid-error' },
        'DataGrid Error'
      );
    }
    if (loading) {
      return React.createElement(
        'div',
        { 'data-testid': 'mocked-datagrid-loading' },
        'Loading...'
      );
    }
    return React.createElement(
      'div',
      { 'data-testid': 'mocked-datagrid', ...props },
      React.createElement(
        'div',
        null,
        `Mocked DataGrid with ${rows?.length || 0} rows and ${columns?.length || 0} columns`
      )
    );
  },
  GridColDef: {},
  GridRowParams: {},
  GridPaginationModel: {},
  GridToolbar: () =>
    React.createElement(
      'div',
      { 'data-testid': 'mocked-grid-toolbar' },
      'Mocked Toolbar'
    ),
}));

const MockIntersectionObserver = vi
  .fn()
  .mockImplementation((callback?: IntersectionObserverCallback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

const MockResizeObserver = vi
  .fn()
  .mockImplementation((callback: ResizeObserverCallback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.stubGlobal('ResizeObserver', MockResizeObserver);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

class MockURLSearchParams {
  private params: Map<string, string>;

  constructor(init?: string | Record<string, string> | URLSearchParams) {
    this.params = new Map();

    if (typeof init === 'string') {
      const pairs = init.replace(/^\?/, '').split('&');
      pairs.forEach(pair => {
        if (pair) {
          const [key, value] = pair.split('=');
          this.params.set(
            decodeURIComponent(key),
            decodeURIComponent(value || '')
          );
        }
      });
    } else if (init && typeof init === 'object') {
      if (init instanceof MockURLSearchParams) {
        init.forEach((value, key) => {
          this.params.set(key, value);
        });
      } else {
        Object.entries(init).forEach(([key, value]) => {
          this.params.set(key, String(value));
        });
      }
    }
  }

  get size(): number {
    return this.params.size;
  }

  set(key: string, value: string): void {
    this.params.set(key, value);
  }

  get(key: string): string | null {
    return this.params.get(key) || null;
  }

  getAll(key: string): string[] {
    const value = this.params.get(key);
    return value ? [value] : [];
  }

  has(key: string): boolean {
    return this.params.has(key);
  }

  delete(key: string): void {
    this.params.delete(key);
  }

  append(key: string, value: string): void {
    if (this.params.has(key)) {
      const existing = this.params.get(key);
      this.params.set(key, `${existing},${value}`);
    } else {
      this.params.set(key, value);
    }
  }

  entries(): IterableIterator<[string, string]> {
    return this.params.entries();
  }

  keys(): IterableIterator<string> {
    return this.params.keys();
  }

  values(): IterableIterator<string> {
    return this.params.values();
  }

  forEach(
    callback: (value: string, key: string, parent: URLSearchParams) => void
  ): void {
    this.params.forEach((value, key) => {
      callback(value, key, this as any);
    });
  }

  toString(): string {
    return Array.from(this.params.entries())
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }

  sort(): void {
    const sorted = new Map([...this.params.entries()].sort());
    this.params.clear();
    sorted.forEach((value, key) => {
      this.params.set(key, value);
    });
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.params.entries();
  }
}

vi.stubGlobal('URLSearchParams', MockURLSearchParams);

afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});
