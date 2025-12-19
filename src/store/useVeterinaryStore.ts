'use client';

import { create } from 'zustand';
import type { VeterinaryClinic } from '@/types/veterinaries';

interface VeterinaryState {
  veterinary: VeterinaryClinic | null;
  isLoading: boolean;
  error: string | null;

  fetchVeterinaryData: () => Promise<void>;
  updateVeterinary: (clinicId: string, data: Partial<VeterinaryClinic>) => Promise<void>;
  updatePassword: (
    clinicId: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const apiRequest = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  return response;
};

export const useVeterinaryStore = create<VeterinaryState>((set, get) => ({
  veterinary: null,
  isLoading: false,
  error: null,

  // ✅ Fetch logged-in veterinary clinic data
  fetchVeterinaryData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('/api/veterinary/me', {});
      const data = await response.json();

      set({
        veterinary: data.veterinary as VeterinaryClinic,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching veterinary data:', errorMessage);
    }
  },

  // ✅ Update clinic details
  updateVeterinary: async (clinicId: string, data: Partial<VeterinaryClinic>) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest(`/api/veterinary/${clinicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      await get().fetchVeterinaryData();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating veterinary clinic:', errorMessage);
    }
  },

  // ✅ Update clinic password
  updatePassword: async (
    clinicId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest(`/api/veterinary/${clinicId}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Password update failed';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating veterinary password:', errorMessage);
    }
  },
}));