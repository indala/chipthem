'use client';

import { useState, useEffect, useCallback } from 'react';
// Removed: Button, Modal, Spinner imports from 'react-bootstrap'
import { useVeterinariesStore } from '@/store/useVeterinariesStore';
import VeterinaryCard from '@/app/(pannel)/components/VeterinaryCard';
import { VeterinaryClinic } from '@/types/veterinaries';
import { FaTimes, FaSpinner, FaHospitalAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClinicMedical } from 'react-icons/fa';
import { StyledButtonProps } from '@/types/types';

// --- Reusable Tailwind Utility Components ---

// Replaces React-Bootstrap Spinner
const LoadingSpinner = () => (
  <FaSpinner className="animate-spin text-green-600 w-5 h-5 mr-2" />
);

// Replaces React-Bootstrap Button
const StyledButton = ({ onClick, disabled, variant, children, className = '' }: StyledButtonProps) => {
  let baseClasses = 'px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
  
  // Customizing for Green/Success theme (matching 'Veterinary' role from previous file)
  if (variant === 'secondary') {
    baseClasses += 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-300';
  } else if (variant === 'outline-secondary') {
    baseClasses += 'border border-green-300 text-green-700 hover:bg-green-50 focus:ring-green-200';
  } else {
    // Default to green primary style
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


// Replaces React-Bootstrap Modal for Veterinary Details
const VetModal = ({ show, onClose, vet }: { show: boolean; onClose: () => void; vet: VeterinaryClinic | null }) => {
  if (!show) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal.Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h5 className="text-xl font-bold text-gray-900">Veterinary Clinic Details</h5>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Modal.Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {vet ? (
            <div>
              <h6 className="text-2xl font-semibold text-green-600 mb-1">{vet.clinic_name}</h6>
              
              <div className="bg-green-50 p-3 rounded-lg mb-4 text-sm">
                <p className="mb-0 font-medium">
                  <strong>Status:</strong> 
                  <span className={`ml-1 font-bold ${vet.is_verified ? 'text-green-700' : 'text-yellow-600'}`}>
                    {vet.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-gray-700 mb-6">
                <p className="text-sm flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {vet.email}
                </p>
                
                {vet.phone && (
                  <p className="text-sm flex items-center">
                    <FaPhoneAlt className="mr-2 text-gray-400" />
                    {vet.phone}
                  </p>
                )}
                
                {vet.city && (
                  <p className="text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {vet.city}, {vet.country || ''}
                  </p>
                )}
              </div>

              {/* Clinic Info */}
              <h6 className="text-lg font-bold text-gray-700 mb-3 flex items-center border-t pt-3">
                <FaClinicMedical className="mr-2 text-green-500" /> Additional Info
              </h6>
              
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><span className="font-semibold">License:</span> {vet.license_number || 'N/A'}</li>
                <li><span className="font-semibold">Years in Practice:</span> {vet.years_in_practice || 'N/A'}</li>
                <li><span className="font-semibold">24H Emergency:</span> <span className={vet.provides_24h_emergency ? 'text-green-600 font-medium' : 'text-red-500'}>{vet.provides_24h_emergency ? 'Yes' : 'No'}</span></li>
                <li><span className="font-semibold">Microchip Services:</span> <span className={vet.microchip_services ? 'text-green-600 font-medium' : 'text-red-500'}>{vet.microchip_services ? 'Yes' : 'No'}</span></li>
                <li><span className="font-semibold">Has Scanners:</span> <span className={vet.has_microchip_scanners ? 'text-green-600 font-medium' : 'text-red-500'}>{vet.has_microchip_scanners ? 'Yes' : 'No'}</span></li>
              </ul>
            </div>
          ) : (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Modal.Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <StyledButton variant="secondary" onClick={onClose}>
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function VeterinariesPage() {
  const { veterinaries, hasMore, loading } = useVeterinariesStore();
  const storeFetchVeterinaries = useVeterinariesStore((state) => state.fetchVeterinaries);
  const storeSubscribeRealtime = useVeterinariesStore((state) => state.subscribeRealtime);

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

  const closeModal = () => setShowModal(false);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaHospitalAlt className="mr-3 text-green-600" /> Veterinary Clinic Verification
      </h2>

      {/* --- Clinics Grid (Replacing d-flex flex-wrap gap-3) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {veterinaries.map((vet, index) => (
          <VeterinaryCard key={vet.id} vet={vet} index={index} onView={openModal} />
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

      {/* --- Modal (Using the custom component) --- */}
      <VetModal show={showModal} onClose={closeModal} vet={selectedVet} />
    </div>
  );
}