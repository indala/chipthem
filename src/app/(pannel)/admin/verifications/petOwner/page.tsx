"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { usePetsStore } from "@/store/usePetsStore";
import PetCard from "@/app/(pannel)/components/PetCard";
import { Pet } from "@/types/owners";

export default function PetsPage() {
  const { pets, fetchPets, subscribeRealtime, hasMore, loading } = usePetsStore();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch pets on mount
  useEffect(() => {
    fetchPets(true);
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const unsub = subscribeRealtime();
    return () => unsub?.();
  });

  // Open modal
  const openModal = (pet: Pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  return (
    <div className="p-4 bg-light">
      <h2 className="fw-semibold mb-4">🐾 Pet Verification</h2>

      {/* --- Pets Grid --- */}
      <div className="d-flex flex-wrap gap-3">
        {pets.map((pet, index) => (
          <PetCard key={pet.id} pet={pet} index={index} onView={openModal} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-4">
          <Button
            onClick={() => fetchPets()}
            disabled={loading}
            variant="outline-secondary"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* --- Modal --- */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pet Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPet ? (
            <>
              <h5>{selectedPet.pet_name}</h5>
              <p className="text-muted mb-2">{selectedPet.pet_type || "Unknown type"}</p>
              <div className="mb-3">
                <strong>Status:</strong>{" "}
                {selectedPet.status || "N/A"} – {selectedPet.is_verified ? "Verified" : "Unverified"}
              </div>

              {/* Owner Info */}
              {selectedPet.owner && (
                <>
                  <h6 className="mt-3">👤 Owner</h6>
                  <p>{selectedPet.owner.full_name}</p>
                  <p className="text-muted mb-2">{selectedPet.owner.email}</p>
                  {selectedPet.owner.phone_number && (
                    <p className="text-muted mb-2">📞 {selectedPet.owner.phone_number}</p>
                  )}
                  {selectedPet.owner.city && (
                    <p className="text-muted">
                      📍 {selectedPet.owner.city}, {selectedPet.owner.country || ""}
                    </p>
                  )}
                </>
              )}
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
