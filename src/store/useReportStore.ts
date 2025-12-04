import { create } from 'zustand';
import { Report } from '@/types/reports';

interface ReportState {
  lostReports: Report[];
  foundReports: Report[];
  isLoading: boolean;
  error: string | null;
  fetchLostReports: () => Promise<void>;
  fetchFoundReports: () => Promise<void>;
  deleteLostReport: (id: string) => Promise<void>;
  deleteFoundReport: (id: string) => Promise<void>;
  resolveLostReport: (id: string) => Promise<void>;
  resolveFoundReport: (id: string) => Promise<void>;
}

const optimisticUpdate = (items: Report[], id: string, update: Partial<Report>) => {
  return items.map(item => 
    item.id === id ? { ...item, ...update } : item
  );
};

const optimisticDelete = (items: Report[], id: string) => {
    return items.filter(item => item.id !== id);
}

export const useReportStore = create<ReportState>((set, get) => ({
  lostReports: [],
  foundReports: [],
  isLoading: false,
  error: null,
  fetchLostReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/lost-reports');
      if (!response.ok) {
        throw new Error('Failed to fetch lost reports');
      }
      const data = await response.json();
      set({ lostReports: data.reports, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchFoundReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/found-reports');
      if (!response.ok) {
        throw new Error('Failed to fetch found reports');
      }
      const data = await response.json();
      set({ foundReports: data.reports, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  deleteLostReport: async (id: string) => {
    const originalReports = get().lostReports;
    set({ lostReports: optimisticDelete(originalReports, id) });
    try {
      const response = await fetch(`/api/admin/lost-reports/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete lost report');
      }
    } catch (error) {
      set({ error: (error as Error).message, lostReports: originalReports });
    }
  },
  deleteFoundReport: async (id: string) => {
    const originalReports = get().foundReports;
    set({ foundReports: optimisticDelete(originalReports, id) });
    try {
      const response = await fetch(`/api/admin/found-reports/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete found report');
      }
    } catch (error) {
      set({ error: (error as Error).message, foundReports: originalReports });
    }
  },
  resolveLostReport: async (id: string) => {
    const originalReports = get().lostReports;
    set({ lostReports: optimisticUpdate(originalReports, id, { status: 'resolved' }) });
    try {
      const response = await fetch(`/api/admin/lost-reports/${id}/resolve`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to resolve lost report');
      }
    } catch (error) {
      set({ error: (error as Error).message, lostReports: originalReports });
    }
  },
  resolveFoundReport: async (id: string) => {
    const originalReports = get().foundReports;
    set({ foundReports: optimisticUpdate(originalReports, id, { status: 'resolved' }) });
    try {
      const response = await fetch(`/api/admin/found-reports/${id}/resolve`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to resolve found report');
      }
    } catch (error) {
      set({ error: (error as Error).message, foundReports: originalReports });
    }
  },
}));
