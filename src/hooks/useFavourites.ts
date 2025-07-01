

import { useState, useEffect, useCallback } from 'react';
import type { FavouritesState } from '../types/bills';
import { toggleBillFavourite } from '../services/billsApi';

const FAVOURITES_STORAGE_KEY = 'irish-bills-favourites';


// load favourites from local storage
function loadFavourites(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (stored) {
      const favouriteIds = JSON.parse(stored) as string[];
      return new Set(favouriteIds);
    }
  } catch (error) {
    console.error('Failed to load favourites:', error);
  }
  return new Set();
}


function saveFavourites(favourites: Set<string>): void {
  try {
    const favouriteIds = Array.from(favourites);
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouriteIds));
  } catch (error) {
    console.error('Failed to save favourites:', error);
  }
}


export function useFavourites(): FavouritesState {
  const [favouriteBillIds, setFavouriteBillIds] = useState<Set<string>>(() =>
    loadFavourites()
  );


  useEffect(() => {
    saveFavourites(favouriteBillIds);
  }, [favouriteBillIds]);
  const toggleFavourite = useCallback(
    async (billId: string): Promise<void> => {
      const wasFavourite = favouriteBillIds.has(billId);
      const nowFavourite = !wasFavourite;

      try {
        setFavouriteBillIds(prev => {
          const newSet = new Set(prev);
          if (nowFavourite) {
            newSet.add(billId);
          } else {
            newSet.delete(billId);
          }
          return newSet;
        });

        await toggleBillFavourite(billId, nowFavourite);


      } catch (error) {
        setFavouriteBillIds(prev => {
          const newSet = new Set(prev);
          if (wasFavourite) {
            newSet.add(billId);
          } else {
            newSet.delete(billId);
          }
          return newSet;
        });

        console.error('Failed to toggle favourite:', error);
        throw error;
      }
    },
    [favouriteBillIds]
  );
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


export function useFavouriteBillIds(): string[] {
  const { favouriteBillIds } = useFavourites();
  return Array.from(favouriteBillIds);
}
