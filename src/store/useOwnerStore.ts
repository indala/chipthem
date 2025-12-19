import { create } from 'zustand';
import type { Owner, Pet } from '@/types/owners'; 

interface OwnerState {
  owner: Owner | null;
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchOwnerData: () => Promise<void>;
  updateOwner: (ownerId: string, data: Partial<Owner>) => Promise<void>;
  updatePet: (petId: string, data: Partial<Pet>) => Promise<void>;
  updatePassword: (
    ownerId: string,
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

export const useOwnerStore = create<OwnerState>((set, get) => ({
  owner: null,
  pets: [],
  isLoading: false,
  error: null,

  fetchOwnerData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('/api/owner/me', {});
      const data = await response.json();
      set({
        owner: data.owner as Owner,
        pets: data.pets as Pet[],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching owner data:', errorMessage);
    }
  },

  updateOwner: async (ownerId: string, data: Partial<Owner>) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest(`/api/owner/${ownerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await get().fetchOwnerData();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating owner:', errorMessage);
    }
  },

  updatePet: async (petId: string, data: Partial<Pet>) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest(`/api/pet/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await get().fetchOwnerData();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating pet:', errorMessage);
    }
  },

  updatePassword: async (
    ownerId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest(`/api/owner/${ownerId}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Password update failed';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating password:', errorMessage);
    }
  },
}));
