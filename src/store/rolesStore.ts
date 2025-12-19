// store/rolesStore.ts
import { create } from "zustand";
import type { UserRole } from "@/types/types";
interface RoleUser {
  id: string;
  username: string;
  email: string;
  role:UserRole;
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
