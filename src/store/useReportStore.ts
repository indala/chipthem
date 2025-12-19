import { create } from 'zustand';
import type { Report } from '@/types/reports';
import type { LostReport, FoundReport } from '@/types/types';

interface ReportState {
  // list views
  lostReports: Report[];
  foundReports: Report[];
  // detail views
  selectedLost: LostReport | null;
  selectedFound: FoundReport | null;
  isLoading: boolean;
  error: string | null;

  fetchLostReports: () => Promise<void>;
  fetchFoundReports: () => Promise<void>;
  deleteLostReport: (id: string) => Promise<void>;
  deleteFoundReport: (id: string) => Promise<void>;
  resolveLostReport: (id: string) => Promise<void>;
  resolveFoundReport: (id: string) => Promise<void>;
}

const optimisticDelete = (items: Report[], id: string): Report[] =>
  items.filter((item) => item.id !== id);

export const useReportStore = create<ReportState>((set, get) => ({
  lostReports: [],
  foundReports: [],
  selectedLost: null,
  selectedFound: null,
  isLoading: false,
  error: null,

  // list: lost
  fetchLostReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/lost-reports');
      if (!response.ok) {
        throw new Error('Failed to fetch lost reports');
      }
      const data = await response.json(); // { reports: Report[] }
      set({ lostReports: data.reports, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // list: found
  fetchFoundReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/found-reports');
      if (!response.ok) {
        throw new Error('Failed to fetch found reports');
      }
      const data = await response.json(); // { reports: Report[] }
      set({ foundReports: data.reports, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // delete: lost
  deleteLostReport: async (id: string) => {
    const originalReports = get().lostReports;
    // optimistic: remove immediately
    set({ lostReports: optimisticDelete(originalReports, id) });
    try {
      const response = await fetch(`/api/admin/lost-reports/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete lost report');
      }
      // success: nothing else to do, already removed
    } catch (error) {
      // rollback on error
      set({
        error: (error as Error).message,
        lostReports: originalReports
      });
    }
  },

  // delete: found
  deleteFoundReport: async (id: string) => {
    const originalReports = get().foundReports;
    set({ foundReports: optimisticDelete(originalReports, id) });
    try {
      const response = await fetch(`/api/admin/found-reports/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete found report');
      }
    } catch (error) {
      set({
        error: (error as Error).message,
        foundReports: originalReports
      });
    }
  },

  // resolve: lost → remove from list after resolve
  resolveLostReport: async (id: string) => {
    const originalReports = get().lostReports;
    // optimistic: remove immediately (since list shows only unresolved)
    set({ lostReports: optimisticDelete(originalReports, id) });
    try {
      const response = await fetch(`/api/admin/lost-reports/${id}/resolve`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error('Failed to resolve lost report');
      }
      // success: keep it removed
    } catch (error) {
      // rollback on error
      set({
        error: (error as Error).message,
        lostReports: originalReports
      });
    }
  },

  // resolve: found → remove from list after resolve
  resolveFoundReport: async (id: string) => {
    const originalReports = get().foundReports;
    set({ foundReports: optimisticDelete(originalReports, id) });
    try {
      const response = await fetch(`/api/admin/found-reports/${id}/resolve`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error('Failed to resolve found report');
      }
    } catch (error) {
      set({
        error: (error as Error).message,
        foundReports: originalReports
      });
    }
  }
}));
