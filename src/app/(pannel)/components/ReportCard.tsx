'use client';

import React from 'react';
// Removed: Badge, Button, Card imports from "react-bootstrap"
import { Report } from '@/types/reports';
import { FaMapMarkerAlt, FaRulerCombined, FaPalette, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';

interface ReportCardProps {
  report: Report;
  reportType: 'lost' | 'found';
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}

// --- Tailwind Utility Component: Badge ---
const StatusBadge = ({ reportType, status }: { reportType: 'lost' | 'found', status: string }) => {
    let colorClass = '';
    let statusText = reportType === 'lost' ? 'Lost' : 'Found';

    if (status === 'resolved') {
        colorClass = 'bg-green-500';
        statusText = 'Resolved';
    } else if (reportType === 'lost') {
        colorClass = 'bg-red-500'; // danger
    } else {
        colorClass = 'bg-gray-500'; // secondary
    }

    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase leading-none rounded-full text-white ${colorClass}`}
        >
            {statusText}
        </span>
    );
};
// --- End StatusBadge ---


export function ReportCard({ report, reportType, onResolve, onDelete }: ReportCardProps) {
  const location = reportType === 'lost' ? report.last_seen_location : report.found_location;
  const title = reportType === 'lost' ? report.pet_name : `Found ${report.pet_type}`;
  const isResolved = report.status === 'resolved';

  return (
    // Replaced <Card className={`h-100 ${isResolved ? 'bg-light-green' : ''}`}>
    // Custom background color for resolved status (you may need to define 'bg-light-green' in your config)
    <div
      className={`h-full border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl ${
        isResolved ? 'bg-green-50' : 'bg-white'
      }`}
    >
      {/* Replaced <Card.Image variant="top" ... /> */}
      {report.pet_photo && (
        <div className="w-full" style={{ height: '200px' }}>
          <Image
            src={report.pet_photo}
            alt={title || 'Pet photo'}
            height={200}
            width={400}
            className="w-full h-full object-cover" // Replaced inline style
          />
        </div>
      )}

      {/* Replaced <Card.Body className="d-flex flex-column"> */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header */}
        {/* d-flex justify-content-between align-items-start mb-2 -> flex justify-between items-start mb-2 */}
        <div className="flex justify-between items-start mb-2">
          {/* Replaced <Card.Title className="mb-0"> */}
          <h4 className="text-xl font-bold text-gray-800 mb-0">{title}</h4>
          {/* Replaced <Badge> */}
          <StatusBadge reportType={reportType} status={report.status || ''} />
        </div>

        {/* Replaced <Card.Text as="div"> */}
        <div className="text-sm text-gray-700 space-y-1 mt-2 flex-grow">
          <p className="flex items-center">
            <FaPalette className="text-gray-400 mr-2" />
            <span className="font-semibold">Color:</span> {report.color}
          </p>
          <p className="flex items-center">
            <FaRulerCombined className="text-gray-400 mr-2" />
            <span className="font-semibold">Size:</span> {report.size}
          </p>
          <p className="flex items-center">
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <span className="font-semibold">Location:</span> {location}
          </p>

          <p className="text-xs text-gray-500 pt-2 border-t mt-3">
            Reported on: {new Date(report.created_at).toLocaleDateString()}
          </p>
          {report.status && (
            <p className={`font-bold mt-1 capitalize text-sm ${isResolved ? 'text-green-600' : 'text-yellow-600'}`}>
              Status: {report.status}
            </p>
          )}
        </div>
      </div>

      {/* Replaced <Card.Footer className="d-flex justify-content-end"> */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
        {/* Resolve Button */}
        {!isResolved && (
          // Replaced <Button size="sm" variant="outline-success" ...>
          <button
            onClick={() => onResolve(report.id)}
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg border border-green-500 text-green-600 hover:bg-green-50 transition-colors"
          >
            <FaCheckCircle className="mr-2" /> Resolve
          </button>
        )}
        {/* Delete Button */}
        {/* Replaced <Button size="sm" variant="danger" ...> */}
        <button
          onClick={() => onDelete(report.id)}
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <FaTrashAlt className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
}