# Irish Bills Viewer

**Frontend Engineer Assessment - React TypeScript Application**

A modern web application for browsing and viewing Irish legislation bills from the Oireachtas API. Built with React, TypeScript, and Material UI, this application demonstrates professional software development practices including state management, API integration, responsive design, and comprehensive testing.

![Irish Bills Viewer](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue) ![Material_UI](https://img.shields.io/badge/Material_UI-6.1.10-purple) ![Vite](https://img.shields.io/badge/Vite-6.0.1-green)

## 🚀 Features

### Core Functionality

- **📋 Bills Table**: Paginated table displaying bill information with sorting capabilities
- **🔍 Advanced Filtering**: Filter bills by type with real-time search functionality
- **📄 Bill Details Modal**: Tabbed interface showing English and Irish language titles
- **⭐ Favourites System**: Mark bills as favourites with localStorage persistence
- **📊 Separate Favourites View**: Dedicated tab for viewing all favourited bills

### Technical Features

- **🎨 Material UI Design System**: Professional, accessible interface components
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔄 Real-time State Management**: React hooks with optimistic updates
- **🧪 Comprehensive Testing**: Unit tests demonstrating testing best practices
- **🔧 Development Tools**: ESLint, Prettier, and TypeScript for code quality
- **⚡ Modern Build System**: Vite for fast development and optimized production builds

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **UI Library**: Material UI 6.1.10 with custom theming
- **Data Grid**: Material UI X DataGrid for advanced table functionality
- **Build Tool**: Vite 6.0.1 for fast development and building
- **Testing**: Vitest + React Testing Library + Jest DOM
- **Code Quality**: ESLint + Prettier with TypeScript configurations
- **API**: Irish Oireachtas API (https://api.oireachtas.ie/)

## 📋 Requirements Fulfilled

### Functional Requirements ✅

- [x] **Table Component**: Paginated bills table with bill number, type, status, and sponsor columns
- [x] **Filtering**: Filter bills by bill type field
- [x] **Modal Window**: Click bill rows to open modal with tabbed English/Irish titles
- [x] **Favourites System**: Add/remove bills from favourites with UI state changes
- [x] **Favourites Persistence**: State persisted to localStorage with mocked server calls
- [x] **Console Logging**: Favourite/unfavourite actions logged to console
- [x] **Favourites Tab**: Separate view displaying all favourited bills

### Non-Functional Requirements ✅

- [x] **React Best Practices**: Modern hooks, proper state management, component composition
- [x] **UI Design System**: Consistent Material UI components with custom theming
- [x] **Component Styling**: Professional styling with responsive design principles
- [x] **Unit Testing**: Comprehensive test suite for main table component
- [x] **TypeScript**: Strong typing throughout the application
- [x] **Code Quality Tools**: ESLint and Prettier configurations for consistent code style

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)

### Installation

1. **Clone or Download the Repository**

   ```bash
   # If you have the repository URL:
   git clone <repository-url>
   cd irish-bills-viewer

   # If you have the project files:
   cd irish-bills-viewer
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

4. **Open Your Browser**

   Navigate to `http://localhost:5173` (Vite's default port)

## 📜 Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build production-ready application       |
| `npm run preview`       | Preview production build locally         |
| `npm run test`          | Run unit tests in watch mode             |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run lint`          | Check code for linting errors            |
| `npm run lint:fix`      | Fix automatic linting errors             |
| `npm run format`        | Format code with Prettier                |
| `npm run format:check`  | Check if code formatting is correct      |

## 🏗️ Project Structure

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

## 🔧 Development

### Code Quality

The project enforces code quality through:

- **TypeScript**: Strong typing prevents runtime errors
- **ESLint**: Identifies and prevents common code issues
- **Prettier**: Ensures consistent code formatting
- **Pre-commit Hooks**: Could be added for automatic quality checks

### Testing Strategy

- **Unit Tests**: Component-level testing with React Testing Library
- **Mocking**: API calls and hooks mocked for isolated testing
- **Coverage**: Comprehensive test coverage for critical components
- **Best Practices**: Following testing library recommended patterns

### API Integration

The application integrates with the Irish Oireachtas API:

- **Endpoint**: `https://api.oireachtas.ie/v1/legislation`
- **Features**: Pagination, filtering, error handling
- **Data Transformation**: API responses transformed to application models
- **Error Handling**: Graceful error handling with user feedback

## 📱 User Interface

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

## 🧪 Testing

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

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

### Deployment Options

The built application can be deployed to:

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop deployment
- **GitHub Pages**: Free static hosting
- **AWS S3**: Cloud storage with CloudFront
- **Any static hosting provider**

## 🔍 API Documentation

### Oireachtas API

The application uses the Irish Oireachtas API to fetch legislation data:

- **Base URL**: `https://api.oireachtas.ie/v1/legislation`
- **Format**: JSON
- **Documentation**: Available at the API website
- **Rate Limiting**: Standard rate limits apply
- **CORS**: API supports cross-origin requests

### Data Models

The application defines comprehensive TypeScript types for:

- Bill entities
- API responses
- Filter parameters
- Pagination models
- Application state

## 🤝 Contributing

### Development Workflow

1. **Code Changes**: Follow TypeScript and React best practices
2. **Testing**: Add/update tests for new features
3. **Linting**: Run `npm run lint:fix` before committing
4. **Formatting**: Code is automatically formatted with Prettier

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: JSDoc comments for functions and complex logic

## 📄 License

This project is created for the Frontend Engineer Assessment and is for evaluation purposes.

## 🙋‍♂️ Support

For questions about this assessment project, please refer to the code comments and documentation provided throughout the application.

---

**Built with ❤️ for the Frontend Engineer Assessment**
