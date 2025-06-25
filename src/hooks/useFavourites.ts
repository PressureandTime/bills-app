/**
 * Custom hook for managing bill favourites state
 * Persists favourites to localStorage for data persistence across sessions
 */

import { useState, useEffect, useCallback } from 'react';
import type { FavouritesState } from '../types/bills';
import { toggleBillFavourite } from '../services/billsApi';

const FAVOURITES_STORAGE_KEY = 'irish-bills-favourites';

/**
 * Loads favourites from localStorage
 */
function loadFavouritesFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (stored) {
      const favouriteIds = JSON.parse(stored) as string[];
      return new Set(favouriteIds);
    }
  } catch (error) {
    console.error('Error loading favourites from localStorage:', error);
  }
  return new Set();
}

/**
 * Saves favourites to localStorage
 */
function saveFavouritesToStorage(favourites: Set<string>): void {
  try {
    const favouriteIds = Array.from(favourites);
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouriteIds));
  } catch (error) {
    console.error('Error saving favourites to localStorage:', error);
  }
}

/**
 * Custom hook for managing bill favourites
 */
export function useFavourites(): FavouritesState {
  const [favouriteBillIds, setFavouriteBillIds] = useState<Set<string>>(() =>
    loadFavouritesFromStorage()
  );

  // Save to localStorage whenever favourites change
  useEffect(() => {
    saveFavouritesToStorage(favouriteBillIds);
  }, [favouriteBillIds]);

  /**
   * Toggles the favourite status of a bill
   */
  const toggleFavourite = useCallback(
    async (billId: string): Promise<void> => {
      const wasAlreadyFavourite = favouriteBillIds.has(billId);
      const willBeFavourite = !wasAlreadyFavourite;

      try {
        // Optimistically update the UI first
        setFavouriteBillIds(prev => {
          const newSet = new Set(prev);
          if (willBeFavourite) {
            newSet.add(billId);
          } else {
            newSet.delete(billId);
          }
          return newSet;
        });

        // Make the API call (mocked for this assessment)
        await toggleBillFavourite(billId, willBeFavourite);

        console.log(
          `✅ Bill ${billId} ${willBeFavourite ? 'favourited' : 'unfavourited'} successfully`
        );
      } catch (error) {
        // Revert the optimistic update on error
        setFavouriteBillIds(prev => {
          const newSet = new Set(prev);
          if (wasAlreadyFavourite) {
            newSet.add(billId);
          } else {
            newSet.delete(billId);
          }
          return newSet;
        });

        console.error('Failed to toggle favourite:', error);
        throw error; // Re-throw so the UI can handle the error
      }
    },
    [favouriteBillIds]
  );

  /**
   * Checks if a bill is favourited
   */
  const isFavourite = useCallback(
    (billId: string): boolean => {
      return favouriteBillIds.has(billId);
    },
    [favouriteBillIds]
  );

  return {
    favouriteBillIds,
    toggleFavourite,
    isFavourite,
  };
}

/**
 * Hook for getting just the favourite bill IDs as an array
 */
export function useFavouriteBillIds(): string[] {
  const { favouriteBillIds } = useFavourites();
  return Array.from(favouriteBillIds);
}
