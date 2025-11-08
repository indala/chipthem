'use client';

import { useEffect } from 'react';
import { useVeterinaryStore } from '@/store/useVeterinaryStore';
import VeterinaryProfile from '../../components/VeterinaryProfile';
import { VeterinaryClinic } from '@/types/veterinaries';
export default function VeterinaryDashboard() {
  const { veterinary, isLoading, error, fetchVeterinaryData } = useVeterinaryStore();

  useEffect(() => {
    fetchVeterinaryData();
  }, [fetchVeterinaryData]);

  if (isLoading) {
    return <div className="text-center p-12">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-12 text-red-600">
        <p>Error loading data: {error}</p>
        <p>Please try reloading the page or contact support.</p>
      </div>
    );
  }

  if (!veterinary) {
    return <div className="text-center p-12">No veterinary data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Dashboard</h1>
      <div className="space-y-8">
        <VeterinaryProfile veterinary={veterinary} />
      </div>
    </div>
  );
}
