'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useVeterinariesStore } from '@/store/useVeterinariesStore';
import VeterinaryCard from '@/app/(pannel)/components/VeterinaryCard';
import { VeterinaryClinic } from '@/types/veterinaries';

export default function VeterinariesPage() {
  const { veterinaries, hasMore, loading } = useVeterinariesStore();
  const storeFetchVeterinaries = useVeterinariesStore((state) => state.fetchVeterinaries);
  const storeSubscribeRealtime = useVeterinariesStore((state) => state.subscribeRealtime);

  const [selectedVet, setSelectedVet] = useState<VeterinaryClinic | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Stable fetch function
  const fetchVeterinaries = useCallback(
    (reset?: boolean) => {
      storeFetchVeterinaries(reset);
    },
    [storeFetchVeterinaries]
  );

  // Stable subscribe function
  const subscribeRealtime = useCallback(() => {
    return storeSubscribeRealtime();
  }, [storeSubscribeRealtime]);

  // Fetch on load
  useEffect(() => {
    fetchVeterinaries(true);
  }, [fetchVeterinaries]);

  // Realtime subscription
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
    <div className="p-4 bg-light">
      <h2 className="fw-semibold mb-4">🏥 Veterinary Clinic Verification</h2>

      {/* --- Clinics Grid --- */}
      <div className="d-flex flex-wrap gap-3">
        {veterinaries.map((vet, index) => (
          <VeterinaryCard key={vet.id} vet={vet} index={index} onView={openModal} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-4">
          <Button
            onClick={() => fetchVeterinaries()}
            disabled={loading}
            variant="outline-secondary"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* --- Modal --- */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Veterinary Clinic Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVet ? (
            <>
              <h6>{selectedVet.clinic_name}</h6>
              <p className="text-muted mb-2">{selectedVet.email}</p>
              {selectedVet.phone && (
                <p className="text-muted mb-2">📞 {selectedVet.phone}</p>
              )}
              {selectedVet.city && (
                <p className="text-muted">
                  📍 {selectedVet.city}, {selectedVet.country || ''}
                </p>
              )}
              <div className="mb-3">
                <strong>Status:</strong>{" "}
                {selectedVet.is_verified ? 'Verified' : 'Unverified'}
              </div>

              <h6 className="mt-3">🩺 Clinic Info</h6>
              <ul>
                <li>License: {selectedVet.license_number || 'N/A'}</li>
                <li>Years in Practice: {selectedVet.years_in_practice || 'N/A'}</li>
                <li>Provides 24H Emergency: {selectedVet.provides_24h_emergency ? 'Yes' : 'No'}</li>
                <li>Microchip Services: {selectedVet.microchip_services ? 'Yes' : 'No'}</li>
                <li>Has Scanners: {selectedVet.has_microchip_scanners ? 'Yes' : 'No'}</li>
              </ul>
            </>
          ) : (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
