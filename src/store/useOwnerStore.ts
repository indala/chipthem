import { create } from 'zustand';
import type { Owner, Pet } from '@/types/owners'; 

interface OwnerState {
  owner: Owner | null;
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchOwnerData: () => Promise<void>;
}

export const useOwnerStore = create<OwnerState>((set) => ({
  owner: null,
  pets: [],
  isLoading: false,
  error: null,

  fetchOwnerData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/owner/me');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch owner data');
      }
      const data = await response.json();

      set({
        owner: data.owner as Owner,
        pets: data.pets as Pet[],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching owner data:", errorMessage);
    }
  },
}));
