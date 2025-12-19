import { create } from 'zustand';
import type { Pet, Owner } from '@/types/owners';
import type { VeterinaryClinic } from '@/types/veterinaries';
import type {
  LostReportAnalytics,
  FoundReportAnalytics
} from '@/types/analytics';

interface AnalyticsData {
  pets: Pet[];
  lostReports: LostReportAnalytics[];
  foundReports: FoundReportAnalytics[];
  owners: Owner[];
  vets: VeterinaryClinic[];
}

interface AnalyticsStore {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;

  fetchAnalytics: () => Promise<void>;
}

export const useAdminAnalyticsStore = create<AnalyticsStore>((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch('/api/admin/analytics', { cache: 'no-store' });

      if (!res.ok) throw new Error('Failed to load analytics data');

      const data = await res.json();

      set({
        analytics: {
          pets: data.pets || [],
          lostReports: data.lostReports || [],
          foundReports: data.foundReports || [],
          owners: data.owners || [],
          vets: data.vets || []
        },
        loading: false
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
      set({
        error: 'Unable to load analytics data',
        loading: false
      });
    }
  }
}));
