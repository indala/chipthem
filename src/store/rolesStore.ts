// store/rolesStore.ts
import { create } from "zustand";

interface RoleUser {
  id: string;
  username: string;
  email: string;
  role: "admin" | "veterinary" | "petOwner" | "guest";
}

interface RolesStore {
  user: RoleUser | null;
  setUser: (user: RoleUser) => void;
  clearUser: () => void;
}

export const useRolesStore = create<RolesStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
