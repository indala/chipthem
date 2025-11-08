import { create } from "zustand";
import { supabaseClient } from "@/lib/supabaseClient";
import { Pet } from "@/types/owners";

interface PetsState {
  pets: Pet[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchPets: (reset?: boolean) => Promise<void>;
  subscribeRealtime: () => () => void;
  verifyPet: (petId: string) => Promise<void>;
  rejectPet: (petId: string) => Promise<void>;
}

interface SupabasePayload<T> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T | null;
  old: T | null;
}


export const usePetsStore = create<PetsState>((set, get) => ({
  pets: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,

  fetchPets: async (reset = false) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    const page = reset ? 1 : get().page;

    try {
      const res = await fetch(`/api/admin/pets?page=${page}`);
      const data = await res.json();
      if (data.success) {
        set({
          pets: reset ? data.pets : [...get().pets, ...data.pets],
          page: page + 1,
          hasMore: data.pagination?.hasMore ?? false,
          loading: false,
        });
      } else set({ loading: false, error: data.message });
    } catch (err) {
      console.error("❌ Fetch pets failed:", err);
      set({ loading: false, error: "Failed to fetch pets." });
    }
  },

  verifyPet: async (petId: string) => {
    try {
      const res = await fetch(`/api/admin/pets/${petId}/verify`, { method: "PATCH" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({
        pets: get().pets.map(p =>
          p.id === petId ? { ...p, is_verified: true, status: "verified" } : p
        ),
      });
    } catch (err) {
      console.error("❌ Verify pet failed:", err);
    }
  },

  rejectPet: async (petId: string) => {
    try {
      const res = await fetch(`/api/admin/pets/${petId}/reject`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ pets: get().pets.filter(p => p.id !== petId) });
    } catch (err) {
      console.error("❌ Reject pet failed:", err);
    }
  },

  subscribeRealtime: () => {
    const handlePetChange = (payload: SupabasePayload<Pet>) => {
      const { eventType, new: newPet, old: oldPet } = payload;
      const pets = [...get().pets];
      switch (eventType) {
        case "INSERT":
          if (newPet && !pets.some(p => p.id === newPet.id)) set({ pets: [newPet, ...pets] });
          break;
        case "UPDATE":
          if (newPet) set({ pets: pets.map(p => p.id === newPet.id ? { ...p, ...newPet } : p) });
          break;
        case "DELETE":
          if (oldPet) set({ pets: pets.filter(p => p.id !== oldPet.id) });
          break;
      }
    };

    const petsChannel = supabaseClient
      .channel("realtime:pets")
      .on(
        "system",
        { event: "postgres_changes", schema: "public", table: "pets" },
        handlePetChange
      )
      .subscribe();

    return () => supabaseClient.removeChannel(petsChannel);
  },
}));
