/**
 * Main App component for the Irish Bills Viewer
 * Frontend Engineer Assessment - React TypeScript with Material UI
 */

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { AccountBalance as ParliamentIcon } from '@mui/icons-material';
import { BillsTable } from './components/BillsTable';

// Create a custom theme with Irish-inspired colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Professional blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#388e3c', // Irish green
      light: '#66bb6a',
      dark: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

/**
 * Main App Component
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <ParliamentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Irish Bills Viewer
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Oireachtas Legislation Database
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bills Information
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Browse and search Irish legislation bills from the Oireachtas
            database. Click on any bill to view detailed information in both
            English and Irish.
          </Typography>
        </Box>

        {/* Bills Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <BillsTable />
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Data provided by the{' '}
            <a
              href="https://api.oireachtas.ie/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.palette.primary.main }}
            >
              Oireachtas API
            </a>{' '}
            • Built with React, TypeScript & Material UI
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
