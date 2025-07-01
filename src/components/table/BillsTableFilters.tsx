import React from 'react';
import {
  Stack,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import type { BillsFilter } from '../../types/bills';

export interface BillsTableFiltersProps {
  filter: BillsFilter;
  availableBillTypes: string[];
  onFilterChange: (newFilter: Partial<BillsFilter>) => void;
  visible?: boolean;
}

export function BillsTableFilters({
  filter,
  availableBillTypes,
  onFilterChange,
  visible = true,
}: BillsTableFiltersProps) {
  if (!visible) {
    return null;
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems="center"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterIcon color="action" />
        <Typography variant="body2" color="text.secondary">
          Filters:
        </Typography>
      </Box>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Bill Type</InputLabel>
        <Select
          value={filter.billType || ''}
          label="Bill Type"
          onChange={e =>
            onFilterChange({
              billType: e.target.value || undefined,
            })
          }
        >
          <MenuItem value="">All Types</MenuItem>
          {availableBillTypes.map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Search"
        placeholder="Search bills..."
        value={filter.searchTerm || ''}
        onChange={e =>
          onFilterChange({
            searchTerm: e.target.value || undefined,
          })
        }
        sx={{ minWidth: 200 }}
      />
    </Stack>
  );
}
