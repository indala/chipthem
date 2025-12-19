// e.g. in "@/types/analytics.ts"
import type { ReportStatus } from '@/types/types';

export interface LostReportAnalytics {
  pet_type: string | null;
  color: string | null;
  created_at: string;
  last_seen_location: string | null;
  status: ReportStatus;
}

export interface FoundReportAnalytics {
  pet_type: string | null;
  color: string | null;
  created_at: string;
  found_location: string | null;
  status: ReportStatus;
}
