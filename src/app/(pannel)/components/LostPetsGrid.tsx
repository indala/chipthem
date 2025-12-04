'use client';

import { useReportStore } from "@/store/useReportStore";
import { ReportCard } from "./ReportCard";
// Removed: Row, Col imports from 'react-bootstrap'

export default function LostPetsGrid() {
  const { lostReports, isLoading, deleteLostReport, resolveLostReport } = useReportStore();

  const handleDelete = async (id: string) => {
    await deleteLostReport(id);
  };

  const handleResolve = async (id: string) => {
    await resolveLostReport(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500 text-lg">Loading lost pet reports...</p>
      </div>
    );
  }

  if (lostReports.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500 text-lg">No lost pet reports found.</p>
      </div>
    );
  }

  return (
    // Replaced <Row className="g-4 py-4"> 
    // This div establishes the responsive grid:
    // grid-cols-1 (1 column on small screens, equivalent to xs={12})
    // md:grid-cols-2 (2 columns on medium screens, equivalent to md={6})
    // lg:grid-cols-3 (3 columns on large screens, equivalent to lg={4})
    // gap-6 (Replaces Bootstrap's g-4 for spacing)
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {lostReports.map((report) => (
        // Replaced <Col key={report.id} xs={12} md={6} lg={4}>
        // Each child occupies one column (col-span-1), allowing the parent grid to handle responsiveness.
        <div key={report.id} className="col-span-1">
          <ReportCard 
            report={report} 
            reportType="lost" 
            onDelete={() => handleDelete(report.id)} 
            onResolve={() => handleResolve(report.id)} 
          />
        </div>
      ))}
    </div>
  );
}