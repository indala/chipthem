// src/store/usersStore.ts
import { create } from "zustand";
import { Owner } from "@/types/owners";
import { VeterinaryClinic } from "@/types/veterinaries";
export interface User {
  id: string;
  name: string; // full_name for owners, clinic_name for veterinary
  email: string;
  is_verified: boolean;
}

interface UsersState {
  petOwners: User[];
  veterinaries: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  petOwners: [],
  veterinaries: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (!data.success) {
        set({ loading: false, error: data.error });
        return;
      }

      // Map owners and veterinaries to a common User type
      const owners: User[] = data.petOwners.map((o:Owner) => ({
        id: o.id,
        name: o.full_name, // owners
        email: o.email,
        is_verified: o.is_verified,
      }));

      const vets: User[] = data.veterinaries.map((v:VeterinaryClinic) => ({
        id: v.id,
        name: v.clinic_name, // ← change here!
        email: v.email,
        is_verified: v.is_verified,
      }));

      set({ petOwners: owners, veterinaries: vets, loading: false });
    } catch (err: unknown) {
      console.error("❌ Fetch users failed:", err);
      set({ loading: false, error: (err as Error).message });
    }
  },
}));
