import { create } from "zustand";

interface DashboardStats {
  totalOwners: number;
  totalVeterinaries: number;
  totalPets: number;
  pendingOwnerVerifications: number;
  pendingVetVerifications: number;
  lostReports: number;
  foundReports: number;
}

interface AdminDashboardStore {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
}

export const useAdminDashboardStore = create<AdminDashboardStore>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to load stats");

      const data = await res.json();

      set({
        stats: data.stats,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: "Failed to load dashboard stats", loading: false });
    }
  },
}));
