# Irish Bills Viewer

A React TypeScript application for browsing Irish legislation bills with search and filtering capabilities.

## Features

- Browse Irish legislation bills in a clean interface
- Search and filter bills by type and keywords
- View bill details in English and Irish (Gaeilge)
- Save favorite bills for later reference
- Responsive design for mobile and desktop

Data is sourced from the official Oireachtas API.

## Technology Stack

- **React 18 + TypeScript** - Frontend framework with type safety
- **Material UI** - Component library for consistent design
- **Vite** - Build tool and development server
- **Vitest + React Testing Library** - Unit testing framework
- **ESLint + Prettier** - Code linting and formatting

API integration with the [Irish Oireachtas API](https://api.oireachtas.ie/).

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

```bash
git clone <repository-url>
cd irish-bills-viewer
npm install
npm run dev
```

Open your browser to `http://localhost:5173`

## Available Scripts

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| `npm run dev`             | Start development server       |
| `npm run build`           | Build production application   |
| `npm run preview`         | Preview production build       |
| `npm run test`            | Run unit tests                 |
| `npm run test:coverage`   | Run tests with coverage report |
| `npm run test:e2e`        | Run Playwright e2e tests       |
| `npm run test:e2e:ui`     | Run Playwright tests with UI   |
| `npm run test:e2e:report` | View Playwright test report    |
| `npm run lint`            | Check code for linting errors  |
| `npm run lint:fix`        | Fix linting errors             |
| `npm run format`          | Format code with Prettier      |
| `npm run format:check`    | Check code formatting          |

## Project Structure

```
irish-bills-viewer/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── __tests__/    # Component tests
│   │   ├── BillsTable.tsx        # Main table component
│   │   └── BillDetailsModal.tsx  # Modal component
│   ├── hooks/            # Custom React hooks
│   │   └── useFavourites.ts     # Favourites state management
│   ├── services/         # API and external services
│   │   └── billsApi.ts          # Irish Oireachtas API client
│   ├── types/           # TypeScript type definitions
│   │   └── bills.ts            # Bill-related types
│   ├── test/           # Test configuration
│   │   └── setup.ts           # Test setup file
│   ├── App.tsx         # Main application component
│   └── main.tsx       # Application entry point
├── .eslintrc.js       # ESLint configuration
├── .prettierrc        # Prettier configuration
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite build configuration
└── package.json       # Dependencies and scripts
```

## Development

### Code Quality

Code quality is enforced through:

- TypeScript for strong typing
- ESLint for code linting
- Prettier for code formatting

### Testing

- Unit tests with React Testing Library
- Mocked API calls for isolated testing
- Coverage reports available

### API Integration

The application integrates with the Irish Oireachtas API:

- **Endpoint**: `https://api.oireachtas.ie/v1/legislation`
- **Features**: Pagination, filtering, error handling
- **Data Transformation**: API responses transformed to application models
- **Error Handling**: Graceful error handling with user feedback

## User Interface

### Design Principles

- **Material Design**: Following Material UI design principles
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Responsive**: Mobile-first responsive design
- **Performance**: Optimized rendering with pagination and virtualization

### Key Components

1. **Bills Table**:
   - Server-side pagination
   - Column sorting
   - Row selection and actions
   - Loading and error states

2. **Filters**:
   - Bill type dropdown
   - Real-time search
   - Clear filter options

3. **Bill Details Modal**:
   - Tabbed interface
   - English/Irish language toggle
   - Accessibility features

4. **Favourites System**:
   - Heart icon toggle
   - Persistent state
   - Separate favourites view

## Testing

Run the test suite:

```bash
# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test -- --run
```

### Test Coverage

The test suite covers:

- Component rendering
- User interactions
- API integration
- Error scenarios
- State management
- Accessibility features

## End-to-End Testing with Playwright

Comprehensive end-to-end testing with Playwright ensures the application works correctly across different browsers and user scenarios.

### What's Tested

The e2e tests cover:

- **Smoke tests** - Basic app loading and navigation
- **User journeys** - Complete workflows like searching and viewing bills
- **Filtering functionality** - All filter combinations and edge cases
- **Cross-browser compatibility** - Chrome, Firefox, and Safari
- **Accessibility** - Using @axe-core/playwright for a11y testing

### Running Tests

```bash
# Run all e2e tests (headless mode)
npm run test:e2e

# Run tests with interactive UI for debugging
npm run test:e2e:ui

# View the test report
npm run test:e2e:report
```

### Cross-Browser Testing

Tests run on three major browser engines:

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

This ensures compatibility across different browsers and catches browser-specific issues.

### Page Object Pattern

The tests use the page object pattern for maintainability:

```
e2e/
├── pages/                  # Page object models
│   ├── BasePage.ts        # Common functionality
│   ├── BillsTablePage.ts  # Main table interactions
│   └── BillDetailsModalPage.ts  # Modal interactions
├── fixtures/              # Test data
├── utils/                 # Test helpers
├── filtering.spec.ts      # Filter functionality tests
├── smoke.spec.ts         # Basic functionality tests
└── user-journeys.spec.ts # Complete user workflows
```

### Test Organization

- **Smoke tests** - Basic functionality verification
- **User journeys** - Complete workflows from start to finish
- **Filtering tests** - All filter combinations and scenarios
- **Fixtures** - Reusable test data for consistency

### Running Tests Locally

- Use `--ui` mode for test development and debugging
- Tests automatically start the development server
- HTML reports include screenshots and videos for failed tests
- Tests run in parallel for faster execution

### CI Integration

Configured for continuous integration with:

- Automatic retries on failure for stability
- HTML reports with screenshots and traces
- Parallel execution optimized for CI environments

## Deployment

### Building for Production

```bash
npm run build
```
