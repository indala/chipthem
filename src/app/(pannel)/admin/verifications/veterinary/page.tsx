'use client';

import { useState, useEffect, useCallback } from 'react';
import { useVeterinariesStore } from '@/store/useVeterinariesStore';
import VeterinaryCard from '@/app/(pannel)/components/VeterinaryCard';
import { VeterinaryClinic } from '@/types/veterinaries';
import {
  FaSpinner,
  FaHospitalAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClinicMedical,
} from 'react-icons/fa';
import Modal from '@/app/(pannel)/components/Modal';
import { StyledButtonProps } from '@/types/types';

// Replaces React-Bootstrap Spinner
const LoadingSpinner = () => (
  <FaSpinner className="animate-spin text-green-600 w-5 h-5 mr-2" />
);

// Replaces React-Bootstrap Button
const StyledButton = ({
  onClick,
  disabled,
  variant,
  children,
  className = '',
}: StyledButtonProps) => {
  let baseClasses =
    'px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';

  if (variant === 'secondary') {
    baseClasses += 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-300';
  } else if (variant === 'outline-secondary') {
    baseClasses +=
      'border border-green-300 text-green-700 hover:bg-green-50 focus:ring-green-200';
  } else {
    baseClasses += 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300';
  }

  if (disabled) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className} flex items-center justify-center`}
    >
      {children}
    </button>
  );
};

export default function VeterinariesPage() {
  const { veterinaries, hasMore, loading } = useVeterinariesStore();
  const storeFetchVeterinaries = useVeterinariesStore(
    (state) => state.fetchVeterinaries
  );
  const storeSubscribeRealtime = useVeterinariesStore(
    (state) => state.subscribeRealtime
  );

  const [selectedVet, setSelectedVet] = useState<VeterinaryClinic | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchVeterinaries = useCallback(
    (reset?: boolean) => {
      storeFetchVeterinaries(reset);
    },
    [storeFetchVeterinaries]
  );

  const subscribeRealtime = useCallback(() => {
    return storeSubscribeRealtime();
  }, [storeSubscribeRealtime]);

  useEffect(() => {
    fetchVeterinaries(true);
  }, [fetchVeterinaries]);

  useEffect(() => {
    const unsub = subscribeRealtime();
    return () => unsub?.();
  }, [subscribeRealtime]);

  const openModal = (vet: VeterinaryClinic) => {
    setSelectedVet(vet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVet(null);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaHospitalAlt className="mr-3 text-green-600" /> Veterinary Clinic
        Verification
      </h2>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ">
        {veterinaries.map((vet, index) => (
          <VeterinaryCard
            key={vet.id}
            vet={vet}
            index={index}
            onView={openModal}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <StyledButton
            onClick={() => fetchVeterinaries()}
            disabled={loading}
            variant="outline-secondary"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <LoadingSpinner /> Loading...
              </>
            ) : (
              'Load More Clinics'
            )}
          </StyledButton>
        </div>
      )}

      {/* Render Modal ONLY when showModal is true */}
      {showModal && selectedVet && (
        <Modal onClose={closeModal} title="Veterinary Clinic Details">
          <div className="space-y-4 p-2">
            {/* Clinic Name */}
            <div className="text-center mb-4">
              <h6 className="text-2xl font-semibold text-green-600">
                {selectedVet.clinic_name}
              </h6>
            </div>

            {/* Status Badge */}
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="font-medium">
                <strong>Status:</strong>{' '}
                <span
                  className={`ml-1 font-bold ${
                    selectedVet.is_verified
                      ? 'text-green-700'
                      : 'text-yellow-600'
                  }`}
                >
                  {selectedVet.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-gray-700 mb-6">
              <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg">
                <FaEnvelope className="mr-3 text-gray-400 w-4 h-4 flex-shrink-0" />
                <span className="break-all">{selectedVet.email}</span>
              </div>

              {selectedVet.phone && (
                <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg">
                  <FaPhoneAlt className="mr-3 text-gray-400 w-4 h-4 flex-shrink-0" />
                  {selectedVet.phone}
                </div>
              )}

              {selectedVet.city && (
                <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="mr-3 text-gray-400 w-4 h-4 flex-shrink-0" />
                  {selectedVet.city}, {selectedVet.country || ''}
                </div>
              )}
            </div>

            {/* Clinic Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h6 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                <FaClinicMedical className="mr-2 text-green-500 w-5 h-5" />
                Additional Information
              </h6>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <strong>License:</strong>{' '}
                  {selectedVet.license_number || 'N/A'}
                </div>
                <div>
                  <strong>Years in Practice:</strong>{' '}
                  {selectedVet.years_in_practice || 'N/A'}
                </div>
                <div>
                  <strong>24H Emergency:</strong>{' '}
                  <span
                    className={
                      selectedVet.provides_24h_emergency
                        ? 'text-green-600 font-medium'
                        : 'text-red-500'
                    }
                  >
                    {selectedVet.provides_24h_emergency ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <strong>Microchip Services:</strong>{' '}
                  <span
                    className={
                      selectedVet.microchip_services
                        ? 'text-green-600 font-medium'
                        : 'text-red-500'
                    }
                  >
                    {selectedVet.microchip_services ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <strong>Has Scanners:</strong>{' '}
                  <span
                    className={
                      selectedVet.has_microchip_scanners
                        ? 'text-green-600 font-medium'
                        : 'text-red-500'
                    }
                  >
                    {selectedVet.has_microchip_scanners ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
