// useUsersStore.ts - FULLY FIXED VERSION

import { create } from "zustand";
import { Owner, Pet } from "@/types/owners"; 
import { VeterinaryClinic } from "@/types/veterinaries";

export type TabType = "owners" | "veterinaries";

interface ActionStatus {
    loading: boolean;
    error: string | null;
}

type EntityActionStatus = Record<string, ActionStatus>;

interface ActionLoadingState {
    pet: EntityActionStatus;
    clinic: EntityActionStatus;
    user: EntityActionStatus;
}

export type User = 
  | (Owner & { 
      type: 'owners'; 
      clinicFields?: never;
      name: string;
    })
  | (VeterinaryClinic & { 
      type: 'veterinaries'; 
      petFields?: never;
      name: string;
    }); 

// ✅ Type guards for store actions
const isOwner = (user: User): user is Extract<User, { type: 'owners' }> => 
  user.type === 'owners';



interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  actionStatus: ActionLoadingState; 
  page: number;
  hasMore: boolean;
  _setActionStatus: (type: keyof ActionLoadingState, id: string, status: Partial<ActionStatus>) => void;
  
  fetchOwners: (page: number, search: string) => Promise<void>;
  fetchVeterinaries: (page: number, search: string) => Promise<void>;
  
  resetUsers: () => void;

  deletePet: (petId: string) => Promise<void>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>;
  
  deleteClinic: (veterinaryId: string) => Promise<void>;
  updateClinic: (veterinaryId: string, updates: Partial<VeterinaryClinic>) => Promise<void>;

  updateUserEmail: (userId: string, newEmail: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  actionStatus: {
    pet: {},
    clinic: {},
    user: {},
  },
  page: 1,
  hasMore: true,

  resetUsers: () => {
    set({
      users: [],
      page: 1,
      hasMore: true,
      error: null,
      actionStatus: { pet: {}, clinic: {}, user: {} },
    });
  },

  _setActionStatus: (type: keyof ActionLoadingState, id: string, status: Partial<ActionStatus>) => {
    set(state => ({
      actionStatus: {
        ...state.actionStatus,
        [type]: {
          ...state.actionStatus[type],
          [id]: {
            ...state.actionStatus[type][id],
            ...status,
          },
        },
      },
    }));
  },

  fetchOwners: async (page, search) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    
    try {
      const res = await fetch(`/api/admin/users?type=owners&page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch owners.');

      const fetchedOwners: User[] = data.petOwners.map((o: Owner) => ({
        ...o,
        type: 'owners' as const,
        name: o.full_name,
      }));

      set({
        users: [...get().users, ...fetchedOwners],
        page,
        hasMore: fetchedOwners.length === 10,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Fetch owners failed:", err);
      set({ loading: false, error: (err as Error).message });
    }
  },

  fetchVeterinaries: async (page, search) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    
    try {
      const res = await fetch(`/api/admin/users?type=veterinaries&page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch vets.');

      const fetchedVets: User[] = data.veterinaries.map((v: VeterinaryClinic) => ({
        ...v,
        type: 'veterinaries' as const,
        name: v.clinic_name,
      }));

      set({
        users: [...get().users, ...fetchedVets],
        page,
        hasMore: fetchedVets.length === 10,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Fetch vets failed:", err);
      set({ loading: false, error: (err as Error).message });
    }
  },

  // ✅ FIXED: Type-safe pet operations
  deletePet: async (petId) => {
    get()._setActionStatus('pet', petId, { loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/users/pets/${petId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set(state => ({
        users: state.users.map((u) => {
          if (isOwner(u)) {
            return {
              ...u,
              pets: u.pets?.filter((p) => p.id !== petId) || [],
            };
          }
          return u;
        }),
        actionStatus: {
          ...state.actionStatus,
          pet: { ...state.actionStatus.pet, [petId]: { loading: false, error: null } },
        }
      }));
    } catch (err) {
      console.error("❌ Delete pet failed:", err);
      const errorMessage = (err as Error).message;
      get()._setActionStatus('pet', petId, { loading: false, error: errorMessage });
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updatePet: async (petId, updates) => {
    get()._setActionStatus('pet', petId, { loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/users/pets/${petId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set(state => ({
        users: state.users.map((u) => {
          if (isOwner(u)) {
            return {
              ...u,
              pets: u.pets?.map((p) =>
                p.id === petId ? { ...p, ...updates } : p
              ) || [],
            };
          }
          return u;
        }),
        actionStatus: {
          ...state.actionStatus,
          pet: { ...state.actionStatus.pet, [petId]: { loading: false, error: null } },
        }
      }));
    } catch (err) {
      console.error("❌ Update pet failed:", err);
      const errorMessage = (err as Error).message;
      get()._setActionStatus('pet', petId, { loading: false, error: errorMessage });
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteClinic: async (veterinaryId) => {
    get()._setActionStatus('clinic', veterinaryId, { loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/users/clinics/${veterinaryId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set(state => ({
        users: state.users.filter((u) => u.id !== veterinaryId),
        actionStatus: {
          ...state.actionStatus,
          clinic: { ...state.actionStatus.clinic, [veterinaryId]: { loading: false, error: null } },
        }
      }));
    } catch (err) {
      console.error("❌ Delete clinic failed:", err);
      const errorMessage = (err as Error).message;
      get()._setActionStatus('clinic', veterinaryId, { loading: false, error: errorMessage });
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateClinic: async (veterinaryId, updates) => {
    get()._setActionStatus('clinic', veterinaryId, { loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/users/clinics/${veterinaryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      const updatedData = data.clinic;

      set(state => ({
        users: state.users.map((u) =>
          u.id === veterinaryId ? { 
            ...u, 
            ...updates, 
            name: updatedData?.clinic_name || u.name 
          } : u
        ),
        actionStatus: {
          ...state.actionStatus,
          clinic: { ...state.actionStatus.clinic, [veterinaryId]: { loading: false, error: null } },
        }
      }));
    } catch (err) {
      console.error("❌ Update clinic failed:", err);
      const errorMessage = (err as Error).message;
      get()._setActionStatus('clinic', veterinaryId, { loading: false, error: errorMessage });
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateUserEmail: async (userId, newEmail) => {
    get()._setActionStatus('user', userId, { loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set(state => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, email: newEmail } : u
        ),
        actionStatus: {
          ...state.actionStatus,
          user: { ...state.actionStatus.user, [userId]: { loading: false, error: null } },
        }
      }));
    } catch (err) {
      console.error("❌ Update user email failed:", err);
      const errorMessage = (err as Error).message;
      get()._setActionStatus('user', userId, { loading: false, error: errorMessage });
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
