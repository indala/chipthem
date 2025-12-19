'use client';

import { create } from 'zustand';

export interface ClinicAPIResponse {
  id: string;
  name: string;
  website: string | null;
  google_maps_url: string | null;
  address: string;
  city: string | null;
  state_province: string | null;
  phone: string | null;
  hours: string | null;
  lat: number;
  lng: number;
  services: string[];
  is_24h: boolean;
}

interface ClinicsStore {
  clinics: ClinicAPIResponse[];
  loading: boolean;
  error: string | null;
  fetchClinics: () => Promise<void>;
}

export const useClinicsStore = create<ClinicsStore>((set) => ({
  clinics: [],
  loading: false,
  error: null,

  fetchClinics: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/clinics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch clinics (${response.status})`);
      }

      const data = (await response.json()) as ClinicAPIResponse[];

      set({
        clinics: data,
        loading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';

      set({
        error: errorMessage,
        loading: false,
      });
    }
  },
}));
