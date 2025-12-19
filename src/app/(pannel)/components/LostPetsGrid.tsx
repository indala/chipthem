'use client';

import { useState } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { ReportCard } from './ReportCard';
import Modal from './Modal';

export default function LostPetsGrid() {
  const { lostReports, isLoading, deleteLostReport, resolveLostReport } =
    useReportStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteLostReport(id);
    if (selectedId === id) setSelectedId(null);
  };

  const handleResolve = async (id: string) => {
    await resolveLostReport(id);
  };

  const handleViewDetails = (id: string) => {
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
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

  const selectedReport = selectedId
    ? lostReports.find((r) => r.id === selectedId)
    : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 py-4">
        {lostReports.map((report) => (
          <div key={report.id} className="col-span-1">
            <ReportCard
              report={report}
              reportType="lost"
              onDelete={handleDelete}
              onResolve={handleResolve}
              onViewDetails={handleViewDetails}
            />
          </div>
        ))}
      </div>

      {selectedReport && (
        <Modal
          title={selectedReport.pet_name ?? 'Lost pet details'}
          onClose={handleCloseModal}
        >
          <div className="space-y-4 text-sm text-gray-800">
            {/* Top section: basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Pet name:</span>{' '}
                  {selectedReport.pet_name ?? 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{' '}
                  {selectedReport.pet_type}
                </p>
                <p>
                  <span className="font-semibold">Color:</span>{' '}
                  {selectedReport.color}
                </p>
                <p>
                  <span className="font-semibold">Size:</span>{' '}
                  {selectedReport.size}
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Last seen location:</span>{' '}
                  {selectedReport.last_seen_location ?? 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Reported on:</span>{' '}
                  {new Date(selectedReport.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={
                      selectedReport.status === 'resolved'
                        ? 'text-green-600 font-semibold'
                        : 'text-yellow-600 font-semibold'
                    }
                  >
                    {selectedReport.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Optional: footer note */}
            <p className="text-xs text-gray-500 border-t pt-3">
              These details were submitted by the pet owner when reporting the
              loss.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
