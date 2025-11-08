'use client';

import { create } from 'zustand';

interface Veterinary {
  id: string;
  clinic_name: string;
  contact_person: string | null;
  email: string;
  phone: string | null;
  alt_phone: string | null;
  website: string | null;
  license_number: string | null;
  years_in_practice: number | null;
  specializations: string[] | null;
  additional_services: string[] | null;
  microchip_services: boolean | null;
  has_microchip_scanners: boolean | null;
  scanner_types: string[] | null;
  street_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country: string | null;
  operating_hours: string | null;
  provides_24h_emergency: boolean | null;
  is_verified: boolean | null;
  status: string | null;
}

interface VeterinaryState {
  veterinary: Veterinary | null;
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
