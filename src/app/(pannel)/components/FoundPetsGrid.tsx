'use client';

import { useReportStore } from "@/store/useReportStore";
import { ReportCard } from "./ReportCard";
// Removed: Row, Col imports from 'react-bootstrap'

export default function FoundPetsGrid() {
  const { foundReports, isLoading, deleteFoundReport, resolveFoundReport } = useReportStore();

  const handleDelete = async (id: string) => {
    await deleteFoundReport(id);
  };

  const handleResolve = async (id: string) => {
    await resolveFoundReport(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500 text-lg">Loading found pet reports...</p>
      </div>
    );
  }

  if (foundReports.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500 text-lg">No found pet reports found.</p>
      </div>
    );
  }

  return (
    // Replaced <Row className="g-4 py-4"> with Tailwind CSS Grid
    <div className="grid gap-6 md:gap-8 py-4">
      {foundReports.map((report) => (
        // The classes below replicate the Bootstrap column structure:
        // xs={12} -> w-full (default for grid item)
        // md={6} -> md:col-span-1 / md:w-1/2 (since we use grid, we use columns)
        // lg={4} -> lg:col-span-1 / lg:w-1/3
        
        <div 
          key={report.id} 
          // Grid setup: 1 column on mobile, 2 columns on md, 3 columns on lg
          className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1" // Base for grid item
          // Applying the responsive column count to the parent grid wrapper
          style={{ 
            display: 'contents', // Allows the child to define its own width within the grid
          }}
        >
          {/* We define the grid on the parent container (the outer `div` above) */}
          {/* For simplicity, we define the grid configuration directly on the parent div: */}
          {/* The parent div is: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-4" */}
          {/* Let's redefine the parent div structure to use a more standard Tailwind grid: */}

          <ReportCard 
            report={report} 
            reportType="found" 
            onDelete={() => handleDelete(report.id)} 
            onResolve={() => handleResolve(report.id)} 
          />
        </div>
      ))}
    </div>
  );
}

/* * NOTE ON GRID CONVERSION:
 * To accurately replicate the responsive grid structure (xs=12, md=6, lg=4) 
 * using Tailwind, we modify the wrapper DIV to be a multi-column grid:
 * * ORIGINAL: 
 * <Row className="g-4 py-4">
 * <Col xs={12} md={6} lg={4}>...</Col>
 * ...
 * </Row>
 * * TAILWIND REPLACEMENT:
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
 * <div className="col-span-1">...</div>
 * ...
 * </div>
 * * The `col-span-1` utility is the default for children, which simplifies the code.
 * */