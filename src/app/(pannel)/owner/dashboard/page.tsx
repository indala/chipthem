'use client';

import { useEffect } from 'react';
import { useOwnerStore } from '@/store/useOwnerStore';
import OwnerProfile from '@/app/(pannel)/components/OwnerProfile';
import PetList from '@/app/(pannel)/components/PetList';
export default function OwnerDashboard() {
  const { owner, pets, isLoading, error, fetchOwnerData } = useOwnerStore();

  useEffect(() => {
    fetchOwnerData();
  }, [fetchOwnerData]);

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

  if (!owner) {
    return <div className="text-center p-12">No owner data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Dashboard</h1>
      <div className="space-y-8">
        <OwnerProfile owner={owner} />
        <PetList pets={pets} />
      </div>
    </div>
  );
}
