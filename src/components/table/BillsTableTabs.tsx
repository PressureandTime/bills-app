import React from 'react';
import { Tabs, Tab } from '@mui/material';

export interface BillsTableTabsProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  favouritesCount: number;
}

export function BillsTableTabs({
  currentTab,
  onTabChange,
  favouritesCount,
}: BillsTableTabsProps) {
  return (
    <Tabs
      value={currentTab}
      onChange={onTabChange}
      aria-label="bills tabs"
      sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
    >
      <Tab label="All Bills" id="tab-0" aria-controls="tabpanel-0" />
      <Tab
        label={`Favourites (${favouritesCount})`}
        id="tab-1"
        aria-controls="tabpanel-1"
      />
    </Tabs>
  );
}
