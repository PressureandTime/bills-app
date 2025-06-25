/**
 * Modal component for displaying detailed bill information
 * Features tabbed interface for English and Irish language titles
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import type { BillDetailsModalProps } from '../types/bills';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Tab Panel component for the modal tabs
 */
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bill-tabpanel-${index}`}
      aria-labelledby={`bill-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Accessibility props for tabs
 */
function a11yProps(index: number) {
  return {
    id: `bill-tab-${index}`,
    'aria-controls': `bill-tabpanel-${index}`,
  };
}

/**
 * Bill Details Modal Component
 */
export function BillDetailsModal({
  bill,
  open,
  onClose,
}: BillDetailsModalProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!bill) return null;

  const sponsorDisplay = bill.sponsors?.[0]?.showAs || 'No sponsor information';
  const statusColor = getStatusColor(bill.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="bill-details-title"
      aria-describedby="bill-details-description"
    >
      <DialogTitle
        id="bill-details-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" gutterBottom>
            Bill Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bill.billNo}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        {/* Bill Overview */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle2">Bill Type</Typography>
              </Box>
              <Chip
                label={bill.billType}
                variant="outlined"
                color="primary"
                size="small"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Status</Typography>
              </Box>
              <Chip
                label={bill.status}
                variant="filled"
                color={statusColor}
                size="small"
              />
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="subtitle2">Sponsor</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {sponsorDisplay}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Language Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="bill language tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<LanguageIcon />}
              label="English"
              {...a11yProps(0)}
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<LanguageIcon />}
              label="Gaeilge"
              {...a11yProps(1)}
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {/* English Title Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box id="bill-details-description">
            <Typography variant="h6" gutterBottom color="primary">
              English Title
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {bill.englishTitle || 'No English title available'}
            </Typography>
            {bill.englishTitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block' }}
              >
                This is the official English language title of the bill.
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* Irish Title Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Teideal Gaeilge
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, fontStyle: 'italic' }}
            >
              {bill.irishTitle || 'Níl teideal Gaeilge ar fáil'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: 'block' }}
            >
              Seo é teideal oifigiúil na Gaeilge don bhille seo.
            </Typography>
          </Box>
        </TabPanel>

        {/* Additional Information */}
        {bill.uri && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Source URI:</strong> {bill.uri}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Helper function to get appropriate color for bill status
 */
function getStatusColor(
  status: string
):
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning' {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('passed') || statusLower.includes('enacted')) {
    return 'success';
  }
  if (statusLower.includes('rejected') || statusLower.includes('withdrawn')) {
    return 'error';
  }
  if (statusLower.includes('committee') || statusLower.includes('pending')) {
    return 'warning';
  }
  if (statusLower.includes('reading')) {
    return 'info';
  }

  return 'primary';
}
