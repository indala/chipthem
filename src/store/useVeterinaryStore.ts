'use client';

import { create } from 'zustand';
import { VeterinaryClinic } from '@/types/veterinaries';

interface VeterinaryState {
  veterinary: VeterinaryClinic | null;
  isLoading: boolean;
  error: string | null;
  fetchVeterinaryData: () => Promise<void>;
}

export const useVeterinaryStore = create<VeterinaryState>((set) => ({
  veterinary: null,
  isLoading: false,
  error: null,
  fetchVeterinaryData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/veterinary/me');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch veterinary data');
      }
      const data = await response.json();
      set({ veterinary: data.veterinary, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching veterinary data:", errorMessage);
    }
  },
}));
