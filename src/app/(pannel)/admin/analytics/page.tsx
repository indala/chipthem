// src/app/(panels)/analytics/page.tsx
import AnalyticsClient from "../../components/AnalyticsClient";

export default function AnalyticsPage() {
  // Server component wrapper: no data prefetch here because the client store fetches the data.
  // If you prefer server-side prefetch, you can fetch and pass as props.
  return <AnalyticsClient />;
}
