import { create } from "zustand";
import { supabaseClient } from "@/lib/supabaseClient";
import { VeterinaryClinic } from "@/types/veterinaries";

interface SupabasePayload<T> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T | null;
  old: T | null;
}

interface VeterinariesState {
  veterinaries: VeterinaryClinic[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;

  fetchVeterinaries: (reset?: boolean) => Promise<void>;
  subscribeRealtime: () => () => void;
  verifyVeterinary: (vetId: string) => Promise<void>;
  rejectVeterinary: (vetId: string) => Promise<void>;
}

export const useVeterinariesStore = create<VeterinariesState>((set, get) => ({
  veterinaries: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,

  // --- Fetch paginated veterinary clinics ---
  fetchVeterinaries: async (reset = false) => {
    if (get().loading) return;
    set({ loading: true, error: null });

    const page = reset ? 1 : get().page;

    try {
      const res = await fetch(`/api/admin/veterinary?page=${page}`);
      const data = await res.json();

      if (data.success) {
        set({
          veterinaries: reset
            ? data.veterinary_clinics
            : [...get().veterinaries, ...data.veterinary_clinics],
          page: page + 1,
          hasMore: data.pagination?.hasMore ?? false,
          loading: false,
        });
      } else {
        set({ loading: false, error: data.message });
      }
    } catch (err) {
      console.error("❌ Fetch veterinarians failed:", err);
      set({ loading: false, error: "Failed to fetch veterinarians." });
    }
  },

  // --- Verify veterinary (MODIFIED to remove from list) ---
  verifyVeterinary: async (vetId: string) => {
    try {
      const res = await fetch(`/api/admin/veterinary/${vetId}/verify`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      // Filter the verified veterinary clinic out of the current list
      set({
        veterinaries: get().veterinaries.filter((v) => v.id !== vetId),
      });

      console.log("✅ Veterinary verified:", data.message);
    } catch (err) {
      console.error("❌ Verify veterinary failed:", err);
    }
  },

  // --- Reject veterinary (UNMODIFIED: already removes the clinic) ---
  rejectVeterinary: async (vetId: string) => {
    try {
      const res = await fetch(`/api/admin/veterinary/${vetId}/reject`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      set({
        veterinaries: get().veterinaries.filter((v) => v.id !== vetId),
      });

      console.log("🗑️ Veterinary rejected:", data.message);
    } catch (err) {
      console.error("❌ Reject veterinary failed:", err);
    }
  },

  // --- Supabase Realtime Sync ---
  subscribeRealtime: () => {
    const handleVetChange = (payload: SupabasePayload<VeterinaryClinic>) => {
      const { eventType, new: newVet, old: oldVet } = payload;
      const veterinaries = [...get().veterinaries];

      switch (eventType) {
        case "INSERT":
          if (newVet && !veterinaries.some((v) => v.id === newVet.id)) {
            set({ veterinaries: [newVet, ...veterinaries] });
          }
          break;
        case "UPDATE":
          if (newVet) {
            set({
              veterinaries: veterinaries.map((v) =>
                v.id === newVet.id ? { ...v, ...newVet } : v
              ),
            });
          }
          break;
        case "DELETE":
          if (oldVet) {
            set({
              veterinaries: veterinaries.filter((v) => v.id !== oldVet.id),
            });
          }
          break;
      }
    };

    const vetsChannel = supabaseClient
      .channel("realtime:veterinary_clinics")
      .on(
        "system",
        { event: "postgres_changes", schema: "public", table: "veterinary_clinics" },
        handleVetChange
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(vetsChannel);
    };
  },
}));