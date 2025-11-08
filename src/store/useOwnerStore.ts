
import { create } from 'zustand';

// Define the structure of the owner and pet data
interface Owner {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  // Add any other owner-related fields you expect from the API
}

interface Pet {
  id: string;
  name: string;
  pet_type: string;
  microchip_number: string;
  owner_id: string;
  // Add any other pet-related fields
}

// Define the state structure for the store
interface OwnerState {
  owner: Owner | null;
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchOwnerData: () => Promise<void>;
}

export const useOwnerStore = create<OwnerState>((set) => ({
  // Initial state
  owner: null,
  pets: [],
  isLoading: false,
  error: null,

  // Action to fetch data from the API
  fetchOwnerData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/owner/me');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch owner data');
      }
      const data = await response.json();
      set({ owner: data.owner, pets: data.pets, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching owner data:", errorMessage);
    }
  },
}));
