import { useState, useCallback } from 'react';

export interface UseTabManagementReturn {
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  changeTab: (event: React.SyntheticEvent, newValue: number) => void;
  isAllBillsTab: boolean;
  isFavouritesTab: boolean;
}

// tab switching logic
export function useTabManagement(
  initialTab: number = 0
): UseTabManagementReturn {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const changeTab = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
    },
    []
  );

  const isAllBillsTab = currentTab === 0;
  const isFavouritesTab = currentTab === 1;

  return {
    currentTab,
    setCurrentTab,
    changeTab,
    isAllBillsTab,
    isFavouritesTab,
  };
}
